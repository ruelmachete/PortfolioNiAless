import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; 
import "./Email.css";
import { supabase } from "../supabaseClient";

const Certificates = () => {
  const [images, setImages] = useState([]);
  const visibleCount = 3;
  const [startIndex, setStartIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      const { data } = await supabase
        .from('certificates')
        .select('image_url')
        .order('created_at', {ascending: false});
      
      if(data) {
        setImages(data.map(item => item.image_url));
      }
    };
    fetchCerts();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedImage]);

  const nextSlide = () => {
    if (images.length > 0) setStartIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length > 0) setStartIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return <div style={{textAlign: 'center', padding: '20px'}}>Loading Certificates...</div>;

  return (
    <div className="certificates-wrapper">
      
      {/* ADDED TITLE HERE */}
      <h2 className="certificates-title">My Certificates</h2>

      {/* PORTAL MODAL */}
      {selectedImage && createPortal(
        <div className="certificate-modal" onClick={() => setSelectedImage(null)}>
          <button className="close-modal-btn" onClick={() => setSelectedImage(null)}>
            ✕
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged Certificate" />
          </div>
        </div>,
        document.body
      )}

      {/* CAROUSEL TRACK */}
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
              onClick={() => setSelectedImage(img)}
              title="Click to view full screen"
            >
              <img 
                src={img} 
                alt={`certificate ${idx}`} 
                onError={(e) => e.target.src='https://via.placeholder.com/300?text=No+Image'}
              />
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