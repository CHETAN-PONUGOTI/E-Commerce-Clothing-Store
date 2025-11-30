import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
    const { removeItemFromCart } = useCart();
    
    const handleRemove = () => {
        removeItemFromCart(item.product, item.size);
    };

    return (
        <div className="flex items-center justify-between bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
                <Link to={`/product/${item.product}`}>
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-md" 
                    />
                </Link>
                <div className="flex flex-col">
                    <Link to={`/product/${item.product}`} className="text-lg font-semibold hover:text-indigo-600">
                        {item.name}
                    </Link>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-md font-medium text-gray-700">Price: ${item.price.toFixed(2)}</p>
                </div>
            </div>
            
            <div className="flex items-center space-x-6">
                <span className="text-lg font-medium">Qty: {item.qty}</span>
                <span className="text-xl font-bold text-indigo-600 w-24 text-right">
                    ${(item.price * item.qty).toFixed(2)}
                </span>
                <button 
                    onClick={handleRemove} 
                    className="text-red-600 hover:text-red-800 transition duration-200"
                    aria-label={`Remove ${item.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CartItem;