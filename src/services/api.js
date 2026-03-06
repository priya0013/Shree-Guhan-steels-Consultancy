// API Base URL - Replace with your actual backend URL when ready
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock data for development (remove when backend is ready)
const MOCK_PRODUCTS = {
  doors: [
    {
      id: 1,
      name: "Industrial Steel Door",
      description: "Heavy-duty industrial steel door with reinforced frame and anti-corrosion coating.",
      category: "Doors",
      image: null,
      features: [
        "Weather-resistant coating",
        "Reinforced steel frame",
        "Multiple locking points",
        "Fire-rated options available"
      ]
    },
    {
      id: 2,
      name: "Commercial Entry Door",
      description: "Sleek commercial steel door perfect for offices and retail spaces.",
      category: "Doors",
      image: null,
      features: [
        "Modern design",
        "Scratch-resistant finish",
        "Energy efficient",
        "Customizable colors"
      ]
    },
    {
      id: 3,
      name: "Security Steel Door",
      description: "Maximum security steel door with advanced locking mechanism.",
      category: "Doors",
      image: null,
      features: [
        "Anti-theft protection",
        "Multi-point locking",
        "Impact resistant",
        "Sound insulation"
      ]
    }
  ],
  windows: [
    {
      id: 4,
      name: "Fixed Steel Window",
      description: "Elegant fixed steel window with powder-coated finish.",
      category: "Windows",
      image: null,
      features: [
        "Slim steel profiles",
        "Low maintenance",
        "Rust-proof coating",
        "Modern aesthetics"
      ]
    },
    {
      id: 5,
      name: "Casement Steel Window",
      description: "Versatile casement window with smooth opening mechanism.",
      category: "Windows",
      image: null,
      features: [
        "Easy operation",
        "Weather sealing",
        "Durable hinges",
        "Energy efficient glass"
      ]
    },
    {
      id: 6,
      name: "Sliding Steel Window",
      description: "Space-saving sliding window with precision engineering.",
      category: "Windows",
      image: null,
      features: [
        "Smooth sliding action",
        "Space efficient",
        "Secure locking",
        "Easy to clean"
      ]
    }
  ]
};

// API Service Class
class ApiService {
  // Generic GET request
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  // Generic POST request
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  // Get all products
  async getAllProducts() {
    try {
      // For now, return mock data
      // When backend is ready, uncomment the line below:
      // return await this.get('/products');
      
      return [...MOCK_PRODUCTS.doors, ...MOCK_PRODUCTS.windows];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to mock data
      return [...MOCK_PRODUCTS.doors, ...MOCK_PRODUCTS.windows];
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    try {
      // For now, return mock data
      // When backend is ready, uncomment the line below:
      // return await this.get(`/products?category=${category}`);
      
      const categoryLower = category.toLowerCase();
      if (categoryLower === 'doors') {
        return MOCK_PRODUCTS.doors;
      } else if (categoryLower === 'windows') {
        return MOCK_PRODUCTS.windows;
      }
      return [];
    } catch (error) {
      console.error(`Failed to fetch ${category} products:`, error);
      return [];
    }
  }

  // Get single product by ID
  async getProductById(id) {
    try {
      // For now, return mock data
      // When backend is ready, uncomment the line below:
      // return await this.get(`/products/${id}`);
      
      const allProducts = [...MOCK_PRODUCTS.doors, ...MOCK_PRODUCTS.windows];
      return allProducts.find(product => product.id === parseInt(id));
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }

  // Submit enquiry form
  async submitEnquiry(enquiryData) {
    try {
      // Get auth header if token exists
      const headers = {
        'Content-Type': 'application/json'
      };

      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(enquiryData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      throw error;
    }
  }

  // Create order
  async createOrder(orderData) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || `HTTP error! status: ${response.status}`);
      }

      return payload;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  // Get user enquiries
  async getUserEnquiries(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/enquiries/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user enquiries:', error);
      throw error;
    }
  }

  // Validate enquiry data
  validateEnquiry(data) {
    const { name, email, phone, message } = data;

    if (!name || name.trim().length < 2) {
      throw new Error('Please enter a valid name (minimum 2 characters)');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
      throw new Error('Please enter a valid 10-digit phone number');
    }

    if (!message || message.trim().length < 10) {
      throw new Error('Please enter a message (minimum 10 characters)');
    }

    return true;
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

// Named exports for specific functions
export const {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  submitEnquiry,
  createOrder
} = apiService;
