import { useMemo, useState } from "react";
import csc from "country-state-city/lib/cjs/index.js";
import apiService from "../../services/api";
import "./Contact.css";

const { Country, State, City } = csc;

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "",
    country: "",
    state: "",
    city: "",
    visitorType: "",
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const inquiryTypes = [
    "Product Information",
    "Quote Request",
    "Technical Support",
    "Bulk Order",
    "Franchise Inquiry",
    "Other"
  ];

  const countries = useMemo(() => {
    try {
      return Country.getAllCountries().filter((country) => country?.name && country?.isoCode);
    } catch {
      return [];
    }
  }, []);

  const selectedCountry = useMemo(
    () => {
      if (!formData.country) {
        return null;
      }
      return countries.find((c) => c.name === formData.country) || null;
    },
    [countries, formData.country]
  );

  const availableStates = useMemo(() => {
    if (!selectedCountry?.isoCode) {
      return [];
    }

    try {
      return State.getStatesOfCountry(selectedCountry.isoCode).filter(
        (state) => state?.name && state?.isoCode
      );
    } catch {
      return [];
    }
  }, [selectedCountry]);

  const selectedState = useMemo(
    () => availableStates.find((state) => state.name === formData.state),
    [availableStates, formData.state]
  );

  const availableCities = useMemo(() => {
    if (!selectedCountry?.isoCode || !selectedState?.isoCode) {
      return [];
    }

    try {
      return City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode).filter(
        (city) => city?.name
      );
    } catch {
      return [];
    }
  }, [selectedCountry, selectedState]);

  const visitorTypes = ["Architect", "Contractor", "Designer", "End User", "Retailer", "Other"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (type === "checkbox") {
        return {
          ...prev,
          [name]: checked
        };
      }

      if (name === "country") {
        return {
          ...prev,
          country: value,
          state: "",
          city: ""
        };
      }

      if (name === "state") {
        return {
          ...prev,
          state: value,
          city: ""
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    if (name === "country") {
      setErrors((prev) => ({
        ...prev,
        country: "",
        state: "",
        city: ""
      }));
    }

    if (name === "state") {
      setErrors((prev) => ({
        ...prev,
        state: "",
        city: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    const phoneDigits = formData.phone.replace(/\s/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phoneDigits)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.enquiryType) {
      newErrors.enquiryType = "Type of enquiry is required";
    }

    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    if (!formData.visitorType) {
      newErrors.visitorType = "Type of visitor is required";
    }

    // Consent validation
    if (!formData.consent) {
      newErrors.consent = "You must consent to submit the form";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await apiService.submitEnquiry(formData);
      
      setSubmitStatus({
        type: "success",
        message: "Thank you! We'll get back to you soon."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        enquiryType: "",
        country: "",
        state: "",
        city: "",
        visitorType: "",
        consent: false
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to submit enquiry. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Contact Banner */}
      <section className="contact-banner">
        <img 
          src="src/assets/images/home 3.avif" 
          alt="Contact Banner" 
          className="banner-image"
        />
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h1>Contact</h1>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="get-intouch-section">
        <div className="container">
          <div className="intouch-header">
            <h2>GET INTOUCH</h2>
            <p>Whether you have a question or need support, our experts are just a click away.</p>
          </div>

          <div className="contact-methods">
            <div className="method-card">
              <div className="method-icon email-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <p className="method-label">Email:</p>
              <a href="mailto:info@shreeguhansteels.com">info@shreeguhansteels.com</a>
            </div>

            <div className="method-card">
              <div className="method-icon phone-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <p className="method-label">Toll Free No.:</p>
              <a href="tel:+911234567890">1800 833 0004</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-card">
            {submitStatus && (
              <div className={`submit-status ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="enquiryType">Type of Enquiry *</label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    value={formData.enquiryType}
                    onChange={handleChange}
                    className={errors.enquiryType ? "error" : ""}
                  >
                    <option value="">---Type of Enquiry---</option>
                    {inquiryTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.enquiryType && <span className="error-message">{errors.enquiryType}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="country">Select Country *</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={errors.country ? "error" : ""}
                  >
                    <option value="">---Select Country---</option>
                    {countries.map((country) => (
                      <option key={`${country.isoCode}-${country.name}`} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="state">Select State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!formData.country}
                    className={errors.state ? "error" : ""}
                  >
                    <option value="">---Select State---</option>
                    {availableStates.map((state) => (
                      <option key={`${state.isoCode}-${state.name}`} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {formData.country && availableStates.length === 0 && (
                    <span style={{color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block'}}>
                      No states available for {formData.country}
                    </span>
                  )}
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="city">Select City *</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.state}
                    className={errors.city ? "error" : ""}
                  >
                    <option value="">---Select City---</option>
                    {availableCities.map((city, index) => (
                      <option key={`${city.name}-${index}`} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error" : ""}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "error" : ""}
                    placeholder="1234567890"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="visitorType">Type of Visitor *</label>
                  <select
                    id="visitorType"
                    name="visitorType"
                    value={formData.visitorType}
                    onChange={handleChange}
                    className={errors.visitorType ? "error" : ""}
                  >
                    <option value="">---Type of Visitor---</option>
                    {visitorTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.visitorType && <span className="error-message">{errors.visitorType}</span>}
                </div>
              </div>

              <div className="consent-group">
                <label className="consent-label">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                  />
                  <span>I Consent to have this website store my submitted information so they can respond to my inquiry.</span>
                </label>
                {errors.consent && <span className="error-message">{errors.consent}</span>}
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Information Footer */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="info-column">
              <h3>CONTACT US</h3>
              <address>
                Shree Guhan Steels<br />
                123 Industrial Area<br />
                Manufacturing Zone<br />
                City, State - 123456, India
              </address>
              <div className="contact-details">
                <p>
                  <strong>Phone:</strong><br />
                  <a href="tel:+911234567890">+91 12345 67890</a><br />
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </p>
                <p>
                  <strong>Email:</strong><br />
                  <a href="mailto:info@shreeguhansteels.com">info@shreeguhansteels.com</a><br />
                  <a href="mailto:sales@shreeguhansteels.com">sales@shreeguhansteels.com</a>
                </p>
              </div>
            </div>

            <div className="info-column">
              <h3>FOLLOW US</h3>
              <div className="social-links">
                <a href="#" title="LinkedIn" className="social-icon">in</a>
                <a href="#" title="YouTube" className="social-icon">yt</a>
                <a href="#" title="Instagram" className="social-icon">ig</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
