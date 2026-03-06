import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const cartCount = cart.length;

  // Search data - products database
  const allProducts = [
    { id: 1, name: "Casement Steel Window", category: "Windows", path: "/products/windows", description: "Premium quality casement steel window with powder coating" },
    { id: 2, name: "Sliding Steel Window", category: "Windows", path: "/products/windows", description: "Durable sliding steel windows for modern homes" },
    { id: 3, name: "Fixed Steel Window", category: "Windows", path: "/products/windows", description: "Fixed steel window frames with superior strength" },
    { id: 4, name: "Ventilator Steel Window", category: "Windows", path: "/products/windows", description: "Steel ventilator windows for optimal air circulation" },
    { id: 5, name: "Bay Steel Window", category: "Windows", path: "/products/windows", description: "Elegant bay windows crafted from premium steel" },
    { id: 6, name: "Awning Steel Window", category: "Windows", path: "/products/windows", description: "Weather-resistant awning steel windows" },
    { id: 7, name: "Combination Steel Window", category: "Windows", path: "/products/windows", description: "Customizable combination steel window designs" },
    { id: 8, name: "Main Steel Door", category: "Doors", path: "/products/doors", description: "Heavy-duty main entrance steel doors" },
    { id: 9, name: "Security Steel Door", category: "Doors", path: "/products/doors", description: "High-security steel doors with advanced locking" },
    { id: 10, name: "Single Panel Steel Door", category: "Doors", path: "/products/doors", description: "Classic single panel steel door designs" },
    { id: 11, name: "Double Panel Steel Door", category: "Doors", path: "/products/doors", description: "Double panel steel doors for wider entry" },
    { id: 12, name: "Glass Panel Steel Door", category: "Doors", path: "/products/doors", description: "Modern glass panel steel doors" },
  ];

  const megaMenuSections = [
    {
      title: "ABOUT",
      links: [
        { label: "About Us", to: "/products" },
        { label: "Our Journey", to: "/products" },
        { label: "Sustainability", to: "/products" }
      ]
    },
    {
      title: "SOLUTIONS",
      links: [
        { label: "Residential", to: "/products/doors" },
        { label: "Commercial", to: "/products/windows" },
        { label: "Hospitality", to: "/products" }
      ]
    },
    {
      title: "RESOURCES",
      links: [
        { label: "Catalogues", to: "/products" },
        { label: "Technical Data", to: "/products" },
        { label: "Video Library", to: "/products" }
      ]
    },
    {
      title: "HELP & SUPPORT",
      links: [
        { label: "Visualizer", to: "/products/doors" },
        { label: "FAQs", to: "/contact" },
        { label: "Contact Support", to: "/contact" }
      ]
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    setIsMegaMenuOpen(false);
  };

  const handleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const toggleMegaMenu = () => {
    setIsMegaMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
  };

  const handleProductClick = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Close search on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        }
        if (isMegaMenuOpen) {
          setIsMegaMenuOpen(false);
        }
        if (isAuthDropdownOpen) {
          setIsAuthDropdownOpen(false);
        }
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen, isMegaMenuOpen, isAuthDropdownOpen]);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img 
            src="/src/assets/images/random/logo.png" 
            alt="Shree Guhan Steels Logo" 
            className="logo-image"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Home
          </Link>

          <div className="dropdown">
            <button
              className={`dropbtn ${activeDropdown === 'products' ? 'active' : ''}`}
              onClick={() => handleDropdown('products')}
            >
              Our Products <span className="dropdown-icon">▼</span>
            </button>
            <div className={`dropdown-content ${activeDropdown === 'products' ? 'show' : ''}`}>
              <Link to="/products/windows" onClick={closeMenu}>Steel Windows</Link>
              <Link to="/products/doors" onClick={closeMenu}>Steel Doors</Link>
            </div>
          </div>

          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            Contact
          </Link>

          <button
            type="button"
            className={`nav-link menu-link-btn ${isMegaMenuOpen ? 'active' : ''}`}
            onClick={toggleMegaMenu}
          >
            Menu <span className="menu-bars">☰</span>
          </button>
        </nav>

        {/* Right Section - Actions */}
        <div className="header-actions">
          <button className="icon-btn search-btn" title="Search" onClick={toggleSearch}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>

          <button className="icon-btn cart-btn" title="Shopping Cart" onClick={() => navigate('/cart')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {isAuthenticated ? (
            <div className="auth-dropdown">
              <button 
                className="user-btn"
                onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                title={user?.name}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </button>
              
              {isAuthDropdownOpen && (
                <div className="auth-dropdown-menu">
                  <Link to="/" onClick={() => setIsAuthDropdownOpen(false)} className="dropdown-item user-info">
                    <strong>{user?.name}</strong>
                    <small>{user?.email}</small>
                  </Link>
                  <hr />
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      logout();
                      setIsAuthDropdownOpen(false);
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {isMegaMenuOpen && (
        <div className="mega-menu-overlay" onClick={toggleMegaMenu}>
          <div className="mega-menu-panel" onClick={(event) => event.stopPropagation()}>
            <div className="mega-menu-grid">
              {megaMenuSections.map((section) => (
                <div key={section.title} className="mega-menu-column">
                  <h4>{section.title}</h4>
                  <div className="mega-column-divider"></div>
                  <ul>
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link to={link.to} onClick={closeMenu}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="search-modal-overlay" onClick={toggleSearch}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <input
                type="text"
                className="search-input"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
              />
              <button className="search-close-btn" onClick={toggleSearch}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="search-results">
              {searchQuery === "" ? (
                <div className="search-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <p>Start typing to search for products...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="search-results-list">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="search-result-item"
                      onClick={() => handleProductClick(product.path)}
                    >
                      <div className="search-result-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        </svg>
                      </div>
                      <div className="search-result-content">
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                        <span className="search-result-category">{product.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-no-results">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <p>No products found for "{searchQuery}"</p>
                  <small>Try searching for windows, doors, or steel products</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
