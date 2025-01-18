import React, { useState, useEffect } from 'react';
import "../css/ExplorePage.css";
import { useNavigate } from 'react-router-dom';
import PostDetail from '../components/PostDetail';

export default function ExplorePage() {
    const [posts, setPosts] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();


    const handleSearchClick = () => {
        navigate("/search");
    };

    useEffect(() => {
        // Fetch all posts
        fetch('/allposts', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => setPosts(data));
    }, []);

    const toggleDetails = (post) => {
        if (showDetail) {
            setShowDetail(false);
            setSelectedPost(null);
        } else {
            setShowDetail(true);
            setSelectedPost(post);
        }
    };

    return (
        <div className="search-page">
            <button style={{marginBottom:"10px"}} onClick={handleSearchClick} className="search-button"><span class="material-symbols-outlined">search</span> Search</button>
            <div className="post-grid">
                {posts.map(post => (
                    <img 
                        key={post._id} 
                        src={post.photo} 
                        alt={post.body} 
                        className="post-item"
                        onClick={() => toggleDetails(post)}
                    />
                ))}
            </div>
            {showDetail && selectedPost && (
                <PostDetail 
                    item={selectedPost} 
                    toggleDetails={toggleDetails} 
                    hideDelete={true} 
                />
            )}
        </div>
    );
}

