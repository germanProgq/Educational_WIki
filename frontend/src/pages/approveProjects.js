import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './usercontext';

const API = process.env.API || 'http://localhost:4000'

const PendingProjects = () => {
    const [error, setError] = useState('')
    const [projects, setProjects] = useState([]);
    const user = useUser()
    const token = user?.token;

    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
    };

    useEffect(() => {
        const getProjects = async() => {
        const result = await axios.get(`${API}/projects`, config)
            setProjects(result.data)           
        }
        getProjects()
    }, []);

    const approveProject = async(id) => {
        const res = await axios.post(`${API}/projects/${id}/approve`, config)
        setError(res.data.message)
    };

    const rejectProject = async(id) => {
        const res = await axios.post(`${API}/projects/${id}/reject`, config)
        setError(res.data.message)
    };

    return (
        <div>
            <h1 style={{fontSize:'30px', textAlign:'center'}}>Ожидают Проверку</h1>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <button onClick={() => approveProject(project.id)} style={{margin:'5px'}}>Подтвердить</button>
                        <button onClick={() => rejectProject(project.id)}>Отклонить</button>
                    </li>
                ))}
            </ul>
            {error}
        </div>
    );
};

export default PendingProjects;
