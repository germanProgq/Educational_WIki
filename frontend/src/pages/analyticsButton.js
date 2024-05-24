import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useUser } from './usercontext';

const DownloadButton = () => {
  const user = useUser();
  const deciderole = user.user?.role;
  let role = 'student'
   if (deciderole === 'учитель') {
    role = 'teacher';
  }

  const userId = user.user?.id;

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/download/${role}/${userId}`);
      const data = response.data;

      // Convert data to CSV or any other format
      const formattedData = formatDataForCSV(data, role);
      const blob = new Blob([formattedData], { type: 'text/csv;charset=utf-8;' });

      saveAs(blob, `${role}_data.csv`);
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  };

  const formatDataForCSV = (data, role) => {
    let csvContent = '';

    if (role === 'student') {
      csvContent += `Full Name: ${data.full_name}\r\n`;
      csvContent += `Email: ${data.email}\r\n`;
      csvContent += `Username: ${data.username}\r\n`;
      csvContent += 'Projects:\r\n';
      data.projects.forEach(project => {
        csvContent += `Project Title: ${project.title}, Score: ${project.score}\r\n`;
      });
    } else if (role === 'teacher') {
      csvContent += `ФИО: ${data.full_name}\r\n`;
      csvContent += `Почта: ${data.email}\r\n`;
      csvContent += `Логин: ${data.username}\r\n`;
      csvContent += `Самый Популярный курс: ${data.mostFamousCourse}\r\n`;
      csvContent += 'Модули:\r\n';
      data.modules.forEach(module => {
        csvContent += `Module Title: ${module.title}, Student ID: ${module.student_id}, Score: ${module.score}\r\n`;
      });
    }

    return csvContent;
  };

  return (
    <button onClick={handleDownload}>
      Скачать репорт
    </button>
  );
};

export default DownloadButton;
