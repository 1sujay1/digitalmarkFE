const token = localStorage.getItem('token'); // Retrieve token from localStorage

// Pass token to all API calls if available
const headers = {
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
};

// Utility function to fetch cart items
async function fetchCartItems() {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/cart`, {
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
    const response = await fetch(`${BASE_URL}/api/v1/cart/remove`, {
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
    const response = await fetch(`${BASE_URL}/api/v1/auth/signInWithEmailPassword`, {
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
    const response = await fetch(`${BASE_URL}/api/v1/auth/email/verify-otp`, {
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
    const response = await fetch(`${BASE_URL}/api/v1/auth/email/send-otp`, {
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
    const response = await fetch(`${BASE_URL}/api/v1/products`, {
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
    const response = await fetch(`${BASE_URL}/api/v1/cart/add`, {
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
  
    const response = await fetch(`${BASE_URL}/api/v1/create-order`, {
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
// Utility function to clear the cart
async function clearCart() {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/cart/clear`, {
      method: 'POST',
      headers: headers,
    });
    if (response.ok && response.status === 200) {
      localStorage.removeItem('cart'); // Clear local cart items
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Failed to clear cart" };
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}

async function fetchMyProducts() {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/my-products`, {
      method: 'GET',
      headers: headers,
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Failed to fetch your products" };
    }
  } catch (error) {
    console.error('Error fetching your products:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}
/**
 * Uploads a product thumbnail image.
 * @param {File} file - The thumbnail image file to upload.
 * @returns {Promise<Object>} - The server response.
 */
async function uploadProductThumbnail(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BASE_URL}/api/v1/product/thumbnail/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Do not set Content-Type; browser will set it for FormData
      },
      body: formData,
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Failed to upload thumbnail" };
    }
  } catch (error) {
    console.error('Error uploading product thumbnail:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}

/**
 * Uploads multiple product images.
 * @param {FileList|Array<File>} files - The image files to upload.
 * @returns {Promise<Object>} - The server response.
 */
async function uploadProductImages(files) {
  const formData = new FormData();
  Array.from(files).forEach((file, idx) => {
    formData.append('files', file);
  });

  try {
    const response = await fetch(`${BASE_URL}/api/v1/product/images/uploads`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Do not set Content-Type; browser will set it for FormData
      },
      body: formData,
    });
    if (response.ok && response.status === 200) {
      return response.json();
    } else {
      const error = await response.json();
      return { status: 400, message: error.message || "Failed to upload images" };
    }
  } catch (error) {
    console.error('Error uploading product images:', error);
    return { status: 400, message: "Something went wrong, try again" };
  }
}