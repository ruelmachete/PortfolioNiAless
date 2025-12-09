import React, { useEffect, useState } from "react";

const Quotes = () => {
  const [joke, setJoke] = useState("");

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        const response = await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");
        const data = await response.json();

        if (data && data.joke) {
          setJoke(data.joke);
        } else {
          setJoke("No joke found 😅");
        }
      } catch (error) {
        console.error("Error fetching joke:", error);
        setJoke("Error loading joke 😅");
      }
    };

    fetchJoke();
  }, []);

  return (
    <div
      style={{
        margin: "30px auto",
        width: "80%",
        height: "60px",
        backgroundColor: "rgba(255, 192, 203, 0.25)", 
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "10px 20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        color: "#ad1457",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "0.95rem",
        fontWeight: 500,
      }}
    >
      {joke ? `"${joke}"` : "Loading joke... 💭"}
    </div>
  );
};

export default Quotes;
