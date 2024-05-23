import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from './usercontext';

const Task = ({ task, moduleId, submissions, handleSubmissionChange, handleSubmit }) => (
  <div style={{ marginBottom: '8px' }}>
    <h4>{task.title}</h4>
    <p>{task.description}</p>
    <input
      type="text"
      value={submissions[task.id] || ''}
      onChange={(e) => handleSubmissionChange(task.id, e.target.value)}
      placeholder="Ссылка на задание"
      style={{ width: '100%', marginBottom:"10px" }}
    />
    <button onClick={() => handleSubmit(moduleId, task.id)}>Отправить проект</button>
  </div>
);

const Module = ({ module, submissions, handleSubmissionChange, handleSubmit }) => (
  <div key={module.id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
    <h2>{module.title}</h2>
    <p>{module.description}</p>
    <h3>Задания</h3>
    {module.tasks && module.tasks.map(task => (
      <Task 
        key={task.id} 
        task={task} 
        moduleId={module.id} 
        submissions={submissions} 
        handleSubmissionChange={handleSubmissionChange} 
        handleSubmit={handleSubmit} 
      />
    ))}
  </div>
);

const ProjectModulesPage = () => {
  const { project_id } = useParams();
  const [modules, setModules] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useUser();
  const id = user.user.id;

  useEffect(() => {
    const fetchModulesAndTasks = async () => {
      try {
        const result = await axios.get(`http://localhost:4000/projects/${project_id}/modules`);
        const { modules, tasks } = result.data;

        // Map tasks to their respective modules
        const modulesWithTasks = modules.map(module => ({
          ...module,
          tasks: tasks.filter(task => task.module_id === module.id)
        }));

        setModules(modulesWithTasks);
      } catch (error) {
        setError('Error fetching modules and tasks');
        console.error('Error fetching modules and tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModulesAndTasks();
  }, [project_id]);

  const handleSubmissionChange = (taskId, content) => {
    setSubmissions({ ...submissions, [taskId]: content });
  };

  const handleSubmit = async (module_id, task_id) => {
    if (!submissions[task_id]) {
      alert('Please provide a submission URL');
      return;
    }

    try {
      const student_id = id;
      const submission_url = submissions[task_id];
      await axios.post(`http://localhost:4000/modules/${module_id}/tasks/${task_id}/submit`, {
        student_id,
        submission_url,
      });
      alert('Отправлено');
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Ошибка при отправке задания');
    }
  };

  if (loading) {
    return <div className='loader'></div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '30px', textAlign: 'center' }}>Модули для проекта</h1>
      {modules.map(module => (
        <Module 
          key={module.id} 
          module={module} 
          submissions={submissions} 
          handleSubmissionChange={handleSubmissionChange} 
          handleSubmit={handleSubmit} 
        />
      ))}
    </div>
  );
};

export default ProjectModulesPage;
