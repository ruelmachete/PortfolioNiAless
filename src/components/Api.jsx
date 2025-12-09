import React, { useState, useEffect, useRef } from "react";
import "./Api.css";

function Api() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm Alessandra's AI Assistant. Ask me anything about her projects, skills, or contact info!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef(null);

  // The external API endpoint
  const CHATBOT_ENDPOINT = "https://jonn8n.safehub-lcup.uk/webhook/chatbot";

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // --- SMART FALLBACK LOGIC ---
  // If the real API fails, this function generates a response locally.
  const getDemoResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("hello") || lowerText.includes("hi")) 
      return "Hello! How can I help you today?";
    
    if (lowerText.includes("who are you") || lowerText.includes("name")) 
      return "I am Alessandra's virtual assistant. I can tell you about her work!";
    
    if (lowerText.includes("skill") || lowerText.includes("stack")) 
      return "Alessandra is skilled in React, Java, Web Development, and UI/UX Design.";
    
    if (lowerText.includes("contact") || lowerText.includes("email")) 
      return "You can contact Alessandra at alessandranixxx@gmail.com.";
    
    if (lowerText.includes("project")) 
      return "She has worked on amazing projects like the Luxxe Palace Hotel system and Tech Care Assistance.";

    return "I'm running in demo mode because the server is quiet, but I can tell you Alessandra is an amazing developer!";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input; // Save for logic
    setInput("");
    setLoading(true);

    try {
      // 2. Attempt Real API Call
      const res = await fetch(CHATBOT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();
      
      // Handle various response formats from different API types (n8n, OpenAI, etc.)
      const replyText = 
        typeof data === 'string' ? data : 
        (data.output || data.reply || data.message || data.text || JSON.stringify(data));
      
      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);

    } catch (err) {
      console.warn("Chatbot API unreachable, switching to Fallback Mode:", err);
      
      // 3. Fallback to Local Demo Response (So it always works)
      setTimeout(() => {
        const fallbackReply = getDemoResponse(currentInput);
        setMessages((prev) => [...prev, { sender: "bot", text: fallbackReply }]);
      }, 800); // Slight delay to simulate thinking
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <span style={{ fontSize: '24px', marginTop: '2px' }}>💬</span>
        </button>
      )}

      {isOpen && (
        <div className="api-container">
          <div className="chat-header">
            <span>Chat Assistant</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-window" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-message bot typing-indicator">
                <span>•</span><span>•</span><span>•</span>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Ask me anything..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Api;