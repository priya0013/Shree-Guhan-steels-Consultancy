import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Shree Guhan Steels</h3>
          <p className="footer-description">
            Premium manufacturer of high-quality steel windows and doors. 
            Building strength and style since our inception.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="LinkedIn">linkedIn</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/products/doors">Doors</Link></li>
            <li><Link to="/products/windows">Windows</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Products</h4>
          <ul className="footer-links">
            <li><Link to="/products/doors">Industrial Doors</Link></li>
            <li><Link to="/products/doors">Commercial Doors</Link></li>
            <li><Link to="/products/windows">Fixed Windows</Link></li>
            <li><Link to="/products/windows">Sliding Windows</Link></li>
            <li><Link to="/products/windows">Casement Windows</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul className="footer-contact">
            <li>
              <h5>Address</h5>
              123 Industrial Area, City - 123456
            </li>
            <li>
              <h5>Phone</h5>
              <a href="tel:+911234567890">+91 12345 67890</a>
            </li>
            <li>
              <h5>Email</h5>
              <a href="mailto:info@shreeguhansteels.com">info@shreeguhansteels.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} Shree Guhan Steels. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
