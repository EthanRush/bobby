import React, { useState } from 'react';

const PasswordOverlay = ({ correctPassword }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password, please try again.');
    }
  };

  if (isAuthenticated) {
    return null; // When authenticated, do not render the overlay
  }

  return (
    <div className="overlay">
      <form className="password-form" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PasswordOverlay;
