import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productsAPI, ordersAPI } from '../services/api.js';
import { showPopup } from './GlobalPopup.jsx';


export default function Products({
  cart,
  setCart,
  orders,
  setOrders,
  user,
  requireAuth
}) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to empty array if API fails
        setProducts([]);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      requireAuth();
      return;
    }
    setCart([...cart, product]);
    showPopup(`${product.name} added to cart successfully!`, 'success');
  };

  const handleBuyNow = async (product) => {
    if (!user) {
      requireAuth();
      return;
    }
    try {
      await ordersAPI.createQuickOrder(product);
      setOrders([...orders, product]);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (!user) {
      requireAuth();
      return;
    }
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2); }
          50% { box-shadow: 0 8px 30px rgba(220, 38, 38, 0.4), 0 0 20px rgba(255, 255, 255, 0.3); }
          100% { box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        
        .products-wrapper {
          padding: 40px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }
        
        .products-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .products-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #dc2626;
          text-align: center;
          margin-bottom: 50px;
          animation: fadeInUp 0.8s ease-out;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: 30px;
          padding: 0 10px;
        }
        
        .product-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out;
          border: 1px solid rgba(220, 38, 38, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .product-card:hover {
          transform: translateY(-10px) scale(1.02);
          animation: glow 2s infinite;
          border-color: rgba(220, 38, 38, 0.3);
        }
        
        .product-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.6s;
        }
        
        .product-card:hover:before {
          left: 100%;
        }
        
        .product-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 15px;
          transition: transform 0.3s ease;
          margin-bottom: 20px;
        }
        
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
        
        .product-name {
          font-weight: 600;
          font-size: 1.3rem;
          color: #1f2937;
          margin-bottom: 10px;
          line-height: 1.4;
        }
        
        .product-description {
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        
        .product-price {
          font-weight: 700;
          font-size: 1.4rem;
          color: #dc2626;
          margin-bottom: 20px;
        }
        
        .view-details-link {
          color: #dc2626;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          border-bottom: 2px solid transparent;
          transition: border-color 0.3s ease;
          margin-bottom: 15px;
          display: inline-block;
        }
        
        .view-details-link:hover {
          border-bottom-color: #dc2626;
        }
        
        .btn {
          padding: 12px 20px;
          border-radius: 25px;
          width: 100%;
          margin-top: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          animation: pulse 0.6s;
        }
        
        .add-btn { 
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .add-btn:hover {
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .buy-btn { 
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        
        .buy-btn:hover {
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        .delete-btn { 
          background: linear-gradient(45deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }
        
        .delete-btn:hover {
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        
        @media (max-width: 768px) {
          .products-wrapper {
            padding: 20px 10px;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }
          
          .product-card {
            padding: 20px;
          }
          
          .product-img {
            height: 180px;
          }
        }
        
        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .product-card {
            padding: 15px;
          }
        }
      `}</style>

      <div className="products-wrapper">
        <div className="products-container">
          <h2 className="products-title">🏺 Our Exquisite Collection 🏺</h2>

          <div className="products-grid">
            {products.map((item, index) => (
              <div 
                className="product-card" 
                key={item._id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={item.image} 
                  className="product-img" 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x220?text=Image+Not+Available';
                  }}
                  alt={item.name}
                />

                <h3 className="product-name">{item.name}</h3>
                <p className="product-description">{item.description}</p>
                <p className="product-price">₹{item.price.toLocaleString()}</p>

                <Link to={`/product/${item._id}`} className="view-details-link">
                  👁️ View Details
                </Link>

                {user && (
                  <>
                    <button
                      className="add-btn btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      className="buy-btn btn"
                      onClick={() => handleBuyNow(item)}
                    >
                      ⚡ Buy Now
                    </button>

                    <button
                      className="delete-btn btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      

    </>
  );
}
