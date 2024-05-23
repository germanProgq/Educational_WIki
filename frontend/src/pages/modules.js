// src/components/Module.js
import React, { useState } from 'react';
import axios from 'axios';
import Task from './task';

const Module = ({ module, setModules, modules }) => {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [tasks, setTasks] = useState(module.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleUpdateModule = async () => {
    try {
      const result = await axios.put(`http://localhost:4000/modules/${module.id}`, { title, description });
      setModules(modules.map(m => (m.id === module.id ? result.data : m)));
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const handleDeleteModule = async () => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await axios.delete(`http://localhost:4000/modules/${module.id}`);
        setModules(modules.filter(m => m.id !== module.id));
      } catch (error) {
        console.error('Error deleting module:', error);
      }
    }
  };

  const handleAddTask = async () => {
    const newTask = { title: newTaskTitle, description: '', file_url: '' };
    try {
      const result = await axios.post(`http://localhost:4000/tasks/${module.id}`, newTask);
      setTasks([...tasks, result.data]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'2vh'}}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={handleUpdateModule}>Обновить Модуль</button>
      <button onClick={handleDeleteModule}>Удалить Модуль</button>
      <div style={{display:'flex', gap:'1vw'}}>
        <input 
          value={newTaskTitle} 
          onChange={e => setNewTaskTitle(e.target.value)} 
          placeholder="Новое Название Задания" 
        />
        <button onClick={handleAddTask}>Добавить Задание</button>
      </div>
      {tasks.map(task => (
        <Task key={task.id} task={task} setTasks={setTasks} tasks={tasks} />
      ))}
    </div>
  );
};

export default Module;
