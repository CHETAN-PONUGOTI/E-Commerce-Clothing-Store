import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
            
            <Link 
                to={`/product/${product._id}`} 
                className="block h-full"
            >
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover object-center" 
                />
                
                <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">{product.name}</h3>
                    <p className="text-xl font-bold text-indigo-600 mb-2">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;