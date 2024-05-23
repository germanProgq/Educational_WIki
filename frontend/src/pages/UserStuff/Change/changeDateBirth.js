import React, { useState } from "react";
import axios from 'axios';
import { useUser } from "../../usercontext";
import { useNavigate } from "react-router-dom";

const ChangeBirth = () => {
    const [dateOfBirth, setDateOfBirth] = useState(""); // State for date of birth
    const [error, setError] = useState("");
    const {user} = useUser()
    const navigate = useNavigate();
    const token = user?.token;

    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };


    // Function to handle date changes
    const handleDateChange = (event) => {
        const { value } = event.target;
        setDateOfBirth(value);
    };

    const submit = async () => {
        try {
           const userId = user.email
            await axios.put(`/users/${userId}/dateOfBirth`, { dateOfBirth }, config);
            setError('Успешно обновили!');
            setTimeout(() => {
                navigate('/')                
            }, 880);
        } catch (error) {
            console.error('Error updating date of birth:', error);
            setError('Ошибка. Попробуйте позже');
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'column', gap:'10vh', justifyContent:'center', alignItems:'center'}}>
            <label htmlFor="dateOfBirth" style={{fontSize:'40px'}}>Дата Рождения:</label>
            <input
                type="date"
                id="dateOfBirth"
                value={dateOfBirth}
                onChange={handleDateChange}
            />
            <button onClick={submit}>Отправить</button>
            {error}
        </div>
    );
};

export default ChangeBirth;
