import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const submissionsRes = await axios.get('http://localhost:4000/submissions');
        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    const fetchTestResults = async () => {
      try {
        const testResultsRes = await axios.get('http://localhost:4000/test_results');
        setTestResults(testResultsRes.data);
      } catch (error) {
        console.error('Error fetching test results:', error);
      }
    };

    fetchSubmissions();
    fetchTestResults();
  }, []);

  const handleSubmissionGradeChange = (id, grade) => {
    setSubmissions(submissions.map(submission => 
      submission.id === id ? { ...submission, grade } : submission
    ));
  };

  const handleTestResultGradeChange = (id, grade) => {
    setTestResults(testResults.map(testResult => 
      testResult.id === id ? { ...testResult, grade } : testResult
    ));
  };

  const handleGradeSubmission = async (submissionId, grade) => {
    if (!grade) {
      return alert('Введите оценку')
    }
    try {
      await axios.put(`http://localhost:4000/submissions/${submissionId}`, { grade });
      alert('Оценка отправлена');
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };

  const handleGradeTestResult = async (testResultId, grade) => {
    if (!grade) {
      return alert('Введите оценку')
    }
    try {
      await axios.put(`http://localhost:4000/test_results/${testResultId}`, { grade });
      alert('Оценка отправлена');
    } catch (error) {
      console.error('Error grading test result:', error);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '40px', textAlign: 'center' }}>Оценки</h1>
      <table>
        <thead>
          <tr style={{ width: '90vw' }}>
            <th>Студент</th>
            <th>Модуль</th>
            <th>Проект</th>
            <th>Тип</th>
            <th style={{ width: "30%" }}>Ссылка</th>
            <th>Оценка</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(submission => (
            <tr key={submission.id} style={{ width: '90vw' }}>
              <td>{submission.student_name}</td>
              <td>{submission.module_title}</td>
              <td>{submission.project_title}</td>
              <td>Отправка</td>
              <td style={{ width: "30%" }}>{submission.submission_url}</td>
              <td>
                <input
                  type="number"
                  value={submission.grade || ''}
                  onChange={(e) => handleSubmissionGradeChange(submission.id, e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                <br />
                <button onClick={() => handleGradeSubmission(submission.id, submission.grade)}>Отправить</button>
              </td>
            </tr>
          ))}
          {testResults.map(testResult => (
            <tr key={testResult.id}>
              <td>{testResult.student_name}</td>
              <td>{testResult.module_title}</td>
              <td>{testResult.project_title}</td>
              <td>Тест</td>
              <td>{testResult.score}</td>
              <td>
                <input
                  type="number"
                  value={testResult.grade || ''}
                  onChange={(e) => handleTestResultGradeChange(testResult.id, e.target.value)}
                />
                <br />
                <button onClick={() => handleGradeTestResult(testResult.id, testResult.grade)}>Отправить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeSubmissionsPage;
