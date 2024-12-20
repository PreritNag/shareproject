import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    balance: '',
    termsAccepted: false,
    privacyPolicy: false,
  });



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted || !formData.privacyPolicy) {
      alert('Please accept the terms and privacy policy.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/Signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Signup successful!');
      } else {
        const error = await response.json();
        alert(error.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Unable to sign up. Please try again later.');
    }
  };

  return (
    <div className="container">
      <div className="signIn-container">
        <h1 className="signup-header">Sign Up</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input name1"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            className="input phone-number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="balance"
            placeholder="Initial Balance"
            className="input balance"
            value={formData.balance}
            onChange={handleChange}
            required
            min="0"
          />
          <div className="checkbox-group">
            <input
              type="checkbox"
              name="termsAccepted"
              id="terms"
              className="checkbox"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
            <label htmlFor="terms" className='label1'>I accept all terms and conditions</label>
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              name="privacyPolicy"
              id="privacy"
              className="checkbox"
              checked={formData.privacyPolicy}
              onChange={handleChange}
              required
            />
            <label htmlFor="privacy" className='label2'>I have read and understood the Privacy Policy</label>
          </div>
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
