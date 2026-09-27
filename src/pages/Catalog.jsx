import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDownWideNarrow, Search } from "lucide-react";
import ProductCard from "../components/productcard";

function Catalog({ products, searchTerm, wishlist, onToggleWishlist, onAddToCart }) {
  const [searchParams] = useSearchParams();
  const isWishlistView = searchParams.get("view") === "wishlist";
  const categories = ["Electronics", "Fashion", "Accessories", "Home"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minimumRating, setMinimumRating] = useState("0");
  const [availability, setAvailability] = useState("all");

  const filteredProducts = products.filter((product) => {
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesWishlist = !isWishlistView || wishlist.includes(product.id);
    const matchesMinimumPrice = minPrice === "" || product.price >= Number(minPrice);
    const matchesMaximumPrice = maxPrice === "" || product.price <= Number(maxPrice);
    const matchesRating = product.rating >= Number(minimumRating);
    const isInStock = product.inStock !== false;
    const matchesAvailability = availability === "all"
      || (availability === "in-stock" && isInStock)
      || (availability === "out-of-stock" && !isInStock);
    return matchesSearch && matchesCategory && matchesWishlist && matchesMinimumPrice
      && matchesMaximumPrice && matchesRating && matchesAvailability;
  });
  const sortedProducts = [...filteredProducts].sort((first, second) => {
    if (sortOrder === "price-low") return first.price - second.price;
    if (sortOrder === "price-high") return second.price - first.price;
    if (sortOrder === "rating") return second.rating - first.rating;
    return first.id - second.id;
  });

  return (
    <main>
      <section className="hero">
        <div className="hero-photo" role="img" aria-label="A thoughtfully styled modern home and lifestyle collection" />
        <div className="hero-inner">
          <div className="hero-content">
            <p className="eyebrow">GOOD THINGS, WELL FOUND</p>
            <h1>Find your new<br />everyday favorite.</h1>
            <p className="hero-description">
              Considered essentials for the way you live, work, and unwind. A little more joy in the everyday starts here.
            </p>
            <a className="shop-button" href="#catalog">Shop the collection <span aria-hidden="true">→</span></a>
            <div className="hero-note"><span className="hero-note-dot" /> Thoughtful finds. Everyday prices.</div>
          </div>
          <div className="hero-caption"><span>01 / 04</span><span>Everyday, considered.</span></div>
        </div>
      </section>

      <div className="catalog-wrap" id="catalog">
        <section className="category-section section-width">
          <div className="section-heading">
            <div><p className="eyebrow">A GOOD PLACE TO START</p><h2>Shop by category</h2></div>
            <span className="section-aside">Four corners of everyday living</span>
          </div>
          <div className="category-grid">
            {categories.map((category) => {
              const categoryProduct = products.find((product) => product.category === category);
              return (
                <button
                  className={selectedCategory === category ? "category-card selected" : "category-card"}
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    document.getElementById("product-list")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <img src={categoryProduct.image} alt="" loading="lazy" />
                  <span className="category-card-shade" />
                  <span className="category-card-label">{category}<span aria-hidden="true">↗</span></span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="products-section section-width" id="product-list">
          <div className="section-heading product-section-heading">
            <div>
              <p className="eyebrow">THE VIBEMART EDIT</p>
              <h2>{isWishlistView ? "Your saved finds" : selectedCategory === "All" ? "Made for every day" : selectedCategory}</h2>
            </div>
            <label className="sort-control">
              <ArrowDownWideNarrow size={17} aria-hidden="true" />
              <span className="sr-only">Sort products</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>

          <div className="catalog-toolbar">
            <div className="category-filters" aria-label="Filter by category">
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  className={selectedCategory === category ? "category-button active" : "category-button"}
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <span className="result-count">{sortedProducts.length} {sortedProducts.length === 1 ? "piece" : "pieces"}</span>
          </div>

          <div className="advanced-filters" aria-label="Advanced product filters">
            <fieldset className="price-filter">
              <legend>Price range</legend>
              <label>Min <span className="sr-only">price</span><input type="number" min="0" step="100" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Rs. 0" /></label>
              <span aria-hidden="true">–</span>
              <label>Max <span className="sr-only">price</span><input type="number" min="0" step="100" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="No limit" /></label>
            </fieldset>
            <label className="filter-select">
              Minimum rating
              <select value={minimumRating} onChange={(event) => setMinimumRating(event.target.value)}>
                <option value="0">Any rating</option>
                <option value="3">3 stars & up</option>
                <option value="4">4 stars & up</option>
                <option value="4.5">4.5 stars & up</option>
              </select>
            </label>
            <label className="filter-select">
              Availability
              <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                <option value="all">All products</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </label>
            <button className="filter-reset" type="button" onClick={() => { setMinPrice(""); setMaxPrice(""); setMinimumRating("0"); setAvailability("all"); }}>
              Reset filters
            </button>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="empty-products">
              <Search size={32} aria-hidden="true" />
              <h3>{isWishlistView && wishlist.length === 0 ? "Your saved list is ready" : "Nothing found just yet"}</h3>
              <p>{isWishlistView ? "Tap the heart on a product to keep it close." : "Try another search or choose a different category."}</p>
              {isWishlistView && <Link className="text-link" to="/">Explore the collection <span aria-hidden="true">→</span></Link>}
            </div>
          ) : (
            <div className="product-grid">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
          <div className="catalog-bottom-link"><Link to="/cart">View your bag <span aria-hidden="true">→</span></Link></div>
        </section>
      </div>
    </main>
  );
}

export default Catalog;