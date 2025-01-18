
import React, { useState, useEffect } from "react";
import "../css/CreativePostsByAI.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreativePostsByAI() {

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  const durationOptions = [
    { value: "12h", label: "12 Hours" },
    { value: "24h", label: "24 Hours" },
    { value: "permanent", label: "Permanent" },
  ];

  return (
    <div className="createPost">
      {/* Header */}
      <p><b>Note: This feature is not yet ready due to lack of OpenAI API Key, It will be implemented later..</b></p>
      <div className="post-header">
        <h1 id="heading">Post AI Pic</h1>
        
      </div>
      <p id="head-para">Share your creativity with your friends..</p>
      <hr />
      <button id="post-btn">
        Share
      </button>

      {/* Post Duration Dropdown */}
      <div className="duration-select">
        <h3 id="select-para">Select for how long do you want your post to be posted</h3>
        <select id="duration-select">
          {durationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* AI Image Generator */}
      <div className="ai-generator">
        <input
          type="text"
          placeholder="Enter AI Image Prompt"
        />
        <button>Generate Image</button>
      </div>

      {/* Image Preview */}
      <div className="main-div">
        <img
          id="output"
          src={
            "https://cdn.icon-icons.com/icons2/510/PNG/512/image_icon-icons.com_50366.png"
          }
          alt="Preview"
        />
        <input
          type="file"
          accept="image/*"
        />
      </div>

      {/* Post Details */}
      <div className="details">
        <div style={{marginBottom:"50px"}} className="card-header">
          <div className="card-pic">
            <img
              src="https://cdn-icons-png.flaticon.com/128/1177/1177568.png"
              alt="Profile"
            />
          </div>
          <h5>You</h5>
          <textarea style={{marginBottom:""}}
          placeholder="Write a caption..."
          />
        </div>
      </div>

      
    </div>
  );
}
