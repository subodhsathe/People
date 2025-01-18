import React,{useState,useContext} from 'react';
import "../css/SignIn.css";
import logo from "../img/logo.png"
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginContext } from '../context/LoginContext';

export default function SignIn() {
  const {setUserLogin}=useContext(LoginContext)
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

// Toast Functions
const notifyA = (msg) => toast.error(msg)
const notifyB = (msg) => toast.success(msg)

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const postData = () => {
    // checking email
    if (!emailRegex.test(email)){
        notifyA("Invalid Email")
        return
    }
    // Sending data to server
    fetch("/signin",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email:email,
            password:password

        })
    }).then(res=>res.json())
      .then(data =>{
        if(data.error){
            notifyA(data.error)
        }else{
            notifyB("Signed In Successfully")
            console.log(data)
            localStorage.setItem("jwt",data.token)
            localStorage.setItem("user",JSON.stringify(data.user) )

            setUserLogin(true)
            navigate("/")
        }
        console.log(data)
    })
  }

  return (
  <div className='signIn'>
    <div>
      <div className="loginForm">
        <img className='signUpLogo' src={logo} alt="" />
        <h1 className='appNameLogin'>People</h1>
        <p className='headParaLogin'>
            find
        </p>
        <p className='headParaLogin'>
            PEOPLE
        </p>
        <p className='headParaLogin'>
            and make friends
        </p>
        <p className='headParaLogin'>
            interact, love, connect..
        </p>
        <div>
          <input className='mainInputsLogin' type="email" name="email" id='email' value={email} placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
        </div>
        <div>
        <input 
          type="password" 
          name="password" 
          id='password' 
          placeholder='Password'
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
          className='mainInputsLogin'
        />
        </div>
        <input type="submit" id='login-btn' onClick={()=>{ postData() }} value="Sign In" />
        <hr />
        Don't have an account ?
        <Link to="/signup">
          <span style={{color:'blue', cursor:'pointer'}}>Sign Up</span>
        </Link>
        <br />
        <b>People &copy; 2025</b> <br /> <b>Contact: </b>subodhssathe@gmail.com
        <br />
        a <b>Subodh Sachin Sathe</b> production
      </div>
    </div>
  </div>
  );
}
