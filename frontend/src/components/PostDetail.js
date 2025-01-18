
import React from 'react';
import "../css/PostDetail.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PostDetail({ item, toggleDetails, hideDelete = false }) {
    const navigate = useNavigate();

    // Toast Functions
    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)

    const removePost = (postId)=>{
        if(window.confirm("Do you really want to delete this post ?")){
            fetch(`/deletePost/${postId}`,{
                method:"delete",
                headers:{
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then((res)=>res.json())
            .then((result)=>{
                console.log(result);
                toggleDetails();
                navigate("/");
                notifyB(result.message)
            });
        }
    };

    return (
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
                        <h5 onClick={() => navigate(`/profile/${item.postedBy._id}`)} >{item.postedBy.name}</h5>
                        {!hideDelete && (
                            <div className="deletePost" onClick={()=>{removePost(item._id)}}>
                                <span className="material-symbols-outlined">delete</span>
                            </div>
                        )}
                    </div>

                    {/* commentSection */}
                    <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                        {
                            item.comments.map((comment) => {

                                return (<p className="comm">
                                    <span className="commenter" style={{ fontWeight: "bolder" }}>{comment.postedBy.name} {" "}</span>
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
                        <input 
                            type="text" 
                            placeholder='Add a comment' 
                        />
                        <button
                            className='comment'
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
            <div
                className="close-comment"
                onClick={() => {
                    toggleDetails();
                }}
            >
                <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
            </div>
        </div>
    )
}
