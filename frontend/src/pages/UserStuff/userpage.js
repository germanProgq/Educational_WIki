// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useUser } from '../usercontext';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import TeacherDashboardPage from './teacherDashboard';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProfilePage = () => {
  const user = useUser();
  const student_id = user.user.id;
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [grades, setGrades] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const submissionsRes = await axios.get(`http://localhost:4000/students/${student_id}/submissions/count`);
        setTotalSubmissions(submissionsRes.data);

        const gradesRes = await axios.get(`http://localhost:4000/students/${student_id}/grades`);
        setGrades(gradesRes.data);

        const coursesRes = await axios.get(`http://localhost:4000/students/${student_id}/courses/count`);
        setTotalCourses(coursesRes.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, [student_id]);

  const gradesData = {
    labels: grades.map(g => g.topic),
    datasets: [
      {
        label: 'Average Grade',
        data: grades.map(g => g.average_score),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      {user.user.role === 'учитель' ? (
        <TeacherDashboardPage />
      ) : (
        <div>
          <h1 style={{ fontSize: '40px', textAlign: 'center' }}>{user.user.username} Profile</h1>
          <div>
            <h2>Заданий Отправлено: {totalSubmissions}</h2>
            <h2>Пописан на: {totalCourses} курсов</h2>
            <h3 style={{ textAlign: 'center', fontSize: '23px' }}>Оценки за проекты</h3>
            <Bar data={gradesData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
