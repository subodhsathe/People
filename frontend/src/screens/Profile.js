
import React,{useState, useEffect, useContext} from 'react';
import "../css/Profile.css";
import PostDetail from '../components/PostDetail';
import ProfilePic from '../components/ProfilePic';
import { toast } from 'react-toastify';
import { LoginContext } from '../context/LoginContext';


export default function Profile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/1177/1177568.png"
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [changePic, setChangePic] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const {setModalOpen} = useContext(LoginContext);


  const toggleDetails = (posts)=>{
    if(show){
      setShow(false);
    }else{
      setShow(true);
      setPosts(posts);
    }
  };

  const changeprofile = () =>{
    if (changePic) {
      setChangePic(false)
    } else {
      setChangePic(true)
    }
  }

  const startEditing = () => {
    setNewBio(user.bio || "");
    setIsEditing(true);
  }

  const cancelEditing = () => {
    setIsEditing(false);
  }

  const saveProfile = () => {
    if (!newBio) {
        toast.error("Bio field cannot be empty");
        return;
    }

    fetch(`/user/${user._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            bio: newBio
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Failed to update profile');
        }
        return res.json();
    })
    .then(result => {
        if (result.error) {
            toast.error(result.error);
        } else {
            setUser(result.user);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        }
    })
    .catch(error => {
        toast.error(error.message);
        console.error(error);
    });
  };


  useEffect(() => {
    fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
      headers:{
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res=>res.json())
      .then((result) => {
        console.log(result)
        setPic(result.posts);
        setUser(result.user)
        console.log(pic);
      })
  }, []);

  const formatBio = (bio) =>{
    return { __html: bio ? bio.replace(/\n/g, '<br />') : '' };
  };

  return (
    <div className='profile'>
      {/* Profile-frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
        <img 
          onClick={changeprofile}
          src={user?.Photo ? user.Photo : picLink}
          alt="" 
        />
        </div>
        {/* profile-data */}
        <div className="profile-data">
          <button id='logout_btn' onClick={()=> setModalOpen(true)}><span class="material-symbols-outlined">directions_walk</span></button>
          <h1>{user.name}</h1>
          {isEditing ? (
            <>
              <textarea
                id='editBioTextArea'
                className='mainInputs'
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <button id='editProfileSaveBtn' onClick={saveProfile}>Save</button>
              <button id='editProfileCancleBtn' onClick={cancelEditing}>Cancel</button>
            </>
          ) : (
            <>
              <p dangerouslySetInnerHTML={formatBio(user?.bio)}></p>
              <button id='editProfileBtn' onClick={startEditing}>Edit Profile</button>
            </>
          )}
          <div className="profile-info" style={{display:"flex"}}>
            <p>{pic? pic.length : "0"} posts</p>
            <p>{user.followers? user.followers.length : "0"} followers</p>
            <p>{user.following? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{
        width:"90%",
        
        opacity: "0.8",
        margin:"25px auto"
      }} 
      />
      {/* Gallery */}
      <div className="gallery">
        {pic.map((pics)=>{
          return <img key={pics._id} src={pics.photo} 
          onClick={()=>{
            toggleDetails(pics)
          }}
          className='item' />
        })}
      </div>
      {show && 
        <PostDetail item={posts} toggleDetails={toggleDetails} />
      }
      {
        changePic && 
        <ProfilePic changeprofile={changeprofile}/>
      }
    </div>
  );
}
