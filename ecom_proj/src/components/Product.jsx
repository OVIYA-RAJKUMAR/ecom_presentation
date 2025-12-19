import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsAPI, ordersAPI } from '../services/api';

export default function Product({ orders, setOrders, user, requireAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      comment: "Absolutely stunning piece! The craftsmanship is exceptional and it arrived in perfect condition. Highly recommend!",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      date: "2024-01-10",
      comment: "Beautiful antique, exactly as described. Fast shipping and excellent packaging. Will definitely buy again.",
      verified: true
    },
    {
      id: 3,
      name: "Emma Wilson",
      rating: 5,
      date: "2024-01-08",
      comment: "This piece exceeded my expectations! The historical significance and beauty make it a perfect addition to my collection.",
      verified: false
    },
    {
      id: 4,
      name: "David Rodriguez",
      rating: 4,
      date: "2024-01-05",
      comment: "Great quality and authentic piece. The seller was very helpful with providing additional historical information.",
      verified: true
    }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
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

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Product not found</h2>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .product-container {
          max-width: 1400px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Poppins', sans-serif;
        }
        
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        
        .product-left {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.1);
        }
        
        .product-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 15px;
          margin-bottom: 30px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .product-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
          line-height: 1.2;
        }
        
        .product-price {
          font-size: 2rem;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 20px;
        }
        
        .product-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 30px;
        }
        
        .product-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(220, 38, 38, 0.05);
          border-radius: 10px;
        }
        
        .meta-item {
          text-align: center;
        }
        
        .meta-label {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 5px;
        }
        
        .meta-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #dc2626;
        }
        
        .buy-button {
          width: 100%;
          padding: 18px;
          background: linear-gradient(45deg, #dc2626, #b91c1c);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }
        
        .buy-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(220, 38, 38, 0.4);
        }
        
        .reviews-section {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.1);
        }
        
        .reviews-header {
          margin-bottom: 30px;
        }
        
        .reviews-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
        }
        
        .rating-summary {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .average-rating {
          font-size: 2rem;
          font-weight: 700;
          color: #dc2626;
        }
        
        .stars {
          font-size: 1.5rem;
          color: #fbbf24;
        }
        
        .total-reviews {
          color: #6b7280;
          font-size: 1rem;
        }
        
        .review-item {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 20px;
        }
        
        .review-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .reviewer-name {
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .verified-badge {
          background: #10b981;
          color: white;
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 10px;
        }
        
        .review-date {
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .review-rating {
          color: #fbbf24;
          font-size: 1.1rem;
          margin-bottom: 10px;
        }
        
        .review-comment {
          line-height: 1.6;
          color: #4b5563;
        }
        
        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .product-left, .reviews-section {
            padding: 25px;
          }
          
          .product-title {
            font-size: 2rem;
          }
          
          .product-image {
            height: 300px;
          }
        }
      `}</style>
      
      <div className="product-container">
        <div className="product-layout">
          {/* Left Side - Product Details */}
          <div className="product-left">
            <img 
              src={product.image}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
              }}
            />
            
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price">₹{product.price.toLocaleString()}</div>
            <p className="product-description">{product.description}</p>
            
            <div className="product-meta">
              <div className="meta-item">
                <div className="meta-label">Category</div>
                <div className="meta-value">{product.category}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Stock</div>
                <div className="meta-value">{product.stock} Available</div>
              </div>
            </div>
            
            {user && (
              <button onClick={handleBuyNow} className="buy-button">
                🛒 Buy Now
              </button>
            )}
          </div>
          
          {/* Right Side - Customer Reviews */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2 className="reviews-title">⭐ Customer Reviews</h2>
              <div className="rating-summary">
                <div className="average-rating">{averageRating.toFixed(1)}</div>
                <div className="stars">{renderStars(Math.round(averageRating))}</div>
                <div className="total-reviews">({reviews.length} reviews)</div>
              </div>
            </div>
            
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-name">
                      👤 {review.name}
                      {review.verified && (
                        <span className="verified-badge">✓ Verified</span>
                      )}
                    </div>
                    <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                  <div className="review-rating">{renderStars(review.rating)}</div>
                  <div className="review-comment">{review.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}