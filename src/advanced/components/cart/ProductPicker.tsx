import { useRef } from 'react';

import { CartItem } from '@/types';

import { products } from '../../../data/products.json';

interface ProductPickerProps {
  onAddToCart: (item: CartItem) => void;
}

const ProductPicker = ({ onAddToCart }: ProductPickerProps) => {
  const selectedProductRef = useRef<string | null>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

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

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        ref={selectRef}
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        onChange={handleSelectProduct}
        style={{
          borderColor: products.reduce((total, p) => total + p.quantity, 0) < 50 ? 'orange' : '',
        }}
      >
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0}>
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
