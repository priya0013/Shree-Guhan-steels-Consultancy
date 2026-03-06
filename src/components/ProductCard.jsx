import PropTypes from "prop-types";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { name, description, image, category, features } = product;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={image || "/placeholder-product.jpg"} 
          alt={name}
          className="product-image"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="product-category">{category}</div>
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        
        {features && features.length > 0 && (
          <ul className="product-features">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index}>✓ {feature}</li>
            ))}
          </ul>
        )}
        
        <button className="btn-enquire">Enquire Now</button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    category: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default ProductCard;
