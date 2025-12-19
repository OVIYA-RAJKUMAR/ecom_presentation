const API_BASE_URL = 'https://ecom-presentation.onrender.com';

// Helper function to get auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token;
};

// Import the global popup function
import { showPopup } from '../components/GlobalPopup';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.message || 'Something went wrong';
      showPopup(errorMessage, 'error');
      throw new Error(errorMessage);
    }
    
    // Show success message for successful operations
    if (options.method === 'POST') {
      showPopup(data.message || 'Operation completed successfully!', 'success');
    } else if (options.method === 'PUT') {
      showPopup(data.message || 'Updated successfully!', 'success');
    } else if (options.method === 'DELETE') {
      showPopup(data.message || 'Deleted successfully!', 'success');
    }
    
    return data;
  } catch (error) {
    if (!error.message.includes('fetch')) {
      showPopup(error.message, 'error');
    } else {
      showPopup('Network error. Please check your connection.', 'error');
    }
    throw error;
  }
};

// Products API
export const productsAPI = {
  getAll: () => apiRequest('/products'),
  getById: (id) => apiRequest(`/products/${id}`),
  getByCategory: (category) => apiRequest(`/products/category/${category}`),
  create: (productData) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  delete: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

// Users API
export const usersAPI = {
  register: (userData) => apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getProfile: () => apiRequest('/users/profile'),
  updateProfile: (userData) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  getById: (id) => apiRequest(`/orders/${id}`),
  createQuickOrder: (productData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({
      items: [{
        productId: productData._id,
        quantity: 1
      }],
      shippingAddress: {
        name: 'Customer',
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'Country'
      },
      paymentMethod: 'cash_on_delivery'
    }),
  }),
};
