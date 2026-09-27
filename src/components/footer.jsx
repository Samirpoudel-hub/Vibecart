import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-about" id="about">
          <Link to="/" className="footer-brand">vibe<span>mart</span><i>.</i></Link>
          <p>Everyday essentials, thoughtfully picked. Good design, useful details, and little things that make a day.</p>
        </div>
        <div className="footer-column">
          <h2>Quick links</h2>
          <Link to="/">Shop all</Link>
          <Link to="/wishlist">Saved items</Link>
          <Link to="/cart">Your bag</Link>
          <Link to="/orders">Order history</Link>
        </div>
        <div className="footer-column">
          <h2>About</h2>
          <a href="#about">Our point of view</a>
          <a href="#catalog">The collection</a>
          <span>Made for the everyday</span>
        </div>
        <div className="footer-column footer-contact">
          <h2>Contact</h2>
          <p>Have a question about a find?</p>
          <a href="mailto:hello@vibemart.store">hello@vibemart.store <ArrowUpRight size={14} /></a>
          <div className="social-links" aria-label="Social links">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Vibemart. All rights reserved.</span>
        <span>Thoughtfully selected, always.</span>
      </div>
    </footer>
  );
}

export default Footer;