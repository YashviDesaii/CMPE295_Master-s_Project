import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './SignIn.css'; 
import { db } from './firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const usersRef = collection(db, 'user'); 
    const q = query(usersRef, where("username", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      let userFound = false;
      querySnapshot.forEach((doc) => {
        if (doc.data().password === password) {
          console.log('Login successful:', doc.data());
          setLoggedIn(true);
          userFound = true;
        }
      });
      if (!userFound) {
        setError('Invalid username or password'); 
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  if (loggedIn) {
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
        {error && <p className="error">{error}</p>}
        <br />
        <button type="submit" className="submit-button">Sign In</button>
      </form>
      <p style={{textAlign:'center'}}><Link to="/sign-up">Sign Up</Link></p>
    </div>
  );
}

export default SignIn;
