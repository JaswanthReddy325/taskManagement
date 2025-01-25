/*import React,{useState} from "react";
import { useHistory } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Home = ({ onTaskCreate }) => {
  const history = useHistory();
  const user = auth.currentUser; 
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() === '') {
            alert('Task title is required.');
            return;
        }
        onTaskCreate({ title, description }); 
        setTitle('');
        setDescription('');
    };

  const handleLogout = async () => {
      setLoading(true); 
      try {
        await signOut(auth); // Sign out from Firebase auth
        sessionStorage.removeItem("jwt_token"); // Remove token from sessionStorage
        alert("Logged out successfully."); // Alert user of successful logout
        history.push("/login"); // Redirect to login page
      } catch (error) {
        console.error("Logout Error:", error);
        alert("Logout failed. Please try again."); // Alert user of error
      } finally {
        setLoading(false); // Always reset loading state
      }
    };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {user?.displayName || "User"}!</h1>
      <button onClick={handleLogout} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Logout
      </button>
      <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit">Add Task</button>
        </form>
      
    </div>
  );
  


};

export default Home;*/
// frontend/src/components/TaskList.js

import React, { useState, useEffect } from 'react';
import Feed from './Feed.js'; // Assuming Feed component displays tasks
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import '../App.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

 

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;

    try {
      const res = await axios.post(
        '/api/tasks',
        { title: newTaskTitle, description: newTaskDescription },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  
  return (
    <div className="task-list-container">
      <NavBar />
      <div className="task-management-container">
        <h2>Task Management</h2>
        <form onSubmit={handleAddTask} className="form-data">
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required 
          />
          <textarea
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            required // Added required attribute for validation
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
      <Feed /> 
    </div>
  );
}

export default TaskList;
