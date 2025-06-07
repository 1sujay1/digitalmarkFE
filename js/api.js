const token = localStorage.getItem('token'); // Retrieve token from localStorage

// Pass token to all API calls if available
const headers = {
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
};

// Utility function to fetch cart items
async function fetchCartItems() {
  try {
    const response = await fetch(`${BASE_URL}/api/cart`, {
      method: 'GET',
      headers: headers,
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Something went wrong, try again" };
    }
  } catch (error) {
    console.error('Error fetching cart itemss:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}

// Utility function to remove an item from the cart
async function removeCartItemFromServer(token, productId) {
  try {
    const response = await fetch(`${BASE_URL}/api/cart/remove`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ productId }),
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Something went wrong, try again" };
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}


// Utility function to login user
async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signInWithEmailPassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Something went wrong, try again" };
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}

// Utility function to verify OTP
async function verifyOtp(userData) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/email/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Something went wrong, try again" };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}

// Utility function to send OTP
async function sendOtp(userData) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/email/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Something went wrong, try again" };
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}

// Utility function to fetch products
async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: 'GET',
      headers:headers,
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Failed to fetch products" };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}

// Utility function to add a product to the cart
async function addProductToCart(productId, quantity, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ productId, quantity }),
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Failed to add product to cart" };
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}
// Utility function to create an order
async function createOrder(productIds) {
  try {
  
    const response = await fetch(`${BASE_URL}/api/create-order`, {
      method: 'POST',
      headers:headers,
      body: JSON.stringify({ productIds }),
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Failed to create order" };
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}