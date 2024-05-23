import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './usercontext';
import Loader from '../assets/Loaders/loaders';
import { useDropzone } from 'react-dropzone';
import './styles/addToCatalog.css';

const AddCatalogItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null); // Single file for cover image
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const token = user?.token;
  const API = process.env.API || 'http://localhost:4000';

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('difficultyLevel', difficultyLevel);
    formData.append('topic', topic);
    formData.append('coverImage', file);
    formData.append('teacherEmail', user.email)

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await axios.post(`${API}/projects/add`, formData, config);
      if (response.status === 201) {
        setSuccess(response.data.message);
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setDifficultyLevel('');
        setTopic('');
        setFile(null);
      } else {
        setError('Unexpected response status');
      }
    } catch (err) {
      console.error('Error adding project:', err);
      setError('An error occurred while adding the project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-catalog-item">
      <h2 style={{ fontSize: '40px', textAlign: 'center' }}>Добавить проект</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10vh' }} className="addToCatalogForm">
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          placeholder="Дата начала"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Дата окончания"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Уровень сложности"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Тема"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p style={{fontSize:'23px', textAlign:'center', padding:'20px', background:'var(--main-font-color)', color:'var(--main-bg)', borderRadius:'20px', cursor:'pointer'}}>Переместите файл, или нажмите сюда</p>
        </div>
        {file && <p>{file.name}</p>}
        <button type="submit">Add Project</button>
      </form>
      {loading && <Loader />}
    </div>
  );
};

export default AddCatalogItem;
