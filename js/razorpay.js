async function payWithRazorpay(e) {
  e.stopPropagation();
  document.getElementById("razorpayBtn").disabled = true; // Disable button to prevent multiple clicks
  document.getElementById("razorpayBtn").textContent = "Processing..."; // Change button text
  const token = getToken();
  // console.log("Token:", token);
  const getAllCartItemsResponse = await getCartItems();
  const getAllCartItems = getAllCartItemsResponse.products || [];
  const productIds = getAllCartItems.map((p) => p._id);
  const createOrderResp = await createOrder(productIds);
  if (!createOrderResp || createOrderResp.status !== 200) {
    alert("❌ Failed to create Razorpay order.");
    console.error("Order creation failed:", createOrderResp);
    document.getElementById("razorpayBtn").disabled = false; // Re-enable button
    document.getElementById("razorpayBtn").textContent = "Pay with Razorpay"; // Reset button text
    return;
  }
  // console.log("Create Order Response:", createOrderResp);
  const order = createOrderResp.data;
  const options = {
    key: "rzp_test_LHP0r8PwqaWPt5",
    amount: order.amount,
    currency: order.currency,
    name: "Demo Shop",
    description: "Test Transaction",
    order_id: order.id,
    handler: function (response) {
      // console.log("Payment Response:", response);
      // Call verify-payment API
      fetch(`${BASE_URL}/api/v1/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          razorpay_order_id: options.order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log("Verification Result:", result);
          if (result.status === 200) {
            localStorage.removeItem("cart");
            showSuccessModal(
              response.razorpay_payment_id,
              options.order_id,
              order.amount
            );
          } else {
            alert("⚠️ Payment verification failed.");
          }
        })
        .catch((err) => {
          document.getElementById("razorpayBtn").disabled = false; // Re-enable button
          document.getElementById("razorpayBtn").textContent =
            "Pay with Razorpay"; // Reset button text
          console.error("Verification error:", err);
          alert("❌ Error verifying payment.");
        });
    },
    prefill: {
      name: "Customer Name",
      email: "customer@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#F37254",
    },
  };

  const rzp = new Razorpay(options);
  // 👇 Listen for failures
  let hasFailedOnce = false;
  rzp.on("payment.failed", async function (response) {
    if (hasFailedOnce) return;
    hasFailedOnce = true;
    try {
      await fetch(`${BASE_URL}/v1/payment-failed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          razorpayOrderId: response.error.metadata.order_id,
          paymentResponse: response.error, // Full failure object
        }),
      });
    } catch (err) {
      document.getElementById("razorpayBtn").disabled = false; // Re-enable button
      document.getElementById("razorpayBtn").textContent = "Pay with Razorpay"; // Reset button text
      console.error("Error logging payment failure:", err);
    }
    console.error("❌ Payment Failed:", response.error);
    alert(
      "❌ Payment failed!\nReason: " +
        response.error.description +
        "\nPlease try again."
    );
    // Optionally, you can redirect to a failure page or show a modal
  });

  // 👇 Optional: handle modal dismiss (user closes popup without paying)
  rzp.on("payment.dismiss", function () {
    document.getElementById("razorpayBtn").disabled = false; // Re-enable button
    document.getElementById("razorpayBtn").textContent = "Pay with Razorpay"; // Reset button text
    // console.log("🚫 Razorpay modal was closed without completing payment");
    alert("⚠️ Payment popup closed.");
  });
  rzp.open();
}

function payWithPaypal(e) {
  e.stopPropagation();
  alert("Redirecting to PayPal...");
  // Real PayPal logic should go here (JS SDK or server redirect)
}
