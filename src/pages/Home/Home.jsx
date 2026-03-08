import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";

// Import hero images
import heroHome from "../../assets/images/home.png";
import heroHome1 from "../../assets/images/home 1.jpg";
import heroHome2 from "../../assets/images/home 2.jpg";
import heroHome3 from "../../assets/images/home 3.avif";

function Home() {
  // Hero carousel state
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  
  // Carousel state for spaces section
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      image: heroHome,
      title: "FIND THE PERFECT",
      subtitle: "DOOR",
      buttonText: "PRODUCT RANGE"
    },
    {
      id: 2,
      image: heroHome1,
      title: "PREMIUM STEEL",
      subtitle: "SOLUTIONS",
      buttonText: "EXPLORE NOW"
    },
    {
      id: 3,
      image: heroHome2,
      title: "DURABLE &",
      subtitle: "ELEGANT",
      buttonText: "VIEW PRODUCTS"
    },
    {
      id: 4,
      image: heroHome3,
      title: "CRAFTED FOR",
      subtitle: "EXCELLENCE",
      buttonText: "DISCOVER MORE"
    }
  ];
  
  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [heroSlides.length]);
  
  const handlePrevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };
  
  const handleNextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // All space categories
  const allSpaces = [
    {
      id: 1,
      image: "/src/assets/images/doors/d1.jpg",
      title: "Education",
      badge: null
    },
    {
      id: 3,
      image: "/src/assets/images/doors/d8.jpg",
      title: "Hospitality",
      badge: null
    },
    {
      id: 4,
      image: "/src/assets/images/doors/d2.jpg",
      title: "Residential",
      badge: null
    },
    {
      id: 6,
      image: "/src/assets/images/doors/d10.jpg",
      title: "Industrial",
      badge: null
    }
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? allSpaces.length - 3 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev >= allSpaces.length - 3 ? 0 : prev + 1));
  };

  return (
    <div className="home">
      {/* Hero Section - Carousel */}
      <section className="hero-carousel">
        {/* Hero Slides */}
        <div className="hero-slides">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${
                index === currentHeroSlide ? "active" : ""
              } ${
                index === (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length
                  ? "prev"
                  : ""
              } ${
                index === (currentHeroSlide + 1) % heroSlides.length ? "next" : ""
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay"></div>
              
              <div className="hero-content">
                <h1 className="hero-main-title">
                  {slide.title}<br />
                  <span className="hero-subtitle">{slide.subtitle}</span>
                </h1>
                
                <Link to="/products" className="hero-btn-outline">
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button className="hero-arrow hero-arrow-left" onClick={handlePrevHeroSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button className="hero-arrow hero-arrow-right" onClick={handleNextHeroSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        {/* Slide Indicators */}
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-indicator ${index === currentHeroSlide ? "active" : ""}`}
              onClick={() => setCurrentHeroSlide(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-layout">
            {/* Left Panel - Description */}
            <div className="features-description">
              <h2 className="features-title">
                WHY CHOOSE<br />
                <span className="title-highlight">SHREE GUHAN STEELS?</span>
              </h2>
              <p className="features-text">
                When we think of steel doors and windows, we think of strength and 
                craftsmanship behind it. Shree Guhan Steels are offered as a single, 
                factory-finished unit. The complete door and window sets are natural 
                progression over the outdated methods where different types of steel 
                doors & frames were provided separately.
              </p>
            </div>

            {/* Right Panel - Feature Cards */}
            <div className="features-cards">
              <div className="feature-product-card">
                <div className="feature-product-image">
                  <img src="/src/assets/images/random/w1.png" alt="Superior Durability" />
                </div>
                <div className="feature-product-content">
                  <h3>SUPERIOR DURABILITY SETS</h3>
                  <p>Shree Guhan brings to you premium quality steel that withstands 
                  extreme weather and provides long-lasting performance for your property.</p>
                  <Link to="/products" className="feature-explore-btn">EXPLORE</Link>
                </div>
              </div>

              <div className="feature-product-card">
                <div className="feature-product-image">
                  <img src="/src/assets/images/random/w7.png" alt="Custom Design" />
                </div>
                <div className="feature-product-content">
                  <h3>DESIGNER DOOR & WINDOW SETS</h3>
                  <p>Curated collections that redefine the concept of design, offering 
                  a seamless blend of functionality and aesthetic appeal.</p>
                  <Link to="/products" className="feature-explore-btn">EXPLORE</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution by Spaces Section */}
      <section className="spaces-section">
        <div className="container">
          <div className="spaces-layout">
            {/* Left Side - Title */}
            <div className="spaces-title-wrapper">
              <h2 className="spaces-main-title">
                SOLUTION BY<br />
                <span className="spaces-highlight">SPACES</span>
              </h2>
            </div>

            {/* Navigation Arrow - Left */}
            <button 
              className="spaces-nav-arrow spaces-nav-left" 
              onClick={handlePrevSlide}
              aria-label="Previous"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Center - Space Cards Carousel */}
            <div className="spaces-carousel-wrapper">
              <div 
                className="spaces-cards" 
                style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
              >
                {allSpaces.map((space) => (
                  <div className="space-card" key={space.id}>
                    <div className="space-card-image">
                      <img src={space.image} alt={`${space.title} Space`} />
                      <div className="space-card-overlay"></div>
                      {space.badge && (
                        <div className="space-card-badge">
                          <div className="badge-icon-circle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                            </svg>
                          </div>
                          <span className="badge-text">{space.badge.text}</span>
                        </div>
                      )}
                      <h3 className="space-card-title">{space.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrow - Right */}
            <button 
              className="spaces-nav-arrow spaces-nav-right" 
              onClick={handleNextSlide}
              aria-label="Next"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Space?</h2>
          <p>Get in touch with us today for a free consultation and quote.</p>
          <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

