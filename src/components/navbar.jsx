import { Link, NavLink } from "react-router-dom";
import { Heart, PackageCheck, Search, ShoppingCart } from "lucide-react";

function Navbar({ cartCount, wishlistCount, searchTerm, onSearchChange }) {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="logo" aria-label="Vibemart home">
          vibe<span>mart</span><i aria-hidden="true">.</i>
        </Link>

        <div className="search-box">
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <Search size={19} aria-hidden="true" />
        </div>

        <div className="nav-actions">
          <NavLink to="/" end className="nav-link">
            Shop all
          </NavLink>
          <NavLink className="nav-icon-link" to="/wishlist" aria-label={`Wishlist, ${wishlistCount} saved items`}>
            <Heart size={20} aria-hidden="true" />
            <span className="nav-label">Saved</span>
            <span className="nav-count">{wishlistCount}</span>
          </NavLink>
          <NavLink className="nav-icon-link orders-link" to="/orders" aria-label="Order history">
            <PackageCheck size={20} aria-hidden="true" />
            <span className="nav-label">Orders</span>
          </NavLink>
          <NavLink to="/cart" className="cart-button" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingCart size={20} aria-hidden="true" />
            <span className="nav-label">Bag</span>
            <span className="cart-count">{cartCount}</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;