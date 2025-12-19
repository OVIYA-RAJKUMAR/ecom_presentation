import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productsAPI, ordersAPI } from '../services/api.js';
import { showPopup } from './GlobalPopup.jsx';

export default function Products({ cart, setCart, orders, setOrders, user, requireAuth }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        alert('Failed to fetch products. Please try again later.');
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
      alert('Failed to place order. Please try again.');
    }
  };

  const handleDelete = async (productId) => {
    if (!user) {
      requireAuth();
      return;
    }
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="products-wrapper">
      <div className="products-container">
        <h2 className="products-title">🏺 Our Exquisite Collection 🏺</h2>
        <div className="products-grid">
          {products.map((item, index) => (
            <div className="product-card" key={item._id} style={{ animationDelay: `${index * 0.1}s` }}>
              <img src={item.image} className="product-img" onError={e => e.target.src='https://via.placeholder.com/300x220?text=Image+Not+Available'} alt={item.name} />
              <h3 className="product-name">{item.name}</h3>
              <p className="product-description">{item.description}</p>
              <p className="product-price">₹{item.price.toLocaleString()}</p>
              <Link to={`/product/${item._id}`} className="view-details-link">👁️ View Details</Link>
              {user && <>
                <button className="add-btn btn" onClick={() => handleAddToCart(item)}>🛒 Add to Cart</button>
                <button className="buy-btn btn" onClick={() => handleBuyNow(item)}>⚡ Buy Now</button>
                <button className="delete-btn btn" onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
              </>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
