import React, { useState } from 'react';
import axios from 'axios';

const Task = ({ task, setTasks, tasks }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleUpdateTask = async () => {
    try {
      const result = await axios.put(`http://localhost:4000/tasks/${task.id}`, { title, description, file_url: task.file_url });
      setTasks(tasks.map(t => (t.id === task.id ? result.data : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:4000/tasks/${task.id}`);
        setTasks(tasks.filter(t => t.id !== task.id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={handleUpdateTask}>Обновить Задание</button>
      <button onClick={handleDeleteTask}>Удалить Задание</button>
    </div>
  );
};

export default Task;
