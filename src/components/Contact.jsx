import React from 'react';
import './Contact.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

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
  );
}

export default Contact;
