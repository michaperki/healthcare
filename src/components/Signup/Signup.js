import React, { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../firebase/config";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error);
            // ..
        });
    };
    
    return (
        <div>
        <h1>Signup</h1>
        <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
        </div>
    );
};

export default Signup;
