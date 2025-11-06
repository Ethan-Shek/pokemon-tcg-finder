import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "./App.css"; // We'll use this for custom centering styles

function App() {
  return (
    <Router>
      <section className="section is-flex is-align-items-center is-justify-content-center full-height">
        <div className="container">
          <header className="has-text-centered mb-5">
            <h1 className="title is-2 has-text-primary">Pokémon TCG Finder</h1>
            <nav className="buttons is-centered mt-3">
              <Link to="/" className="button is-link is-light">Home</Link>
              <Link to="/about" className="button is-link is-light">About</Link>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>

          <footer className="has-text-centered mt-6">
            <p>Powered by Pokémon TCG API</p>
          </footer>
        </div>
      </section>
    </Router>
  );
}

function SearchPage() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("");
  const [status, setStatus] = useState("");

  const fetchCards = async () => {
    const params = [];
    if (search) params.push(`name:${search}`);
    if (rarity) params.push(`rarity:${rarity}`);

    const queryString = params.length ? `?q=${params.join(" ")}` : "";
    setStatus("Searching...");

    try {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards${queryString}`
      );

      const data = await response.json();

      if (data.data.length > 0) {
        setCards(data.data);
        setStatus(`Found ${data.data.length} card(s).`);
      } else {
        setCards([]);
        setStatus("No cards found. Try another search.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setStatus("Error fetching data. Please try again later.");
    }
  };

  const clearSearch = () => {
    setSearch("");
    setRarity("");
    setCards([]);
    setStatus("");
  };

  return (
    <div>
      <div className="field is-grouped is-grouped-multiline is-justify-content-center mb-4">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="control">
          <div className="select">
            <select value={rarity} onChange={(e) => setRarity(e.target.value)}>
              <option value="">Any Rarity</option>
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
            </select>
          </div>
        </div>

        <div className="control">
          <button className="button is-primary" onClick={fetchCards}>
            Search
          </button>
        </div>
        <div className="control">
          <button className="button is-light" onClick={clearSearch}>
            Clear
          </button>
        </div>
      </div>

      <div className="has-text-centered mb-4">{status}</div>

      <div className="columns is-multiline">
        {cards.map((card) => (
          <div key={card.id} className="column is-one-quarter">
            <div className="card">
              <div className="card-image">
                <figure className="image is-4by3">
                  <img src={card.images.small} alt={card.name} />
                </figure>
              </div>
              <div className="card-content has-text-centered">
                <p className="title is-6">{card.name}</p>
                <p className="subtitle is-7">Rarity: {card.rarity || "N/A"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="content has-text-centered">
      <h2 className="title is-4">About This App</h2>
      <p>
        This project uses the <strong>Pokémon TCG API</strong> to let you search for Pokémon cards by name and rarity.
        Built with <strong>React</strong> and styled using <strong>Bulma CSS</strong>.
      </p>
    </div>
  );
}

export default App;
