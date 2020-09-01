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
                console.log("RESULT: ", data);
                storeToken(data);
                history.push('/todo-list');
            })
            .catch(error => console.log("ERROR: ", error));

        /*let result = await res.text();
        console.log("result", result);
        storeToken(result);
        history.push('/todo-list')
        console.log(result.toString());*/
        
    }

    const storeToken = function(jwtToken) {
        console.log("jwtToken: ", jwtToken);
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
                HATALI KULLANICI ADI VEYA PAROLA
           </p>
        </div>

        <div className="form-group">
            <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
            </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">Submit</button>
        <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
        </p>
    </form>
    )
}

export default Login