import React, { useState } from "react";
import { useHistory  } from 'react-router-dom';

function SignUp() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let history = useHistory();

    console.log("username: ", username);

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
        console.log(result);
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


/*export default class SignUp extends Component {

    const [credentials, setCredentials] = useState({
        username: null,
        password: null
    });

   

    async componentDidMount() {
        try {
            let res = await fetch("http://localhost:8080/user/sign-up", {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "username": "foo",
                "password": "bar"
            })
        });

        let result = await res.json();
        console.log(result);
        } catch(e) {
            console.error(e);
        }
    };

    render() {
        return(
            <form>
            <h3>Sign Up</h3>

            <div className="form-group">
                <label>First name</label>
                <input type="text" className="form-control" placeholder="First name" />
            </div>

            <div className="form-group">
                <label>Last name</label>
                <input type="text" className="form-control" placeholder="Last name" />
            </div>

            <div className="form-group">
                <label>Email address</label>
                <input type="email" className="form-control" placeholder="Enter email" />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" />
            </div>

            <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            <p className="forgot-password text-right">
                Already registered <a href="#">sign in?</a>
            </p>
        </form>
        )
    }
}*/