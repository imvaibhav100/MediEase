import React, { useState } from "react";

function MedicineSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowAlternatives(false);
    try {
      const res = await fetch(`/api/search?query=${query}`);
      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText || "Medicine not found or could not be scraped.");
        setResults([]);
        setAlternatives([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResults(data);
      setShowAlternatives(true);
      // Fetch alternatives for first result
      if (data.length > 0) {
        const altRes = await fetch(`/api/alternatives?brandName=${data[0].name}`);
        if (altRes.ok) {
          const altData = await altRes.json();
          setAlternatives(altData);
        } else {
          setAlternatives([]);
        }
      } else {
        setAlternatives([]);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setResults([]);
      setAlternatives([]);
    }
    setLoading(false);
  };

  return (
    <div className="medicine-search">
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicine (brand/generic/combo)"
          style={{ padding: 8, width: 300 }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>
          Search
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {results.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {results.map((med) => (
              <li key={med.id}>
                <b>{med.name}</b> (Salts: {med.salts.join(", ")}) - ₹{med.price}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showAlternatives && (
        <div>
          <h3>Generic & Cheaper Alternatives:</h3>
          {alternatives.length > 0 ? (
            <ul>
              {alternatives.map((alt, idx) => (
                <li
                  key={alt.id || idx}
                  style={{
                    background: idx === 0 ? "#d4edda" : "",
                    fontWeight: idx === 0 ? "bold" : "normal",
                  }}
                >
                  {alt.name} (Salts: {alt.salts.join(", ")}) - ₹{alt.price}
                  {idx === 0 && <span> (Lowest Price)</span>}
                </li>
              ))}
            </ul>
          ) : (
            <div>No alternatives found. Showing original brand or fallback.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicineSearch;
