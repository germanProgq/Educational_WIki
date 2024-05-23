// src/pages/StudentProjectsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useUser } from './usercontext';

const StudentProjectsPage = () => {
  const user = useUser()
  const student_id = user.user.id
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchStudentProjects = async () => {
      try {
        const result = await axios.get(`http://localhost:4000/students/${student_id}/projects`);
        setProjects(result.data);
      } catch (error) {
        console.error('Error fetching student projects:', error);
      }
    };
    fetchStudentProjects();
  }, [student_id]);

  return (
    <div>
      <h1 style={{fontSize:'40px', textAlign:'center'}}>Проекты {user.user.username}</h1>
      <div>
        {projects.map(project => (
          <div key={project.id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px', borderRadius:'30px', display:'flex', flexDirection:'column', gap:'3%', justifyContent:'center', alignItems:'center' }}>
            <img src={project.cover_image} alt={project.title} style={{ width: '100px', height: 'auto' }} />
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <Link style={{padding:'1vh 2vw', background:'var(--main-font-color)', color:'var(--main-bg)', textDecoration:'none', borderRadius:'20px'}} to={`/my-projects/respond/${project.id}`}>Читать дальше</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProjectsPage;
