 const BASE_URL = "http://localhost:5000";

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
    
