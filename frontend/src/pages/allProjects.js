import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './usercontext';

const AllProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const user = useUser()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await axios.get('http://localhost:4000/all-projects');
        setProjects(result.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleAddProject = async (projectId) => {
    try {
      const postData = {
        id: user.user.id
      }
      await axios.post(`http://localhost:4000/all-projects/${projectId}/add`, {postData});
      alert('Project added for students successfully');
    } catch (error) {
      console.error('Error adding project for students:', error);
      alert('Error adding project for students');
    }
  };

  return (
    <div>
      <h1 style={{fontSize:'40px', textAlign:'center'}}>Проекты</h1>
      <div>
        {projects.map(project => (
          <div key={project.id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px', borderRadius:'30px' }}>
            <img src={project.cover_image} alt={project.title} style={{ width: '100%', height: 'auto' }} />
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <button onClick={() => handleAddProject(project.id)}>Добавить Проект</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjectsListPage;
