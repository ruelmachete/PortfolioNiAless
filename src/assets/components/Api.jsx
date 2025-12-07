import React, { useState, useEffect, useRef } from "react";
import "./Api.css";
import { sanitizeHtml, stripHtml } from "../../utils/htmlFilter";

function Api() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef(null);

  const CHATBOT_ENDPOINT = "https://jonn8n.safehub-lcup.uk/webhook/chatbot";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const extractReply = (p) => {
    if (p === null || p === undefined) return "";
    if (typeof p === "string") {
      const t = p.trim();
      const looksLikeJson = t.startsWith("{") || t.startsWith("[");
      if (looksLikeJson) {
        try {
          const maybe = JSON.parse(t);
          return extractReply(maybe);
        } catch {
          return p;
        }
      }
      return p;
    }
    if (Array.isArray(p)) {
      if (p.length === 0) return "";
      return extractReply(p[0]);
    }
    if (typeof p === "object") {
      const keys = [
        "reply",
        "message",
        "text",
        "output",
        "data",
        "result",
        "response",
      ];
      for (const k of keys) {
        if (p[k] !== undefined && p[k] !== null) {
          return extractReply(p[k]);
        }
      }
      if (p.choices && Array.isArray(p.choices) && p.choices[0]) {
        const c = p.choices[0];
        return extractReply(c.text ?? c.message ?? c);
      }
      if (p.messages && Array.isArray(p.messages) && p.messages[0]) {
        return extractReply(p.messages[0].text ?? p.messages[0]);
      }
      for (const k of Object.keys(p)) {
        if (typeof p[k] === "string" && p[k].trim()) return p[k];
      }
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    }
    return String(p);
  };

  const stripCodeFences = (s) => {
    let t = String(s ?? "").trim();
    const blockFence = /^```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)\s*```$/;
    const m = t.match(blockFence);
    if (m) t = m[1];
    t = t.replace(/```/g, "");
    return t.trim();
  };

  const htmlToPlainText = (html) => {
    if (!html) return "";
    const noFences = stripCodeFences(html);

    return stripHtml(noFences);
  };

  const callChatbot = async (userText) => {
    try {
      const res = await fetch(CHATBOT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        return data;
      }
      const text = await res.text();
      return text || "No response from chatbot.";
    } catch (err) {
      return "Sorry, I could not reach the chatbot API.";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const raw = await callChatbot(input);
    const extracted = extractReply(raw) || "No reply content";
    const finalText = htmlToPlainText(extracted);
    const botMsg = { sender: "bot", text: finalText };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="chat-widget">
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {isOpen && (
        <div className="api-container">
          <div className="chat-header" onClick={() => setIsOpen(false)}>
            Chat Assistant <span style={{ cursor: "pointer" }}>✕</span>
          </div>

          <div className="chat-window" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chat-message bot">Typing...</div>}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Ask me anything... (e.g. weather in Cebu, define love)"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Api;
