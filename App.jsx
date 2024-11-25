import React, { useState, useEffect } from "react";
 import "./App.css";

const CLIENT_ID = "EuiYQt3in3P5Zy4Eo4yP3mR08vqF7FSQO_CVSFu1cdk"; // Replace with your actual Unsplash API key

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]); // Store fetched photos
  const [page, setPage] = useState(1); // Pagination tracker
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(null); // Error tracker

  // Fetch photos from Unsplash API
  const fetchPhotos = async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/collections?query=nature&client_id=${CLIENT_ID}&page=${pageNum}&per_page=12`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Extract preview photos and collection author usernames
      const fetchedPhotos = data.results.flatMap((collection) =>
        collection.preview_photos.map((photo) => ({
          id: photo.id,
          urls: photo.urls,
          alt_description: photo.alt_description || "Nature Photo",
          username: collection.user?.username || "unknown", // Correctly extract the username from collection's user object
        }))
      );

      setPhotos((prevPhotos) => [...prevPhotos, ...fetchedPhotos]); // Append new photos
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1); // Trigger next page fetch
    }
  };

  // Fetch photos when page changes
  useEffect(() => {
    fetchPhotos(page);
  }, [page]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="gallery-container">
      <h1><u>Infinite Scroll Photo Gallery </u></h1>
      <h2>Created by: Sajan Rana</h2> {/* Replace "Your Name" with your actual name */}
      {error && <p className="error">Error: {error}</p>}
      <div className="gallery-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="gallery-item">
            <img
              src={photo.urls.small}
              alt={photo.alt_description}
              loading="lazy" // Lazy loading for performance
            />
            <p>username:- {photo.username}</p> {/* Display username */}
          </div>
        ))}
      </div>
      {loading && <p className="loading">Loading more photos...</p>}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <PhotoGallery />
    </div>
  );
};

export default App;
