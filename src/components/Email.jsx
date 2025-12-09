import React, { useState, useEffect } from "react";
import "./Email.css";
import { supabase } from "../supabaseClient";

const Certificates = () => {
  const [images, setImages] = useState([]);
  const visibleCount = 3;
  const [startIndex, setStartIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      const { data } = await supabase.from('certificates').select('image_url').order('created_at', {ascending: false});
      if(data) {
        // Map Supabase object to simple array of strings if that's what your CSS expects, 
        // or update CSS to handle objects. Here I extract just the URL.
        setImages(data.map(item => item.image_url));
      }
    };
    fetchCerts();
  }, []);

  const nextSlide = () => {
    if (images.length > 0) setStartIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length > 0) setStartIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return <div>Loading Certificates...</div>;

  return (
    <div className="certificates-wrapper">
      {hoveredImage && (
        <div className="hover-preview">
          <img src={hoveredImage} alt="Preview" />
        </div>
      )}

      <div className="certificates-container">
        <div
          className="certificates-track"
          style={{
            transform: `translateX(-${(startIndex * 100) / visibleCount}%)`,
          }}
        >
          {images.map((img, idx) => (
            <div
              className="certificate-card"
              key={idx}
              onMouseEnter={() => setHoveredImage(img)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img src={img} alt={`certificate ${idx}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-buttons">
        <button className="carousel-btn" onClick={prevSlide}>&#10094; Prev</button>
        <button className="carousel-btn" onClick={nextSlide}>Next &#10095;</button>
      </div>
    </div>
  );
};

export default Certificates;