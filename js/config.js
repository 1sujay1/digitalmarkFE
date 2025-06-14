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
    
