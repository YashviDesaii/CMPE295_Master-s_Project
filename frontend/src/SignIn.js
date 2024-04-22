import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './SignIn.css'; // Import the CSS file for styling

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    // Here, you would typically handle authentication, such as sending a request to a backend API
    // For simplicity, this example just logs the username and password to the console
    console.log('Username:', username);
    console.log('Password:', password);
    setLoggedIn(true); // Simulating successful login
  };

  if (loggedIn) {
    // Redirect to a different page after successful login
    return <Navigate to="/home" />;
  }

  return (
    <div className="signin-container">
        <section className="welcome-banner">
            <h1>Combat Human Trafficking</h1>
            <p>If you see something, say something.</p>
         </section>
      <h1 style={{textAlign:'center'}}>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="submit-button">Sign In</button>
      </form>
      <p style={{textAlign:'center'}}>Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
    </div>
  );
}

export default SignIn;
