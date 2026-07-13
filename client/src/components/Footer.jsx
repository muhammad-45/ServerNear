import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiHeart } from 'react-icons/fi';
import logo from '../assets/logo.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="ServeNear" className="footer-logo" />
            <p className="footer-desc">
              Connecting you with trusted local service providers across Pakistan.
              Quality services at your doorstep.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/services" className="footer-link">Find Services</Link>
            <Link to="/register" className="footer-link">Become a Provider</Link>
            <Link to="/login" className="footer-link">Login</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Services</h4>
            <Link to="/services?category=electrician" className="footer-link">Electricians</Link>
            <Link to="/services?category=plumber" className="footer-link">Plumbers</Link>
            <Link to="/services?category=tutor" className="footer-link">Tutors</Link>
            <Link to="/services?category=mechanic" className="footer-link">Mechanics</Link>
            <Link to="/services?category=beautician" className="footer-link">Beauticians</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <FiMapPin size={16} />
              <span>Abbottabad, Pakistan</span>
            </div>
            <div className="footer-contact">
              <FiPhone size={16} />
              <span>+92-300-0000000</span>
            </div>
            <div className="footer-contact">
              <FiMail size={16} />
              <span>info@servenear.com</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ServeNear. Made by MSA, JJ, AK, AN</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
