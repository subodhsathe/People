
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../css/SearchPage.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [query]);

  const fetchUsers = () => {
    const queryString = new URLSearchParams({query}).toString();
    fetch(`/search?${queryString}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        setUsers(result);
      })
      .catch((err) => {
        console.log("Fetch error: ", err);
      });
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className='search-page'>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search by username" 
          value={query} 
          onChange={handleInputChange} 
          className="search-input"
        />
      </div>
      <div className="suggestions-container">
        {users.map((user) => (
          <div 
            key={user._id} 
            className="suggestion" 
            onClick={() => handleUserClick(user._id)}
          >
            <img src={user.Photo ? user.Photo : "https://cdn-icons-png.flaticon.com/128/1177/1177568.png"} alt="" />
            <div className="user-info">
              <h5>{user.name}</h5>
              <p>{user.userName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
