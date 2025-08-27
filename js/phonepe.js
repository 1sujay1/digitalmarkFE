// PhonePe Payment Integration JS
// Usage: Attach to a button with id 'payBtn' on your payment page

// --- Payment Initiation ---
async function initiatePhonePePayment(e) {
  e.stopPropagation();
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Starting payment...";
  const token = getToken();
  const getAllCartItemsResponse = await getCartItems();
  const getAllCartItems = getAllCartItemsResponse.products || [];
  const productIds = getAllCartItems.map((p) => p._id);
  try {
    // Call backend to create PhonePe order
    const res = await fetch(`${BASE_URL}/api/v1/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productIds }),
    });
    const data = await res.json();
    const tokenUrl = data?.data?.phonepeRedirectUrl;
    if (data.status === 200 && tokenUrl) {
      statusEl.textContent = "Opening payment widget...";
      window.PhonePeCheckout.transact({
        tokenUrl,
        type: "IFRAME",
        callback: function (response) {
          // possible responses: 'USER_CANCEL', 'CONCLUDED', 'SDK_ERROR'
          console.log("PhonePe checkout callback", response);
          if (response === "USER_CANCEL") {
            statusEl.textContent = "Payment cancelled by user.";
            fetch(`${BASE_URL}/api/v1/cancel-order`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                merchantOrderId: data.data.merchantOrderId,
              }),
            })
              .then((res) => res.json())
              .then((cancelData) => {
                if (cancelData.status === 200) {
                  statusEl.textContent = "Order cancelled successfully.";
                } else {
                  statusEl.textContent =
                    cancelData.message || "Failed to cancel order.";
                }
              })
              .catch((err) => {
                statusEl.textContent = "Error cancelling order.";
                console.error("Cancel order error:", err);
              });
          } else if (response === "CONCLUDED") {
            statusEl.textContent = "Payment finished. Verifying...";
            window.location.href = data.data.phonepeCallbackUrl;
            // Optionally you can trigger server-side order status check here
            // fetch('/api/order-status?merchantOrderId=' + data.merchantOrderId)
          } else {
            statusEl.textContent =
              "Payment result: " + JSON.stringify(response);
          }
        },
      });
    } else {
      alert(data.message || "Failed to initiate payment");
    }
  } catch (err) {
    console.error("Error creating PhonePe order:", err);
    statusEl.textContent = "Payment initiation failed: " + (err.message || err);
    // alert("Something went wrong while initiating payment.");
  }
}

// --- Payment Status Check ---
async function checkPhonePePaymentStatus(
  merchantOrderId,
  token,
  statusElementId = "status"
) {
  const statusDiv = document.getElementById(statusElementId);
  if (!merchantOrderId) {
    if (statusDiv) statusDiv.innerText = "Missing merchantOrderId.";
    return;
  }
  try {
    // const res = await fetch(`/api/v1/order-status/${merchantOrderId}`, {
    //   headers: {
    //     authorization: `Bearer ${token}`,
    //   },
    // });
    // const data = await res.json();
    const data = await fetchPaymentOrderStatus(merchantOrderId);
    if (data?.data?.status) {
      if (statusDiv)
        statusDiv.innerText = "Payment Status: " + data.data.status;
    } else if (statusDiv) {
      statusDiv.innerText = data.message || "Could not fetch payment status.";
    }
    init();
    renderHeaderMenu();
  } catch (err) {
    if (statusDiv) statusDiv.innerText = "Error checking payment status.";
    console.error("Error checking PhonePe payment status:", err);
  }
}

// Example usage (uncomment and adapt as needed):
// document.getElementById("payBtn").addEventListener("click", () => {
//   initiatePhonePePayment(["6868a9ce68b03371cc9e07e3"], "<JWT_TOKEN>");
// });
//
// // On status page:
// const params = new URLSearchParams(window.location.search);
// const merchantOrderId = params.get("merchantOrderId");
// checkPhonePePaymentStatus(merchantOrderId, "<JWT_TOKEN>");
