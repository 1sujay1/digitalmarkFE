const renderHeaderMenu = () => {
  const menuContainer = document.getElementById("headerMenu");
  menuContainer.innerHTML = `
    <div class="container">
    <div class="row">
        <div class="col logo-column">
            <div class="site-logo">
                <a href="/"><img src="/img/logo.png" alt="Logo"></a>
            </div>
        </div>
        <div class="col header-menu-column">
            <div class="header-menu d-none d-xl-block">
                <nav>
                    <div class="ltn__main-menu">
                        <ul>
                            <li class="menu-icon"><a href="#">Home</a>
                            </li>
                            <li class="menu-icon"><a href="about.html">About</a>
                            </li>
                            <li class="menu-icon"><a href="contact.html">Contact</a>
                            </li>
                            <li class="menu-icon"><a href="faq.html">Faq</a>
                            </li>
                            <li class="menu-icon"><a href="blog.html">Blog</a>
                            </li>
                           
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div class="col">
            <div class="ltn__header-options">
                <ul>
                    <li class="d-none">
                        <!-- ltn__currency-menu -->
                        <div class="ltn__drop-menu ltn__currency-menu">
                            <ul>
                                <li><a href="#" class="dropdown-toggle"><span class="active-currency">USD</span></a>
                                    <ul>
                                        <li><a href="login.html">USD - US Dollar</a></li>
                                        <li><a href="wishlist.html">CAD - Canada Dollar</a></li>
                                        <li><a href="register.html">EUR - Euro</a></li>
                                        <li><a href="/account">GBP - British Pound</a></li>
                                        <li><a href="wishlist.html">INR - Indian Rupee</a></li>
                                        <li><a href="wishlist.html">BDT - Bangladesh Taka</a></li>
                                        <li><a href="wishlist.html">JPY - Japan Yen</a></li>
                                        <li><a href="wishlist.html">AUD - Australian Dollar</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="d-none">
                        <!-- header-search-1 -->
                        <div class="header-search-wrap">
                            <div class="header-search-1">
                                <div class="search-icon">
                                    <i class="icon-magnifier  for-search-show"></i>
                                    <i class="icon-magnifier-remove  for-search-close"></i>
                                </div>
                            </div>
                            <div class="header-search-1-form">
                                <form id="#234" method="get"  action="#">
                                    <input type="text" name="search" value="" placeholder="Search here..."/>
                                    <button type="submit">
                                        <span><i class="icon-magnifier"></i></span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </li>
                    <li class="d-none"> 
                        <!-- user-menu -->
                        <div class="ltn__drop-menu user-menu">
                            <ul>
                                <li>
                                    <a href="#"><i class="icon-user"></i></a>
                                    <ul>
                                        <li><a href="login.html">Sign in</a></li>
                                        <li><a href="register.html">Register</a></li>
                                        <li><a href="/account">My Account</a></li>
                                        <li><a href="wishlist.html">Wishlist</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="d-none">
                        <!-- header-wishlist -->
                        <div class="header-wishlist">
                            <a href="wishlist.html"><i class="icon-heart"></i></a>
                        </div>
                    </li>
                    <li>
                        <!-- mini-cart 2 -->
                        <div class="mini-cart-icon mini-cart-icon-2">
                            <a href="#" onclick="openCartModal(event)">
                                <span class="mini-cart-icon">
                                    <i class="icon-handbag"></i>
                                    <sup>${globalCartItems.length}</sup>
                                </span>
                                <h6><span>Your Cart</span> <span class="ltn__secondary-color cartValue">₹${totalCartPrice}</span></h6>
                            </a>
                        </div>
                    </li>
                    <li>      
                        <!-- Mobile Menu Button -->
                        <div class="mobile-menu-toggle d-xl-none">
                            <a href="#ltn__utilize-mobile-menu" class="ltn__utilize-toggle">
                                <svg viewBox="0 0 800 600">
                                    <path d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>
                                    <path d="M300,320 L540,320" id="middle"></path>
                                    <path d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) "></path>
                                </svg>
                            </a>
                        </div>
                    </li>
                    <li id="navbar-auth">
                    
                    </li>
                    
                </ul>
            </div>
        </div>
    </div>
</div>
    `;
};
function updateNavbarCartCount() {
  const cartCountElement = document.querySelector('.mini-cart-icon sup'); // Update this selector based on your HTML structure
  const cartValueElement = document.querySelector('.mini-cart-icon .cartValue'); // Selector for the cart value element
  if (cartCountElement) {
    cartCountElement.textContent = globalCartItems.length; // Update the count
  }
  if (cartValueElement) {
    cartValueElement.textContent = `₹${totalCartPrice.toFixed(2)}`; // Update the total price
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await init(); // Ensure globalCartItems is populated
  renderHeaderMenu();
  updateNavbarOnAuth();

  // Reinitialize modal functionality after rendering the header menu
  const cartMenuToggle = document.querySelectorAll('.ltn__utilize-toggle');
  cartMenuToggle.forEach(toggle => {
    toggle.addEventListener('click', async function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        await updateCartModal(); // Update cart modal dynamically
        target.classList.add('ltn__utilize-open');
      }
    });
  });

  const cartMenuClose = document.querySelectorAll('.ltn__utilize-close');
  cartMenuClose.forEach(close => {
    close.addEventListener('click', function () {
      this.closest('.ltn__utilize').classList.remove('ltn__utilize-open');
    });
  });
});
var totalCartPrice = 0;
// Function to update the cart modal dynamically
async function updateCartModal() {
  const cartItemsContainer = document.querySelector('.mini-cart-product-area');
  const cartFooter = document.querySelector('.mini-cart-footer .mini-cart-sub-total span');
  if (!cartItemsContainer || !cartFooter) return;

  let cartItems = [];

  if (localStorage.getItem('token')) {
    try {
      const response = await fetchCartItems();
      if (response.status === 200) {
        cartItems = response.data.items || [];
        totalCartPrice = response.data.totalCartPrice || 0;
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  } else {
    cartItems = getLocalCartItems();
    totalCartPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  document.querySelector('.cartValue').textContent = `₹${totalCartPrice}`;
  console.log('Cart Items:', cartItems);
  if (cartItems.length > 0) {
    let cartItemsContent ="";

cartItems.forEach(item => {
  cartItemsContent += ` <div class="mini-cart-item clearfix">
        <div class="mini-cart-img">
          <a href="#"><img src="${item.thumbnail || 'img/product/1.png'}" alt="Image"></a>
          <span class="mini-cart-item-delete" onclick='confirmRemoveCartItem(${JSON.stringify(item)})'><i class="icon-trash"></i></span>
        </div>
        <div class="mini-cart-info">
          <h6><a href="#">${item.name}</a></h6>
          <span class="mini-cart-quantity">${item.quantity} x ₹${item.price}</span>
        </div>
      </div>`
    });
    cartItemsContainer.innerHTML =  cartItemsContent;

  } else {
    cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
  }
  cartFooter.textContent = `₹${totalCartPrice}`;
  updateNavbarCartCount();
}

// Function to remove an item from the cart

// Show confirmation modal before removing cart item
function confirmRemoveCartItem(item) {
  console.log('confirmRemoveCartItem called', item);
  const productId = item._id; // Use _id if available, otherwise use the item directly
  // Create modal if not already present
  let modal = document.getElementById('removeCartItemModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'removeCartItemModal';
    modal.innerHTML = `
      <div class="modal fade" tabindex="-1" id="removeCartItemModalDialog">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title mt-3 w-100">Remove Item</h5>
              <button type="button" class="btn-close m-0" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to remove this item from your cart?</p>
              
                <strong>Title :</strong> <span class="fw-bold text-danger">${item.name}</span>.
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cancelRemoveCartItemBtn">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmRemoveCartItemBtn">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Show modal using Bootstrap
  const bsModal = new bootstrap.Modal(document.getElementById('removeCartItemModalDialog'));
  bsModal.show();

  // Remove previous event listeners
  const confirmBtn = document.getElementById('confirmRemoveCartItemBtn');
  const cancelBtn = document.getElementById('cancelRemoveCartItemBtn');
  confirmBtn.onclick = function () {
    bsModal.hide();
    removeCartItem(productId);
  };
  cancelBtn.onclick = function () {
    bsModal.hide();
  };
}

// Replace inline onclick in cart item delete icon
// In updateCartModal, change:
// <span class="mini-cart-item-delete" onclick="removeCartItem('${item._id}')">
// to:
    // <span class="mini-cart-item-delete" data-product-id="${item._id}">

// And after rendering cart items, add:
setTimeout(() => {
  document.querySelectorAll('.mini-cart-item-delete').forEach(btn => {
    btn.onclick = function (e) {
      const productId = this.getAttribute('data-product-id');
      confirmRemoveCartItem(productId);
    };
  });
}, 0);
async function removeCartItem(productId) {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await removeCartItemFromServer(token, productId);
      if (response.status === 200) {
        globalCartItems = response.data.items || [];
        updateNavbarCartCount();
        updateCartModal();
        window.location.reload(); // Reload to reflect changes
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  } else {
    let cart = getLocalCartItems();
    cart = cart.filter(item => item._id !== productId);
    setLocalCartITems(cart);
    globalCartItems = cart;
    updateNavbarCartCount();
    updateCartModal();
    windlow.location.reload(); // Reload to reflect changes
  }
}
document.addEventListener("DOMContentLoaded", function () {
  // updateNavbarOnAuth();
  const modalHTML = `
    <div class="ltn__modal-area ltn__quick-view-modal-area">
    <div class="modal fade" id="auth_modal" tabindex="-1">
        <div class="modal-dialog modal-md" role="document">
            <div class="modal-content">
                <div class="modal-header loginPopupModalHeader">
                    <h4 class="modal-title">Account Access</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Tabs for Login / Register -->
                    <ul class="nav nav-tabs mb-3" id="authTabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="login-tab" data-bs-toggle="tab" href="#login" role="tab">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="register-tab" data-bs-toggle="tab" href="#register" role="tab">Register</a>
                        </li>
                    </ul>
                    <div class="tab-content" id="authTabsContent">
                        <!-- Login Form -->
                        <div class="tab-pane fade show active" id="login" role="tabpanel">
                            <form id="loginForm">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" id="loginEmail" class="form-control" placeholder="Enter your email" required>
                                </div>
                                <div class="form-group">
                                    <label>Password</label>
                                    <input type="password" id="loginPassword" class="form-control" placeholder="Enter your password" required>
                                </div>
                                <button type="submit" class="btn btn-primary mt-2 w-100" id="loginBtn">Login</button>
                            </form>
                        </div>

                        <!-- Register Form -->
                        <div class="tab-pane fade" id="register" role="tabpanel">
                          <form id="registerForm">
  <div id="initialFields">
    <div class="form-group">
      <label>Name</label>
      <input type="text" class="form-control" id="nameRegister" placeholder="Enter your name" required />
    </div>

    <div class="form-group mt-3">
      <label>Mobile</label>
      <input type="text" class="form-control" id="mobileRegister" placeholder="Enter your mobile" required />
    </div>

    <div class="form-group mt-3">
      <label>Email</label>
      <input type="email" class="form-control" id="emailRegister" placeholder="Enter your email" required />
    </div>

    <div class="form-group mt-3">
      <label>Password</label>
      <input type="password" class="form-control" id="passwordRegister" placeholder="Create password" required />
    </div>

    <div class="form-group mt-3">
      <label>Confirm Password</label>
      <input type="password" class="form-control" id="confirmPasswordRegister" placeholder="Confirm password" required />
    </div>
  </div>

  <!-- Dynamic OTP Section -->
  <div id="otpSection" style="display: none;">
    <div class="form-group mt-3">
      <label>Enter OTP</label>
      <input type="text" class="form-control" id="otpRegister" placeholder="Enter OTP sent to your mobile" />
    </div>
    <p id="otpMessage" class="text-success mt-2" style="display: none;">OTP sent successfully!</p>
  </div>

  <!-- Dynamic Button and OTP Section -->
  <div class="registerAction">
    <p id="registerMessage" class="text-danger mt-2"></p>
    <button type="submit" class="btn btn-success mt-3 w-100" id="submitBtn">Submit</button>
    <button type="button" class="btn btn-primary mt-3 w-100" id="otpBtn" style="display: none;">Send OTP</button>
  </div>
</form>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    `;

    const cartModalHTML = `
        <div id="ltn__utilize-cart-menu" class="ltn__utilize ltn__utilize-cart-menu cartModal" >
        <div class="ltn__utilize-menu-inner ltn__scrollbar">
            <div class="ltn__utilize-menu-head">
            <span class="ltn__utilize-menu-title">Cart</span>
            <button class="ltn__utilize-close">×</button>
            </div>
            <div class="mini-cart-product-area ltn__scrollbar">
            </div>
            <div class="mini-cart-footer">
            <div class="mini-cart-sub-total">
                <h5>Subtotal: <span>$310.00</span></h5>
            </div>
            <div class="btn-wrapper"></div>
                    <a href="/checkout" class="theme-btn-2 btn btn-effect-2">Checkout</a>
                </div>
            </div>

        </div>
    `

  document.body.innerHTML += modalHTML;
  document.body.innerHTML += cartModalHTML;
});

document.addEventListener("DOMContentLoaded", () => {
  // Login Form Submit
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
const loginBtn = document.getElementById("loginBtn")
      try {
        loginBtn.innerHTML='Please wait...'
        const response = await loginUser({ email, password });
        if (response.status === 200) {
          loginBtn.innerHTML = 'Login Success';
          const userData = {
            name: response.data.user.name,
            email: response.data.user.email,
            token: response.data.accessToken,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', userData.token);
          updateNavbarOnAuth();
          window.location.reload();
        } else {
          alert(response.message || 'Invalid email or password.');
          loginBtn.innerHTML = 'Login';
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong. Please try again.');
        loginBtn.innerHTML = 'Login';
      }
    });
  }
});
var userData = {};
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  // const initialFields = document.getElementById("initialFields");
  const registerAction = document.querySelector(".registerAction");
  const registerMessage = document.getElementById("registerMessage");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerMessage.textContent = "";

    // Collect values
    const name = document.getElementById("nameRegister").value.trim();
    const mobile = document.getElementById("mobileRegister").value.trim();
    const email = document.getElementById("emailRegister").value.trim();
    const password = document.getElementById("passwordRegister").value.trim();
    const confirmPassword = document.getElementById("confirmPasswordRegister").value.trim();
    const submitBtn = document.getElementById("submitBtn");
    
    // const otpBtn = document.getElementById("otpBtn");
    const signupBtn = document.getElementById("signupBtn");
    // If OTP section already exists, handle verification
    if (document.getElementById("otp")) {
      const otp = document.getElementById("otp").value.trim();
      if (!otp) {
        registerMessage.textContent = "Please enter OTP.";
        return;
      }

      try {
        const response = await verifyOtp({
          name,
          mobile,
          email,
          password,
          confirmPassword,
          otp,
          type: "email",
        });
        if (response.status === 200) {
          signupBtn.innerHTML = "Success";
          registerMessage.classList.remove("text-danger");
          registerMessage.classList.add("text-success");
          registerMessage.textContent = "Registration successful. Please login.";
          alert("Registration successful!");
          const userData = {
            name: response.data.user.name,
            email: response.data.user.email,
            token: response.data.accessToken,
          };
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", userData.token);
          updateNavbarOnAuth();
          window.location.reload();
          registerForm.reset();
        } else {
          alert(response.message || "Invalid OTP.");
          registerMessage.textContent = response.message || "Invalid OTP.";
          signupBtn.innerHTML = "Submit";
        }
      } catch (err) {
        alert("Error verifying OTP:", err);
        registerMessage.textContent = "Error verifying OTP.";
        signupBtn.innerHTML = "Submit";
      }

      return;
    }

    // First step: validations
    if (!name || !mobile || !email || !password || !confirmPassword) {
      registerMessage.textContent = "All fields are required.";
      return;
    }

    if (password !== confirmPassword) {
      registerMessage.textContent = "Passwords do not match.";
      return;
    }
    userData = {
      name,
      email,
      mobile,
      password,
      confirmPassword,
      type: "email",
    };
    try {
      submitBtn.innerHTML = "Please wait...";
      const response = await sendOtp({ type: "email", name, mobile, email, password,isRegister:true });
      if (response.status === 200) {
        submitBtn.innerHTML = "OTP sent Successfully";
        ["nameRegister", "mobileRegister", "emailRegister", "passwordRegister", "confirmPasswordRegister"].forEach((id) => {
          const input = document.getElementById(id);
          if (input) input.setAttribute("disabled", "true");
        });

        registerAction.innerHTML = `
          <div class="otp-section">
            <h3>Verify Your OTP</h3>
            <p>Enter the OTP sent to your email to complete the registration.</p>
            <div class="form-group">
              <input type="text" class="form-control" id="otp" placeholder="Enter OTP" required />
            </div>
            <p id="otpMessage" class="message"></p>
            <button type="submit" class="btn" id="signupBtn">Verify and Sign Up</button>
            <p class="text-muted small mt-2">
              Didn’t receive OTP?
              <span id="resendOtpLink" class="text-primary" style="cursor: pointer; display: none;">Resend OTP</span>
              <span id="resendCountdown" class="text-secondary"> (Resend in 2:00)</span>
            </p>
          </div>
        `;

        startOtpResendTimer();
      } else {
        alert(response.message || "Failed to send OTP.");
        registerMessage.textContent = response.message || "Failed to send OTP.";
      }
    } catch (err) {
      alert("Error sending OTP:", err);
      console.error("Error sending OTP:", err);
      registerMessage.textContent = "Something went wrong.";
    }
  });
});
document.addEventListener("click", async (e) => {
  if (e.target.id === "resendOtpLink") {
    const { name, mobile, email, password } = userData;
    const resendOtpLink = document.getElementById("resendOtpLink");
    try {
      resendOtpLink.innerHTML = "Please wait...";
      const response = await sendOtp({ type: "email", name, mobile, email, password });
      if (response.status === 200) {
        alert("OTP resent successfully!");
        resendOtpLink.innerHTML = "Resent OTP Success";
        otpMessage.textContent = "OTP resent successfully!";
        otpMessage.classList.remove("text-danger");
        otpMessage.classList.add("text-success");
        startOtpResendTimer();
      } else {
        alert(response.message || "Failed to resend OTP.");
        resendOtpLink.innerHTML = "Resend OTP";
        otpMessage.textContent = response.message || "Failed to resend OTP.";
        otpMessage.classList.add("text-danger");
      }
    } catch (err) {
      alert("Error resending OTP:", err);
      resendOtpLink.innerHTML = "Resend OTP";
      document.getElementById("otpMessage").textContent = "Error while resending OTP.";
    }
  }
});

function startOtpResendTimer() {
  const resendLink = document.getElementById("resendOtpLink");
  const resendCountdown = document.getElementById("resendCountdown");

  let seconds = 120;
  resendLink.style.display = "none";
  resendCountdown.style.display = "inline";

  const timer = setInterval(() => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    resendCountdown.textContent = ` (Resend in ${min}:${
      sec < 10 ? "0" : ""
    }${sec})`;
    seconds--;

    if (seconds < 0) {
      clearInterval(timer);
      resendCountdown.style.display = "none";
      resendLink.style.display = "inline";
    }
  }, 1000);
}
function updateNavbarOnAuth() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navElement = document.querySelector("#navbar-auth");
  if (user) {
    navElement.innerHTML = `
         
 <div class="nav-item dropdown" >
  <a
    class="nav-link dropdown-toggle btn btn-success text-white px-3 py-2"
    href="#"
    role="button"
    id="dropdownMenuLink"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    ${user.name}
  </a>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
    <li><a class="dropdown-item" href="/account">Profile</a></li>
    <li><a class="dropdown-item" onclick=" localStorage.clear();location.reload()" href="#" id="logoutBtn">Logout</a></li>
  </ul>
</div>

      `;

    // Attach logout handler
    // document.querySelector("#logoutBtn").addEventListener("click", () => {
    //   alert()
    //   localStorage.clear()
    //   location.reload(); // reload to show login again
    // });
  } else {
    navElement.innerHTML = `
      
        <a href="#" class="theme-btn-1 btn btn-effect-1" data-bs-toggle="modal" data-bs-target="#auth_modal">
                        Login / Sign Up
                    </a>
       
      `;
  }
}
var globalCartItems = []; // Declare globally
async function getCartItems() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetchCartItems();
      if (response.status === 200) {
        const data = response.data;
        totalCartPrice = data?.totalCartPrice || 0;
        const responseData = {
          products:data?.items || [],
          totalCartPrice: data?.totalCartPrice || 0,
        }
        return responseData
      } else {
        alert(response.message || "Failed to fetch cart items.");
        console.error(response.message);
        return {          products: [],
          totalCartPrice: 0,};
      }
    } catch (error) {
      alert("Error fetching cart items:", error);
      console.error("Error fetching cart items:", error);
      return {          products: [],
        totalCartPrice: 0};
    }
  } else {
    const cartItems = localStorage.getItem("cart");
    if (cartItems) {
      const parsedItems = JSON.parse(cartItems);
      totalCartPrice = parsedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }
    const responseData = {
      products: JSON.parse(cartItems) || [],
      totalCartPrice: totalCartPrice || 0,
    };
    // return cartItems ? JSON.parse(cartItems) : [];
    return responseData;
  }
}
async function init() {
  const cartItemsResponse = await getCartItems();
  globalCartItems = cartItemsResponse.products || [];
   // Assign to global variable
}

init();

async function openCartModal(event) {
  console.log('openCartModal called',event);
    if (event) event.preventDefault();
    const cartMenu = document.getElementById('ltn__utilize-cart-menu');
    if (cartMenu) {
      console.log('Cart menu found, updating modal');
        await updateCartModal(); // Ensure cart is up to date
        cartMenu.classList.add('ltn__utilize-open');
    }
  }