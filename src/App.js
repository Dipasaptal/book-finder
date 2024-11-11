// src/App.js
import React, { useState } from "react";
import "./App.css"; // For styling (you can use Tailwind, CSS modules, etc.)

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      setBooks([]);

      const response = await fetch(
        `https://openlibrary.org/search.json?title=${searchTerm}`
      );
      const data = await response.json();

      if (data.docs.length === 0) {
        setError("No books found. Try a different title.");
      } else {
        setBooks(data.docs.slice(0, 10)); // Limit to first 10 results for better UX
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-primary">Book Finder</h1>

      {/* Search Bar */}
      <div className="flex gap-2">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter book title..."className="border border-black rounded-md p-2 flex-grow  txtbox"/>
        <button onClick={handleSearch} className="bg-blue-500 text-blue rounded-md p-2 search">
          Search
        </button>
      </div>

      {/* Loading Spinner */}
      {isLoading && <p className="text-center mt-4">Loading...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Book Results */}
      <div className="book-results mt-6">
        {books.map((book, index) => (
          <div
            key={index}
            className="book-item border-b border-gray-200 py-4 flex items-start gap-4"
          >
            {/* Book Cover */}
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={`${book.title} cover`}
                className="w-16 h-24 object-cover"
              />
            ) : (
              <div className="w-16 h-24 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                No Cover
              </div>
            )}

            {/* Book Details */}
            <div>
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-sm">
                by {book.author_name ? book.author_name.join(", ") : "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                First published: {book.first_publish_year || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

