import React from 'react';
import './Contact.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Message from './Message'; // Import the Message Form

function Contact() {
  const contacts = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      info: 'alessandranixxx@gmail.com'
    },
    {
      icon: <FaPhone />,
      title: 'Phone',
      info: '+63 912 345 6789'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      info: 'Plaridel, Bulacan'
    }
  ];

  return (
    <section className="contact-section-wrapper">
      {/* 1. Main Title */}
      <h2 className="contact-main-title">Contact Me</h2>

      {/* 2. Contact Info Cards */}
      <div className="contact-container">
        {contacts.map((contact, index) => (
          <div className="contact-card" key={index}>
            <div className="contact-icon">{contact.icon}</div>
            <div className="contact-info">
              <h3>{contact.title}</h3>
              <p>{contact.info}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Message Form Section */}
      <div className="message-section">
        <h3 className="message-title">Send me a message</h3>
        <Message />
      </div>
    </section>
  );
}

export default Contact;