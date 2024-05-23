import React, { useState } from "react";
import axios from 'axios';
import { useUser } from "../../usercontext";
import { useNavigate } from "react-router-dom";

const ChangeFIO = () => {
    const [FIO, setFIO] = useState(""); // State for full name
    const [error, setError] = useState("");
    const { user } = useUser();
    const navigate = useNavigate();
    const token = user?.token;

    // Function to handle full name changes
    const handleFIO = (event) => {
        const { value } = event.target;
        setFIO(value);
    };

    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
    };

    const submit = async () => {
        try {
           const userId = user.email; // Assuming user object contains 'id'
           const postData = { FIO };

           await axios.put(`/users/${userId}/fio`, postData, config);
           setError('Успешно обновили!');
           setTimeout(() => {
                navigate('/');
           }, 880);
        } catch (error) {
            console.error('Error updating FIO:', error);
            setError('Ошибка. Попробуйте позже');
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'column', gap:'10vh', justifyContent:'center', alignItems:'center'}}>
            <label htmlFor="fio" style={{fontSize:'40px'}}>ФИО:</label>
            <input
                type="text"
                id="fio"
                value={FIO}
                onChange={handleFIO}
            />
            <button onClick={submit}>Отправить</button>
            {error && <div>{error}</div>}
        </div>
    );
};

export default ChangeFIO;
