// src/pages/TeacherDashboardPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useUser } from '../usercontext';

const TeacherDashboardPage = () => {
  const user = useUser()
  const teacher_id = user.user.id;
  const [mostFamousProject, setMostFamousProject] = useState({});
  const [moduleCount, setModuleCount] = useState(0);
  const [studentResults, setStudentResults] = useState([]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const projectRes = await axios.get(`http://localhost:4000/teachers/${teacher_id}/most_famous_project`);
        setMostFamousProject(projectRes.data);

        const moduleRes = await axios.get(`http://localhost:4000/teachers/${teacher_id}/module_count`);
        setModuleCount(moduleRes.data);

        const resultsRes = await axios.get(`http://localhost:4000/teachers/${teacher_id}/student_results`);
        setStudentResults(resultsRes.data);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };
    fetchTeacherData();
  }, [teacher_id]);

  const resultsData = {
    labels: studentResults.map(result => result.student_name),
    datasets: [
      {
        label: 'Scores',
        data: studentResults.map(result => result.score),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h1 style={{fontSize:'40px', textAlign:'center'}}>Статистика учителя {user.user.username}</h1>
      <div>
        <h2>Самый популярный проект: {mostFamousProject.title}</h2>
        <h2>Модули: {moduleCount}</h2>
        <h3 style={{fontSize:'23px', textAlign:'center'}}>Результаты студентов</h3>
        <Bar data={resultsData} />
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
