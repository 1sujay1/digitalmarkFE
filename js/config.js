 const BASE_URL = "https://digitalmarkbe.onrender.com";

 const getToken = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined ? token : '';
  }

   const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
  }
  const setLocalCartITems = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  }
    const getLocalCartItems = () => {
        const items = localStorage.getItem('cart');
        return items ? JSON.parse(items) : [];
    }
    
const LoaderHTML =`<div class="d-flex justify-content-center align-items-center" style="min-height:200px;">
              <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>`