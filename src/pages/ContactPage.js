import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "components/button";
import Layout from "components/layout/Layout";

const ContactPageStyles = styled.div`
  .contact-banner {
    background-image: linear-gradient(
      to right bottom,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary}
    );
    padding: 60px 0;
    text-align: center;
    color: white;
    margin-bottom: 60px;
  }

  .contact-banner h1 {
    font-size: 48px;
    font-weight: bold;
  }

  .contact-form {
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 50px; // ^^
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  label {
    margin-bottom: 8px;
    font-weight: 500;
  }

  input,
  textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
  }

  textarea {
    resize: none;
    height: 120px;
  }

  .submit-btn {
    display: flex;
    justify-content: center;
  }
`;

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <ContactPageStyles>
    <Layout></Layout>
      <div className="contact-banner">
        <h1>Contact Us</h1>
      </div>

      <div className="container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên của bạn</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nhập tên của bạn"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Nội dung</label>
            <textarea
              id="message"
              name="message"
              placeholder="Bạn muốn gửi điều gì?"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="submit-btn">
            <Button type="submit" kind="secondary">
              Gửi liên hệ
            </Button>
          </div>
        </form>
      </div>
    </ContactPageStyles>
  );
};

export default ContactPage;
