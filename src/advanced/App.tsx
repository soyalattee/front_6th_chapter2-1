import { useMemo, useState } from 'react';

import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import OrderSummary from './components/order/OrderSummary';
import { CartItem } from './types';

const App = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: CartItem) => {
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingCartItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                totalPrice: (cartItem.quantity + 1) * cartItem.price,
                points: Math.floor(((cartItem.quantity + 1) * cartItem.price) / 1000),
              }
            : cartItem
        )
      );
    } else {
      const newCartItem: CartItem = {
        id: item.id,
        name: item.name,
        originalPrice: item.originalPrice,
        price: item.price,
        quantity: 1,
        onSale: item.onSale,
        suggestSale: item.suggestSale,
      };
      setCartItems((prev) => [...prev, newCartItem]);
    }
  };
  const cartItemsCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  return (
    <>
      <Header cartItemsCount={cartItemsCount} />
      <GuideToggle />
      <Layout>
        <ShoppingCart cartItems={cartItems} onAddToCart={handleAddToCart} />
        <OrderSummary cartItems={cartItems} />
      </Layout>
    </>
  );
};

export default App;
