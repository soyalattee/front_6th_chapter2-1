import { EventHandlers } from './eventHandlers';
import products from './src/data/products.json';
import { initializeDiscountEvents } from './src/discountEvent';
import { initializeLayout } from './src/renderUI';
import { onUpdateCartStuff } from './src/updateCartStuff';
import { onUpdatePricesInCart } from './src/updatePricesInCart';
import { onUpdateSelectOptions } from './src/updateSelectOptions';

function main() {
  const totalAmt = 0;
  const itemCnt = 0;
  let lastSel = null;
  const prodList = products.prodList;

  function setLastSel(selItem) {
    lastSel = selItem;
  }

  // UI 초기화
  const { sel, stockInfo, addBtn, cartDisplay, sum, manualOverlay, manualToggle, manualColumn } = initializeLayout();

  const handleCalculateCartStuff = () => {
    onUpdateCartStuff({ cartDisplay, prodList, totalAmt, itemCnt, stockInfo, sum });
  };

  const handleUpdateSelectOptions = () => {
    onUpdateSelectOptions({ productList: prodList, selectedOption: sel });
  };

  const handleUpdatePricesInCart = () => {
    onUpdatePricesInCart({ cartDisplay, productList: prodList, handleCalculateCartStuff });
  };

  const handleUpdateForDiscountEvents = () => {
    handleUpdateSelectOptions();
    handleUpdatePricesInCart();
  };

  handleUpdateSelectOptions();
  handleCalculateCartStuff();

  // 할인 이벤트 초기화
  initializeDiscountEvents({
    prodList,
    handleUpdateForDiscountEvents,
    lastSel,
  });

  // 이벤트 핸들러 초기화
  const eventHandlers = new EventHandlers({
    addBtn,
    cartDisplay,
    manualToggle,
    manualOverlay,
    manualColumn,
    prodList,
    sel,
    setLastSel,
    handleCalculateCartStuff,
    handleUpdateSelectOptions,
  });
  eventHandlers.setupEventListeners();
}
// --- main 함수 끝 ---

main();
