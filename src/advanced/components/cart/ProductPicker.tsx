import { useEffect, useRef } from 'react';

import { CartItem } from '@/types';

import { products } from '../../../data/products.json';

interface ProductPickerProps {
  onAddToCart: (item: CartItem) => void;
}

const ProductPicker = ({ onAddToCart }: ProductPickerProps) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const selectedProductRef = useRef<string | null>(null);

  // 컴포넌트 마운트 시 첫 번째 옵션 선택
  useEffect(() => {
    if (selectRef.current) {
      const firstAvailableProduct = products.find((p) => p.quantity > 0);
      if (firstAvailableProduct) {
        selectRef.current.value = firstAvailableProduct.id;
        selectedProductRef.current = firstAvailableProduct.id;
      }
    }
  }, []);

  const handleSelectProduct = () => {
    if (selectRef.current) {
      selectedProductRef.current = selectRef.current.value;
    }
  };

  const handleAddToCart = () => {
    if (!selectedProductRef.current) return;

    const product = products.find((p) => p.id === selectedProductRef.current);
    if (product) {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: 1,
        onSale: product.onSale,
        suggestSale: product.suggestSale,
      };
      onAddToCart(cartItem);
    }
  };

  const totalStock = products.reduce((total, p) => total + p.quantity, 0);

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        ref={selectRef}
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        onChange={handleSelectProduct}
        style={{
          borderColor: totalStock < 50 ? 'orange' : '',
        }}
      >
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.quantity === 0}
            className={
              product.onSale && product.suggestSale
                ? 'text-purple-600 font-bold'
                : product.onSale
                  ? 'text-red-500 font-bold'
                  : product.suggestSale
                    ? 'text-blue-500 font-bold'
                    : product.quantity === 0
                      ? 'text-gray-400'
                      : ''
            }
          >
            {product.name} -
            {product.onSale || product.suggestSale ? (
              <>
                <span className="line-through">₩{product.originalPrice.toLocaleString()}</span>
                {' → '}₩{product.price.toLocaleString()}
                {product.onSale && ' ⚡'}
                {product.suggestSale && ' 💝'}
              </>
            ) : (
              `₩${product.price.toLocaleString()}`
            )}
            {product.quantity === 0 && ' (품절)'}
          </option>
        ))}
      </select>

      <button
        onClick={handleAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>

      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        {products
          .filter((p) => p.quantity < 5)
          .map((p) => (p.quantity === 0 ? `${p.name}: 품절\n` : `${p.name}: 재고 부족 (${p.quantity}개 남음)\n`))
          .join('')}
      </div>
    </div>
  );
};

export default ProductPicker;
