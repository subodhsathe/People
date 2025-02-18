
import React, { useState, useContext } from 'react';
import logo from "../img/logo.png";
import "../css/SignUp.css";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { LoginContext } from '../context/LoginContext';

export default function SignUp() {
    const { setUserLogin } = useContext(LoginContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);

    const postData = () => {
        if (!emailRegex.test(email)) {
            notifyA("Invalid Email");
            return;
        } else if (!passRegex.test(password)) {
            notifyA("Password must contain at least 8 characters, including at least 1 number and 1 uppercase letter and special characters like #,?,!");
            return;
        } else if (!bio) {  // Check for bio as well
            notifyA("Please fill out all fields");
            return;
        }

        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                userName,
                email,
                password,
                bio
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    notifyA(data.error);
                } else {
                    notifyB(data.message);
                    navigate("/signin");
                }
            });
    };

    const continueWithGoogle = (credentialResponse) => {
        const jwtDetail = jwtDecode(credentialResponse.credential);
        fetch("/googleLogin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: jwtDetail.name,
                userName: jwtDetail.sub,
                email: jwtDetail.email,
                email_verified: jwtDetail.email_verified,
                clientId: credentialResponse.clientId,
                Photo: jwtDetail.picture
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    notifyA(data.error);
                } else {
                    notifyB("Signed In Successfully");
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setUserLogin(true);
                    navigate("/");
                }
            });
    };

    return (
        <div className='signUp'>
            <div className="form-container">
                <div className="form">
                    <img className='signUpLogo' src={logo} alt="Logo" />
                    <h1 className='appName'>People</h1>
                    <p className='headPara'>
                        find PEOPLE and
                    </p>
                    <p className='headPara'>
                        share your creativity
                    </p>
                    <p className='headPara'>
                        with friends through
                    </p>
                    <p className='headPara'>
                        <b style={{fontFamily:"cursive"}}>AI Posts</b>
                    </p>
                    <div>
                        <input className='mainInputs' type="email" name="email" id='email' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <input className='mainInputs' type="text" name="name" id='name' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <input className='mainInputs' type="text" name="username" id='username' placeholder='Username' value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div>
                        <input className='mainInputs' type="password" name="password" id='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    
                    <div>
                        <textarea className='mainInputs' name="bio" id='bio' placeholder='Bio' value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                    <input type="submit" id='submit-btn' value="Sign Up" onClick={postData} />
                    <hr />
                    Already have an account? 
                    <Link to="/signin">
                        <span style={{ color: "blue", cursor: 'pointer' }}>Sign In</span>
                    </Link>
                    <br />
                    <b>People &copy; 2025</b> <br /> <b>Contact: </b>subodhssathe@gmail.com
                    <br />
                    a <b>Subodh Sachin Sathe</b> creation
                </div>
            </div>
        </div>
    );
}

