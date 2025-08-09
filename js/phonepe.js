// PhonePe Payment Integration JS
// Usage: Attach to a button with id 'payBtn' on your payment page

// --- Payment Initiation ---
async function initiatePhonePePayment(e) {
  e.stopPropagation();
  const token = getToken();
  const getAllCartItemsResponse = await getCartItems();
  const getAllCartItems = getAllCartItemsResponse.products || [];
  const productIds = getAllCartItems.map((p) => p._id);
  try {
    // Call backend to create PhonePe order
    const res = await fetch(`${BASE_URL}/api/v1/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productIds }),
    });
    const data = await res.json();
    if (data.status === 200 && data?.data?.checkoutPageUrl) {
      window.location.href = data.data.checkoutPageUrl;
    } else {
      alert(data.message || "Failed to initiate payment");
    }
  } catch (err) {
    console.error("Error creating PhonePe order:", err);
    alert("Something went wrong while initiating payment.");
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
    const res = await fetch(`/api/v1/order-status/${merchantOrderId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
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
