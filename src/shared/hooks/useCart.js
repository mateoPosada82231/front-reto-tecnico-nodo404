import { useCartStore } from '../stores/useCartStore';

function useCart() {
    const {
        items,
        itemsCount,
        totalPrice,
        loading,
        error,
        fetchCart,
        addItem,
        removeItem,
        clear,
        reset,
    } = useCartStore();

    return {
        items,
        itemsCount,
        totalPrice,
        loading,
        error,
        fetchCart,
        addItem,
        removeItem,
        clear,
        reset,
    };
}

export default useCart;