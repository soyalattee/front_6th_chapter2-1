import { useCallback, useEffect, useRef, useState } from 'react';

import { products } from '../data/products.json';
import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import OrderSummary from './components/order/OrderSummary';
import { CartItem, Product } from './types';

const App = () => {
  // 상태 관리
  const [productList, setProductList] = useState<Product[]>(products);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const lastSelectedRef = useRef<string | null>(null);

  // 번개세일 타이머
  useEffect(() => {
    const lightningDelay = Math.random() * 10000;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        const luckyIdx = Math.floor(Math.random() * productList.length);
        const luckyItem = productList[luckyIdx];

        if (luckyItem.quantity > 0 && !luckyItem.onSale) {
          // productList 업데이트
          setProductList((prev) =>
            prev.map((item) =>
              item.id === luckyItem.id
                ? {
                    ...item,
                    price: Math.round(item.originalPrice * 0.8),
                    onSale: true,
                  }
                : item
            )
          );

          // cartItems도 함께 업데이트
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === luckyItem.id
                ? {
                    ...item,
                    price: Math.round(item.originalPrice * 0.8),
                    onSale: true,
                  }
                : item
            )
          );

          alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);

      return () => clearInterval(interval);
    }, lightningDelay);

    return () => clearTimeout(timer);
  }, [productList]);

  // 추천 할인 타이머
  useEffect(() => {
    const suggestDelay = Math.random() * 20000;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (lastSelectedRef.current) {
          const availableProducts = productList.filter(
            (p) => p.id !== lastSelectedRef.current && p.quantity > 0 && !p.suggestSale
          );

          if (availableProducts.length > 0) {
            const suggest = availableProducts[0];
            // productList 업데이트
            setProductList((prev) =>
              prev.map((item) =>
                item.id === suggest.id
                  ? {
                      ...item,
                      price: Math.round(item.price * 0.95),
                      suggestSale: true,
                    }
                  : item
              )
            );

            // cartItems도 함께 업데이트
            setCartItems((prev) =>
              prev.map((item) =>
                item.id === suggest.id
                  ? {
                      ...item,
                      price: Math.round(item.price * 0.95),
                      suggestSale: true,
                    }
                  : item
              )
            );

            alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }
        }
      }, 60000);

      return () => clearInterval(interval);
    }, suggestDelay);

    return () => clearTimeout(timer);
  }, [productList, lastSelectedRef.current]);

  // 장바구니 관련 핸들러
  const handleAddToCart = useCallback((item: CartItem) => {
    lastSelectedRef.current = item.id;

    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setProductList((prev) => prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p)));
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, change: number) => {
    setCartItems((prev) => {
      const updatedItems = prev
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
              setProductList((prevList) =>
                prevList.map((p) => (p.id === itemId ? { ...p, quantity: p.quantity + item.quantity } : p))
              );
              return null;
            }
            setProductList((prevList) =>
              prevList.map((p) => (p.id === itemId ? { ...p, quantity: p.quantity - change } : p))
            );
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      return updatedItems;
    });
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === itemId);
      if (itemToRemove) {
        setProductList((prevList) =>
          prevList.map((p) => (p.id === itemId ? { ...p, quantity: p.quantity + itemToRemove.quantity } : p))
        );
      }
      return prev.filter((item) => item.id !== itemId);
    });
  }, []);

  return (
    <>
      <Header cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      <GuideToggle />
      <Layout>
        <ShoppingCart
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
        />
        <OrderSummary cartItems={cartItems} />
      </Layout>
    </>
  );
};

export default App;
