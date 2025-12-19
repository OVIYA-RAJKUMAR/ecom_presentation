import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsAPI, ordersAPI } from "../services/api";

export default function BuyNow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    phone: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.phone) {
      alert('Please fill in all shipping details');
      return;
    }

    setPlacing(true);
    try {
      const orderData = {
        items: [{
          productId: product._id,
          quantity: 1
        }],
        shippingAddress: {
          name: shippingDetails.name,
          street: shippingDetails.address,
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'India'
        },
        paymentMethod: 'cash_on_delivery'
      };

      await ordersAPI.create(orderData);
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Product not found</h2>;
  }

  return (
    <div style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 0 15px rgba(0,0,0,0.1)"
    }}>
      
      <h2 style={{ marginBottom: "10px" }}>{product.name}</h2>

      <img 
        src={product.image}
        alt={product.name}
        style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
        }}
      />

      <p style={{ fontSize: "20px", marginBottom: "20px" }}>
        Price: <b>₹{product.price}</b>
      </p>

      <h3>Shipping Details</h3>
      <input 
        type="text" 
        name="name"
        placeholder="Full Name" 
        value={shippingDetails.name}
        onChange={handleInputChange}
        style={inputStyle} 
      />
      <input 
        type="text" 
        name="address"
        placeholder="Address" 
        value={shippingDetails.address}
        onChange={handleInputChange}
        style={inputStyle} 
      />
      <input 
        type="text" 
        name="phone"
        placeholder="Phone Number" 
        value={shippingDetails.phone}
        onChange={handleInputChange}
        style={inputStyle} 
      />

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "12px",
          background: placing ? "#ccc" : "black",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: placing ? "not-allowed" : "pointer"
        }}
      >
        {placing ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid #ccc"
};
