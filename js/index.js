// Run after DOM is fully loaded
       async function renderProducts(searchQuery = '',sortOrder='') {
        
          // console.log('Rendering products with search query:', searchQuery);
          // console.log('Sort order:', sortOrder);
          const productList = document.getElementById('product-list');
          if (!productList) {
            console.error('Product list element not found in the DOM. Ensure the element with id "product-list" exists in your HTML.');
            return;
          }
          productList.innerHTML = LoaderHTML;

          let data;
          if (searchQuery) {
           const products = localStorage.getItem('products');
          let productsArr = JSON.parse(products) || [];
         
          const filteredProducts = productsArr.filter(product =>
            product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          // console.log('Filtered products:', filteredProducts);
            data = { status: 200, data: filteredProducts };
          } else {
            data = await fetchProducts();
          }
        

          if (data.status !== 200 || !data.data.length) {
            console.warn('No products available or invalid response structure.');
            productList.textContent = 'No products available.';
            return;
          }
          let productContent = '';
          let productsResponse = data?.data;
          if(sortOrder === 'low') {
            productsResponse = productsResponse.sort((a, b) => a.price - b.price);
          } else if(sortOrder === 'high') {
            productsResponse = productsResponse.sort((a, b) => b.price - a.price);
          }
          if(productsResponse.length){
        // console.log('Products found:', productsResponse.length);
           const productCountDiv=document.getElementById("showResultsCountDisplay")
           if(productCountDiv){
              productCountDiv.innerHTML=`Showing ${productsResponse.length} Results`
           }
          }
          localStorage.setItem('products', JSON.stringify(productsResponse))
          productsResponse.forEach(product => {
            productContent += `
              <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                  <div class="ltn__product-item text-center">
                      <div class="product-img">
                          <a href="#" title="Quick View" data-bs-toggle="modal" data-bs-target="#quick_view_modal" onclick="populateQuickViewModal(this,event)" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'><img src="${product.thumbnail || 'img/product/1.png'}" alt="#"></a>
                          
                          <div class="product-hover-action product-hover-action-2">
                              <ul>
                                  <li class="ATC-parent-div" id='atc-btn-${product._id}'>
                                      ${globalCartItems?.some(item => item._id === product._id) ? `
                                      <a onclick="handleViewCartFromQuickView(event)" class='theme-btn-1 btn-effect-1' title="View Cart">
                                          <div class="d-add-to-cart-div">
                                              <span class="d-block"><i class="fas fa-shopping-cart"></i></span>
                                              <span class="cart-text d-block">View Cart</span>
                                          </div>
                                      </a>
                                      ` : `
                                      <a href="#" title="Add to Cart" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}' onclick="handleAddToCartClick(this,event,1)">
                                          <div class="d-add-to-cart-div">
                                              <span class="d-block"><i class="fas fa-shopping-cart"></i></span>
                                              <span class="cart-text d-block">Add to Cart</span>
                                          </div>
                                      </a>
                                      `}
                                  </li>
                              </ul>
                          </div>
                      </div>
                      <div class="product-info">
                          <h2 class="product-title"><a href="#" title="Quick View" data-bs-toggle="modal" data-bs-target="#quick_view_modal" onclick="populateQuickViewModal(this,event)" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>${product.name}</a></h2>
                         <button class="product-title"><a href="#" title="Quick View" data-bs-toggle="modal" data-bs-target="#quick_view_modal" onclick="populateQuickViewModal(this,event)" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>View Details</a></button>
                          <div class="product-price">
                              <span>₹${product.price}</span>
                              <del>₹${product.slashedPrice}</del>
                          </div>
                      </div>
                  </div>
              </div>
            `;
          });
          productList.innerHTML = productContent;
          return productsResponse
        }
document.addEventListener('DOMContentLoaded', async function () {
        // Function to render products to the DOM
       

        // Initial render on DOMContentLoaded
     const productsResp=   await renderProducts();
    //  console.log('Products rendered:', productsResp);
       
      })
      document.addEventListener("DOMContentLoaded", function () {
        document.body.addEventListener("click", function (e) {
          const event = e; // Explicitly declare event
          if (event.target.classList.contains("qtybutton")) {
            const isIncrement = event.target.classList.contains("inc");
            const isDecrement = event.target.classList.contains("dec");
    
            const container = event.target.closest(".cart-plus-minus");
            const input = container.querySelector(".cart-plus-minus-box");
            let quantity = parseInt(input.value) || 0;
            const productId = container.getAttribute("data-product-id");
            const productData = JSON.parse(container.getAttribute("data-product")); // Ensure data-product contains full JSON
    
            if (isIncrement) quantity++;
            if (isDecrement) quantity = Math.max(0, quantity - 1);
    
            input.value = quantity.toString().padStart(2, '0');
    
            // Decide where to store: server or local
            const token = getToken(); // Your function to get JWT from cookie or localStorage
    
            if (token) {
              // Sync to server with debounce
              queueSyncToServer(productId, quantity, token);
            } else {
              // LocalStorage fallback
              const cart = getLocalCartItems(); // your get function
              const index = cart.findIndex(p => p._id === productId);
              if (index !== -1) {
                cart[index].quantity = quantity;
                if (quantity === 0) cart.splice(index, 1);
              } else if (quantity > 0) {
                cart.push({ ...productData, quantity });
              }
              setLocalCartITems(cart); // your set function
            }
          }
        });
    
        // Debounce utility
        function debounce(fn, delay = 500) {
          let timer;
          return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
          };
        }
    
        const debouncedUpdates = {};
    
        function queueSyncToServer(productId, quantity, token) {
          if (!debouncedUpdates[productId]) {
            debouncedUpdates[productId] = debounce(addProductToCart);
          }
          debouncedUpdates[productId](productId, quantity, token);
        }
    
  
      });
        async function handleAddToCartClick(productTag, event, quantity = 1) {
          event.preventDefault(); // Prevent default link behavior
          
          // Populate the modal with product details
          const product = JSON.parse(productTag.getAttribute('data-product'));
          const token = localStorage.getItem('token')
          if(token){
               const res = await addProductToCart(product._id, quantity, token);
            if (!res || res.status!==200) {
                alert('Failed to add product to cart, please try again later.');
                console.error('Failed to add product to cart:', res?.message || 'Unknown error');
                return; // Stop execution if API call fails
            }
            globalCartItems = res.data.items || [];
            }else{
                let cart = getLocalCartItems()
            const index = cart.findIndex(item => item._id === product._id);
            if (index !== -1) {
              cart[index].quantity += 1;
            } else {
              cart.push({ ...product, quantity: 1 });
            }
            setLocalCartITems(cart);
            globalCartItems = cart;
            }
            
            updateNavbarCartCount();
            updateCartModal();
            const modal = document.getElementById('add_to_cart_modal');
            if (modal) {
                modal.querySelector('.modal-product-img img').src = product?.thumbnail || 'img/product/1.png';
                modal.querySelector('.modal-product-info h5').textContent = product?.name;
                // modal.querySelector('.modal-product-info h5 a').href = `product-details.html?id=${product?.id}`;
                modal.querySelector('.modal-product-info .added-cart').innerHTML = `<i class="fas fa-check-circle" style="color: #28a745; font-size: 20px;"></i> Successfully added to your Cart`;
                // modal.querySelector('.modal-product-info .btn-wrapper a:first-child').href = 'cart.html';
                // modal.querySelector('.modal-product-info .btn-wrapper a:last-child').href = 'checkout.html';
            }
        //access atc-btn-${product._id}
          
            // Open the modal programmatically
            const modalState = new bootstrap.Modal(modal);
            modalState.show();
            const atcBtn = document.getElementById(`atc-btn-${product._id}`);
            if (atcBtn) {
                atcBtn.innerHTML = `
                <a href="#ltn__utilize-cart-menu" class="ltn__utilize-toggle"  title="View Cart">
                    <div class="d-add-to-cart-div">
                        <span class="d-block"><i class="fas fa-shopping-cart"></i></span>
                        <span class="cart-text d-block">View Cart</span>
                    </div>
                </a>
                `;
            }
            
        }
        function handleAddToCartClick2(productTag,event) {
            event.preventDefault();
            // Populate the modal with product details
            const product = JSON.parse(productTag.getAttribute('data-product'));

            // Close the Quick View modal
            const quickViewModalElement = document.getElementById('quick_view_modal');
            const quickViewModalInstance = bootstrap.Modal.getInstance(quickViewModalElement);
            if (quickViewModalInstance) {
                quickViewModalInstance.hide(); // Properly hide the modal
            } else {
                console.error('Quick View modal instance not found');
            }
            const input = document.querySelector(".cart-plus-minus-box");
            let quantity = parseInt(input.value) || 1;
            // Call the existing Add to Cart function
            handleAddToCartClick(productTag,event,quantity);
        }
        async function populateQuickViewModal(productTag,event) {
          // alert('Quick View button clicked');
            const product = JSON.parse(productTag.getAttribute('data-product'));
            const modal = document.getElementById('quick_view_modal');
            const modalHTML = `
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                         <div class="ltn__quick-view-modal-inner">
                             <div class="modal-product-item">
                                <div class="row">
                                    <div class="col-lg-6 col-12">
                                        <div class="modal-product-img">
                                            <img src="${product.thumbnail || 'img/product/1.png'}" alt="#">
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-12">
                                        <div class="modal-product-info shop-details-info pl-0">
                                            <h3>${product.name}</h3>
                                            <div class="product-price-ratting mb-20">
                                                <ul>
                                                    <li>
                                                        <div class="product-price">
                                                            <span>₹${product.price}</span>
                                                            <del>₹${product.slashedPrice}</del>
                                                        </div>
                                                    </li>
                                                    
                                                </ul>
                                            </div>
                                            <div class="modal-product-brief">
                                                <p>${product.description ?? 'No description available.'}
                                            </div>
                                            
                                            <div class="ltn__product-details-menu-2 product-cart-wishlist-btn mb-30">
                                                <ul class="addToCardDiv">
                                                    <li>
                                                        <a href="#" class="theme-btn-1 btn btn-effect-1" title="Add to Cart" onclick="handleAddToCartClick2(this, event)" >
                                                            <span>ADD TO CART</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                         
                                            <div class="ltn__safe-checkout">
                                                <h5>Guaranteed Safe Checkout</h5>
                                                <img src="/img/icons/payment-2.png" alt="Payment Image">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
            `
            if (modal) { 
                

                const addToCartDiv = modal.querySelector('.addToCardDiv');
                const cartItemsData = await getCartItems();
                const cartItems = cartItemsData?.products || [];
                const isInCart = cartItems.some(item => (item.productId?._id || item._id) === product._id);

                if (addToCartDiv) {
                  if (isInCart) {
                    addToCartDiv.innerHTML = `
                      <li>
                        <a class="theme-btn-1 btn btn-effect-1 d-add-to-cart" title="View Cart"
                          onclick="handleViewCartFromQuickView(event,'quick_view_modal')">
                          <span>View Cart</span>
                        </a>
                      </li>
                    `;
                  } else {
                    addToCartDiv.innerHTML = `
                      <li>
                        <a href="#" class="theme-btn-1 btn btn-effect-1 d-add-to-cart" title="Add to Cart"
                          data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'
                          onclick="handleAddToCartClick2(this, event)">
                          <span>Add to Cart</span>
                        </a>
                      </li>
                    `;
                  }
                }
                modal.innerHTML = modalHTML; 
            }
        }

       async function handleViewCartFromQuickView(event,id) {
            event.preventDefault();
            // Close the Quick View modal if needed
            if (id) {
                const quickViewModalElement = document.getElementById(id);
                const quickViewModalInstance = bootstrap.Modal.getInstance(quickViewModalElement);
                if (quickViewModalInstance) {
                    quickViewModalInstance.hide();
                }
            }
            // Open the cart modal using the same logic as openCartModal
            const cartMenu = document.getElementById('ltn__utilize-cart-menu');
            if (cartMenu) {
                updateCartModal();
                cartMenu.classList.add('ltn__utilize-open');
            }
        }