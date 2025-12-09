import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Message.css"; 

export default function Message() {
  const form = useRef();
  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs.sendForm(
      "service_hekf9bd",    // Your EmailJS Service ID
      "template_itkgvbs",   // Your EmailJS Template ID
      form.current,
      "sHjMr007GPb597gwD"   // Your EmailJS Public Key
    )
    .then(() => {
      setStatus("Message sent successfully!");
      form.current.reset();
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      setStatus("Failed to send message.");
    });
  };

  return (
    <div className="message-container">
      <form ref={form} onSubmit={sendEmail}>
        <input type="text" name="from_name" placeholder="Your Name" required />
        <input type="email" name="from_email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" required rows="5" />
        <button type="submit">Send Message</button>
      </form>
      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}