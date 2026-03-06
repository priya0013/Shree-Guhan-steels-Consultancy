import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCartCount(cartItems.length);
  }, [cartItems]);

  const addToCart = (product) => {
    const existingItem = cartItems.find(
      item => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor
    );

    if (existingItem) {
      // If item exists, increase quantity
      setCartItems(cartItems.map(item =>
        item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      ));
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...product, quantity: product.quantity || 1, cartId: Date.now() }]);
    }
  };

  const removeFromCart = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
    } else {
      setCartItems(cartItems.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
