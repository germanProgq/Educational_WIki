import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Module from './modules';
import { useUser } from './usercontext';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [modules, setModules] = useState([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const user = useUser()
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${user.user.token}`, // Include JWT token for authorization
    },
  };
  const clearAll = () => {
    let inputs = document.querySelectorAll('input')
    inputs.forEach((i) => {
      i.value = null
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:4000/project/${id}`, config);
        setProject(result.data.project);
        setModules(result.data.modules);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleAddModule = async () => {
    const newModule = { title: newModuleTitle, description: '' };
    try {
      const result = await axios.post(`http://localhost:4000/projects/${id}/modules`, newModule);
      setModules([...modules, result.data]);
      setNewModuleTitle('');
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const result = await axios.put(`http://localhost:4000/projects/${id}`, project);
      setProject(result.data);
      clearAll();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:4000/projects/${id}`);
        navigate('/')
        
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'3vw'}}>
      <h1 style={{fontSize:'40px', textAlign:'center'}}>{project.title}</h1>
      <input 
          value={newModuleTitle} 
          onChange={e => setNewModuleTitle(e.target.value)} 
          placeholder="Название" 
        />
      <textarea value={project.description} onChange={e => setProject({ ...project, description: e.target.value })} style={{minHeight:'20vh', borderRadius:'8px'}}/>      
      <div style={{display:'flex', flexDirection:'column', gap:'5vh'}}>
        <button onClick={handleAddModule}>Добавить модуль</button>
      </div>
      {modules.map(module => (
        <Module key={module.id} module={module} setModules={setModules} modules={modules} />
      ))}
       <button onClick={handleUpdateProject}>Обновить проект</button>
       <br/>
      <button onClick={handleDeleteProject}>Удалить проект</button>
    </div>
  );
};

export default ProjectPage;
