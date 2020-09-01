import React, { useState } from "react";
import { useHistory  } from 'react-router-dom';

function SignUp() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let history = useHistory();

    const handleSubmit = async function(e) {
        e.preventDefault();
        //alert(`Submitting Name ${username} - ${password}`)
        try {
            let res = await fetch("http://localhost:8080/user/sign-up", {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });

        let result = await res.json();
        history.push('/sign-in');
        } catch(e) {
            console.error(e);
        }
    }

    return(
        <form onSubmit={handleSubmit}>
        <h3>Sign Up</h3>

        <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Enter username"  onChange={event => setUsername(event.target.value)} />
        </div>

        <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter password"  onChange={event => setPassword(event.target.value)} />
        </div>

        <button type="submit" className="btn btn-primary btn-block" >Sign Up</button>
        <p className="forgot-password text-right">
            Already registered <a href="#">sign in?</a>
        </p>
    </form>
    )
}

export default SignUp