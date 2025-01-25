/*import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from '@cloudinary/react';
import AuthContext from '../context/AuthContext';
import { useAnimation, motion } from 'framer-motion';

// Initialize Cloudinary outside the component
const cld = new Cloudinary({
    cloud: {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    },
});

function Feed() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ caption: "", image: null });
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const postAnimation = useAnimation();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/posts', { // Corrected path, assuming proxy setup
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setPosts(res.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            if (error.response) {
                console.error("Server responded with status code:", error.response.status);
                console.error("Response data:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up the request:", error.message);
            }
            setUploadError("Error fetching posts. Please check the backend."); // User-friendly message
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if (!newPost.image) {
            alert("Please select an image");
            return;
        }

        setLoading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', newPost.image);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        try {
            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            if (cloudinaryResponse.status !== 200) {
                throw new Error(`Cloudinary upload failed with status ${cloudinaryResponse.status}`);
            }

            const imageUrl = cloudinaryResponse.data.secure_url;
            const postData = { imageUrl, caption: newPost.caption, userId: user.id };

            const postResponse = await axios.post('/api/posts', postData, { // Corrected path
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (postResponse.status !== 200 && postResponse.status !== 201) {
                throw new Error(`Post creation failed with status ${postResponse.status}`);
            }

            setNewPost({ caption: "", image: null });
            fetchPosts();
            postAnimation.start('postSubmitted');
        } catch (error) {
            console.error('Error uploading image/posting:', error);
            setUploadError("An error occurred. Please try again.");
            if (error.response) {
                console.error("Server responded with status code:", error.response.status);
                console.error("Response data:", error.response.data);
                if (error.response.status === 404) {
                    setUploadError("Backend API endpoint not found. Check your backend configuration.");
                } else if (error.response.status === 401) {
                  setUploadError("Unauthorized. Please check your token or login status.")
                }
            } else if (error.request) {
                console.error("No response received:", error.request);
                setUploadError("No response from the server. Check if the backend is running.");
            } else {
                console.error("Error setting up the request:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Feed</h1>
            {uploadError && <div style={{ color: 'red' }}>{uploadError}</div>}
            <form onSubmit={handlePostSubmit}>
                <input type="file" onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })} />
                <textarea value={newPost.caption} onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })} />
                <button type="submit" disabled={loading}>Post</button>
            </form>
            <div className="post-container">
                {posts.map((post) => (
                    <motion.div
                        key={post._id}
                        className="post"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AdvancedImage cldImg={cld.image(post.imageUrl)} width="300" />
                        <p>{post.caption}</p>
                        {post.user && <p>Posted by: {post.user.name}</p>}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Feed; */
import React, { useState,useEffect  } from 'react';
import './Feed.css'; // Import your CSS file


function Feed() {
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]); // Store uploaded images
    const [submitted, setSubmitted] = useState(false);

    

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;
    const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  
    // Fetch uploaded images on component mount
    useEffect(() => {
      fetchUploadedImages();
    }, []);

    const fetchUploadedImages = async () => {
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`,
                {
                  headers: {
                    Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
                  },
                }
              );
          if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
          }
          
          const data = await response.json();
          console.log(data);
          setUploadedImages(data.resources);
        } catch (error) {
          console.error('Error fetching images:', error);
          setError("Failed to load uploaded images.");
        }
      };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh
    setSubmitted(true); // Set submitted to true to trigger animation
    setLoading(true);
    setError(null);
  
    if (!imageFile) {
      setError("Please select an image.");
      setLoading(false);
      setSubmitted(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);
    // **Corrected line:**
    formData.append('api_key', apiKey); // Use apiKey for authentication, not cloud_name
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData?.error?.message || response.statusText}`);
      }
  
      const data = await response.json();
      setImageUrl(data.url);
      setDescription("");
      setImageFile(null);
    } catch (err) {
      console.error('Error uploading:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setSubmitted(false);
    }
  };

  return (
    <div className={`feed-container ${submitted ? 'submitted' : ''}`}>
      <h1>Image Uploader</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter a description"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="image">Select Image:</label>
          <input type="file" id="image" onChange={handleImageChange} accept="image/*" required/>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className={loading?"loading-button":""}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {imageUrl && (
        <div className="image-preview">
          <h2>Uploaded Image:</h2>
          <img src={imageUrl} alt={description} />
          <p>{description}</p>
        </div>
      )}

       {/* Display uploaded images */}
       <div className="uploaded-images-container">
        <h2>Previously Uploaded Images</h2>
        <div className="image-grid">
          {uploadedImages.length === 0 && !error && !loading && <p>No images uploaded yet.</p>}
          {error && <p className="error-message">{error}</p>}
          {uploadedImages.map((image) => (
            <div key={image.asset_id} className="image-item">
              <img src={image.secure_url} alt={image.public_id} />
              {/* You can display other image metadata here if needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;