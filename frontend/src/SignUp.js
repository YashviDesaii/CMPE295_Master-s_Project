import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './SignUp.css'; // Import the CSS file for styling

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    // Here, you would typically handle form validation and user creation
    // For simplicity, this example just logs the form data to the console
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Badge Number:', badgeNumber);
    setSignedUp(true); // Simulating successful sign-up
  };

  if (signedUp) {
    // Redirect to a different page after successful sign-up
    return <Navigate to="/home" />;
  }

  return (
    <div className="signup-container">
      <section className="welcome-banner">
        <h1>Combat Human Trafficking</h1>
          <h4 style={{textAlign:'center'}}>Take a step further in fighting human trafficking. </h4>
        </section>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="input-field"
        />
        <br />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="input-field"
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <br />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="input-field"
        />
        <br />
        <input
          type="text"
          placeholder="Badge Number"
          value={badgeNumber}
          onChange={(e) => setBadgeNumber(e.target.value)}
          required
          className="input-field"
        />
        <br />
        <button type="submit" className="submit-button">Register</button>
      </form>
      <p style={{textAlign:'center'}}>Already have an account? <Link to="/">Sign In</Link></p>
    </div>
  );
}

export default SignUp;
