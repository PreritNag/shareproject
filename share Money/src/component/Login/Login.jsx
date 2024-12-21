import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/user/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Ensures cookies are sent with the request
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Login successful!');
      } else {
        const error = await response.json();
        alert(error.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Unable to log in. Please try again later.');
    }
  };

  return (
    <div className="containerLogin">
      <div className="login-containerLogin">
        <h1 className="login-headerLogin">Log In</h1>
        <form className="formLogin" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="inputLogin nameLogin"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="inputLogin passwordLogin"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-buttonLogin">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
