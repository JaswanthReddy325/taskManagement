// frontend/src/components/PostForm.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const PostForm = ({ onPostCreated }) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!image) {
            setError("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        try {
            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );

            const imageUrl = cloudinaryResponse.data.secure_url;

            await axios.post('/api/posts', { imageUrl, caption, userId: user._id }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCaption('');
            setImage(null);
            if (onPostCreated) {
                onPostCreated(); // Callback to parent to refresh the feed
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error creating post.")
            console.error("Error creating post:", err);
        }
    };

    return (
        <div>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <textarea
                    placeholder="Caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default PostForm;