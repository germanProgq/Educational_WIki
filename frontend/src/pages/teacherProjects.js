// src/pages/ProjectsListPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from './usercontext';
import '../pages/styles/root.css'

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const user = useUser()
  const config = {
    headers: {
      Authorization: `Bearer ${user.user.token}`, // Include JWT token for authorization
    },
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await axios.get(`http://localhost:4000/projects/${user.user.email}`, config); // Adjust this endpoint as needed
        setProjects(result.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h1 style={{textAlign:'center', fontSize:'40px'}}>Все проекты</h1>
      <table style={{display:'flex', gap:'3vh', flexDirection:'column'}}>
        <thead>
          <tr style={{display:'flex', gap:'10%', justifyContent:'center'}}>
            <th style={{textAlign:'center', fontSize:'30px'}}>Имя</th>
            <th style={{textAlign:'center', fontSize:'30px'}}>Статус</th>
            <th style={{textAlign:'center', fontSize:'30px'}}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id} style={{display:'flex', gap:'10%', textAlign:'center', justifyContent:'center'}}>
              <td style={{textAlign:'center', fontSize:"23px"}}>{project.title}</td>
              <td style={{textAlign:'center', fontSize:"23px"}}>{project.status}</td>
              <td style={{textAlign:'center', fontSize:"23px"}}>
                <Link to={`/teacher/projects/id/${project.id}`} style={{padding:'1vh 2vw', background:'var(--main-font-color)', borderRadius:"30px", color:'var(--main-bg)', textDecoration:'none',}}>Редактировать</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={`/projects/add`} style={{padding:'1vh 2vw', background:'var(--main-font-color)', borderRadius:"30px", color:'var(--main-bg)', textDecoration:'none', position:'fixed', top:'90vh'}}>Добавить проект</Link>
    </div>
  );
};

export default ProjectsListPage;
