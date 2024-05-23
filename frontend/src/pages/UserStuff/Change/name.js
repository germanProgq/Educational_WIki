import React, { useState } from "react";
import { useUser } from "../../usercontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './styles/change.css'

const API = process.env.API || 'http://localhost:4000'

const ChangeName = () => {
    const navigate = useNavigate()
    const { user, updateUser } = useUser(); // Current user and context update function
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');
    const clearAll = () => {
      setNewUsername('')
      setTimeout(() => {
        navigate('/settings')        
      }, 800);
    }
  
    const handleChangeUsername = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include JWT token for authorization
        },
      };
  
      if (!newUsername) {
        setMessage("Please enter a new username.");
        return;
      }
  
      try {
        const response = await axios.put(
          `${API}/user/change-username`, // Backend endpoint for changing username
          {
            newUsername,
          },
          config
        );
  
        if (response.status === 200) {
          setMessage("Username changed successfully.");
          clearAll()
  
          // Update user context with new username
          updateUser({
            ...user, // Keep existing user info
            username: newUsername, // Update the username
          });
        } else {
          setMessage("Failed to change username.");
        }
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred while changing your username.');
      }
    };
      
    return (
        <div className="change">
            <h4 className="what-to-change">Смена Логина</h4>
            <div className="current">Ваш логин: <p className="current-user">{user.username}</p></div>
            <div className="form__group field">
                <input type="input" className="form__field" placeholder="Новый логин" name="name" id='name' required value={newUsername} onChange={(e) => setNewUsername(e.target.value)}/>
                <label htmlFor="name" className="form__label">Новый логин</label>                
            </div>
            {message}
            <button type="submit" onClick={handleChangeUsername}>Подтвердить</button>
        </div>        
    )
}
export default ChangeName