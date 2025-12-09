import React, { useEffect, useState } from "react";
import "./Quotes.css";

const Quotes = () => {
  const [quote, setQuote] = useState({ text: "Loading inspiration...", author: "" });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Fetching from a stable, free Quotes API
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        
        if (data && data.quote) {
          setQuote({ text: data.quote, author: data.author });
        } else {
          throw new Error("No data");
        }
      } catch (error) {
        // Fallback quote if API fails
        setQuote({ 
          text: "Code is like humor. When you have to explain it, it’s bad.", 
          author: "Cory House" 
        });
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="quote-wrapper">
      <div className="quote-box">
        <p className="quote-text">“{quote.text}”</p>
        <span className="quote-author">— {quote.author}</span>
      </div>
    </div>
  );
};

export default Quotes;