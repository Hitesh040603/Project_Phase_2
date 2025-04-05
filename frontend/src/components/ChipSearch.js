import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { API_BASE_URL, MILLISECONDS_PYTHON } from "../config";
import { Link } from "react-router-dom";

function ChipSearch() {
  const [chipId, setChipId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!chipId) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/blockchain/search?chip_id=${chipId}`)
      .then(response => response.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const ChipSearchResult = ({ result }) => {
    const { timestamp, chip_info, status } = result;
    const timestampDisplay = new Date(timestamp / MILLISECONDS_PYTHON).toLocaleString();

    return (
      <div className="ChipSearchResult">
        <hr />
        <div><strong>Timestamp:</strong> {timestampDisplay}</div>
        <div><strong>Chip ID:</strong> {chip_info.chip_id}</div>
        <div><strong>Make:</strong> {chip_info.chip_make}</div>
        <div><strong>Status:</strong> {status}</div>
      </div>
    );
  };

  return (
    <div className="ChipSearch">
      <Link to="/">Home</Link>
      <hr />
      <h3>Search Chip History</h3>

      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Enter Chip ID"
          value={chipId}
          onChange={(e) => setChipId(e.target.value)}
        />
      </Form.Group>
      <br />
      <Button variant="primary" onClick={handleSearch}>Search</Button>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <div>
          <h4>Search Results</h4>
          {results.map((result, i) => (
            <ChipSearchResult key={i} result={result} />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && chipId && (
        <p>No results found for Chip ID: {chipId}</p>
      )}
    </div>
  );
}

export default ChipSearch;
