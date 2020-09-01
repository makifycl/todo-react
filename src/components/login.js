import React, { useState } from "react";
import { useHistory  } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);
    let history = useHistory();

    let requestOptions = {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }

    const handleSubmit = async function(e) {
        e.preventDefault();
        //alert(`Submitting Name ${username} - ${password}`)
       
        await fetch("http://localhost:8080/user/sign-in", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    setLoginError(true);
                    throw new Error("ERROR");
                }
            })
            .then(data => {
                storeToken(data);
                history.push('/todo-list');
            })
            .catch(error => console.log("ERROR: ", error));
        
    }

    const storeToken = function(jwtToken) {
        localStorage.setItem("token", jwtToken);
    }

    return (
        <form onSubmit={handleSubmit}>
        <h3>Sign In</h3>

        <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Enter username" onChange={event => setUsername(event.target.value)}/>
        </div>

        <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter password" onChange={event => setPassword(event.target.value)}/>
        </div>

        <div>
           <p style= {{ visibility: loginError ? 'visible':'hidden' }}>
                INCORRECT USERNAME OR PASSWORD
           </p>
        </div>

        <button type="submit" className="btn btn-primary btn-block">Submit</button>
        
    </form>
    )
}

export default Login