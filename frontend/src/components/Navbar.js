import React,{useContext} from 'react';
import logo from "../img/logo.png";
import "../css/Navbar.css";
import { Link } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({login}) {
  const navigate = useNavigate();
  const {setModalOpen} = useContext(LoginContext);

  const loginStatus = ()=>{
    const token = localStorage.getItem("jwt")
    if(login || token){
      return [
        <>
        <Link style={{marginRight:"20px"}} to="/draw"><span className="material-symbols-outlined">brush</span></Link>
        <Link style={{marginRight:"20px"}} to="/explore">Explore</Link>
        <Link style={{marginRight:"20px"}} to="/search">Search Users</Link>
        <Link style={{marginRight:"20px"}} to="/createPost">Create Post</Link>
        <Link style={{marginRight:"20px"}} to="profile"><li>Profile</li></Link>
        <Link style={{marginRight:"20px"}} to="/followingpost">My Following</Link>
        <Link style={{marginRight:"20px"}} to="/chatpage">Chat</Link>
        <Link to={""}>
          <button className='primaryBtn' onClick={()=> setModalOpen(true)}>
            Log Out
          </button>
        </Link>
        </>
      ]
    }else{
      return [
        <>
        <Link to="signup">
            <li>SignUp</li>
        </Link>
        <Link to="signin">
            <li>SignIn</li>
        </Link>
        </>
      ]
    }
  };
  const loginStatusMobile =()=>{
      const token = localStorage.getItem("jwt")
      if(login || token){
        return [
          <>
          <Link to="/">
              <li><span class="material-symbols-outlined">
                cottage
                </span></li>
          </Link>
          <Link to="/explore">
            <li>
              <span class="material-symbols-outlined">travel_explore</span>
            </li>
          </Link>
          <Link to="/createPost">
            <li><span class="material-symbols-outlined">photo_camera</span></li>
          </Link>
          
          <Link to="/profile">
              <li><span class="material-symbols-outlined">account_circle</span></li>
          </Link>

          <Link to="/followingpost">
            <li>
              <span class="material-symbols-outlined">group</span>
            </li>
          </Link>

          <Link to="/chatpage">
              <li><span id='sendIcon' class="material-symbols-outlined">send</span></li>
          </Link>

          </>
        ]
      }else{
        return [
          <>
          <Link to="signup">
              <li>SignUp</li>
          </Link>
          <Link to="signin">
              <li>SignIn</li>
          </Link>
          </>
        ]
      
    };
  }
  
  return (
  <div className="navbar">
    <img id='linkalikes-logo' src={logo} alt="" onClick={()=>{navigate("/")}} style={{cursor:"pointer"}} />
    <ul className='nav-menu'>{loginStatus()}</ul>
    <ul className='nav-mobile'>{loginStatusMobile()}</ul>
  </div>
  );
}
