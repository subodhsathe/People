
import React,{useEffect, useState} from 'react'
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';

export default function Home() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/1177/1177568.png"
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);
  let limit = 10
  let skip = 0

  // Toast Functions
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  useEffect(() =>{ 
    const token = localStorage.getItem("jwt");
    if(!token){
      navigate("./signup")
    }
fetchPosts()

window.addEventListener("scroll",handleScroll)
return ()=>{
  window.removeEventListener("scroll",handleScroll)
}
    
  }, []);

  const fetchPosts = () =>{
    // Fetching all posts
    fetch(`/allposts?limit=${limit}&skip=${skip}`,{
      headers:{
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData((data)=>[...data, ...result]);
      })
      .catch((err) => console.log(err));
  }

  const handleScroll = () =>{
    if(document.documentElement.clientHeight + window.pageYOffset >= document.documentElement.scrollHeight){
      skip = skip + 10
      fetchPosts()
    }
  }

  // show and hide comments
  const toggleComment = (posts)=>{
    if(show){
      setShow(false);
    }else{
      setShow(true);
      setItem(posts);
      
    }
  }


  const likePost = (id) =>{
    fetch("/like",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then((result)=>{
      const newData = data.map((posts)=>{
        if(posts._id === result._id){
          return result
        }else{
          return posts
        }
      })
      setData(newData)
      console.log(result)
    })
  }
  const unlikePost = (id) =>{
    fetch("/unlike",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then((result)=>{
      const newData = data.map((posts)=>{
        if(posts._id === result._id){
          return result
        }else{
          return posts
        }
      })
      setData(newData);
      console.log(result);
    })
  };

  // function to make comment
  const makeComment = (text,id) =>{
    fetch("/comment",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        text:text,
        postId:id,
      }),
    })
      .then(res=>res.json())
      .then((result)=>{
        const newData = data.map((posts)=>{
          if(posts._id === result._id){
            return result
          }else{
            return posts
          }
        })
        setData(newData);
        setComment("");
        notifyB("Comment Posted");
        console.log(result);
      });
  };

  return (
    <div className='home'>
      <TopNavbar />
      <br />
      <br />
          {/* card */}
          {data.map((posts) => {
            return (
              <div className="card">
                {/* card-header */}
                <div className="card-header">
                  <div className="card-pic">
                    <img src={posts.postedBy.Photo? posts.postedBy.Photo : picLink} alt="" />
                  </div>
                  <h5>
                    <Link to={`/profile/${posts.postedBy._id}`}>
                      {posts.postedBy.name}
                    </Link>
                  </h5>
                </div>
                {/* card image */}
                <div className="card-image">
                  <img src={posts.photo} alt="" />
                </div>

                {/* card-content */}
                <div className="card-content">
                  {
                    posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id)
                    ?
                    (<span id='material-symbols-outlined-red' className="material-symbols-outlined" onClick={() => { unlikePost(posts._id) }}>favorite</span>)
                    :(<span className="material-symbols-outlined" onClick={() => { likePost(posts._id) }}>favorite</span>)
                  }
                  
                  

                  <p>{posts.likes.length} Likes</p>
                  <p>{posts.body} </p>
                  <p style={{fontWeight:"bold", cursor:"pointer"}} onClick={()=>{
                    toggleComment(posts);
                  }} >View all comments</p>
                </div>

                {/* add-comment */}
                <div style={{marginBottom:"60px"}} className="add-comment">
                <span className="material-symbols-outlined">sentiment_satisfied</span>
                <input type="text" placeholder='Add a comment' value={comment} onChange={(e)=>{setComment(e.target.value)}} />
                <button 
                  className='comment' 
                  onClick={()=>{
                    makeComment(comment,posts._id);
                  }}
                >
                  Post
                </button>
                </div>
          </div>
        )
      })}

      {/* show Comment */}
      {show && (
      <div className="showComment">
        <div className="container">
          <div className="postPic">
            <img src={item.photo} alt="" />
          </div>
          <div className="details">

            {/* card-header */}
            <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                <div className="card-pic">
                    <img 
                      src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="" 
                    />
                </div>
                <h5>{item.postedBy.name}</h5>
            </div>

            {/* commentSection */}
            <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
              {
              item.comments.map((comment)=>{

              return (<p className="comm">
                <span className="commenter" style={{fontWeight:"bolder"}}>{comment.postedBy.name} {" "}</span>
                <span className="commentText">{comment.comment}</span>
              </p>)
              })}
            </div>

            {/* card-content */}
            <div className="card-content">
              <p>{item.likes.length} Likes</p>
              <p>{item.body}</p>
            </div>

            {/* add-comment */}
            <div className="add-comment">
                <span className="material-symbols-outlined">sentiment_satisfied</span>
                <input type="text" placeholder='Add a comment' value={comment} onChange={(e)=>{setComment(e.target.value)}} />
                <button 
                  className='comment' 
                  onClick={()=>{
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
                </div>
          </div>
        </div>
        <div 
          className="close-comment" 
          onClick={()=>{
            toggleComment();
          }}
        >
          <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
        </div>
      </div>)
      }
    </div>
  );
}
