import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send user data to the backend
      await axios.post('http://localhost:3001/api/users', {
        uid: user.uid,
        email: user.email,
        password: password,
      });

      console.log('Signup successful');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('The email address is already in use by another account.');
      } else {
        setError('Signup error: ' + error.message);
      }
      console.error('Signup error', error);
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignup}>Signup</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signup;