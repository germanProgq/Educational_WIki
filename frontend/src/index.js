import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom/client';
import { getRandomTransition } from './assets/getRndTransition';
import { UserProvider } from './pages/usercontext';

import ProtectedRoute from './pages/protectedroute';
import Layout from './pages/layout';
import HomePage from './pages/main-page';
import LogIn from './pages/login';
import NoPage from './pages/nopage';
import ProfilePage from './pages/UserStuff/userpage'
import UserSettings from './pages/UserStuff/usersettings';
import ChangeName from './pages/UserStuff/Change/name';
import ChangeEmail from './pages/UserStuff/Change/email';
import ChangePass from './pages/UserStuff/Change/password';
import AddCatalogItem from './pages/addToCatalog';
import EditUsers from './pages/UserStuff/Change/editUsers';
import EditCatalog from './pages/UserStuff/Change/editCatalog';
import DeleteUser from './pages/UserStuff/Change/deleteUser';
import UpdateUserInfo from './pages/UserStuff/Change/updateUserInfo';
import GeneratePassword from './pages/UserStuff/Change/generatePasswords';
import GrantAdmin from './pages/UserStuff/Change/giveAdmin';
import RevokeAdmin from './pages/UserStuff/Change/revokeAdmin';
import ScrollToTop from './pages/scrollToTop';
import DeleteAccount from './pages/UserStuff/Change/deleteAccount';
import ChangeBirth from './pages/UserStuff/Change/changeDateBirth';
import ChangeFIO from './pages/UserStuff/Change/changeFIO';
import PendingProjects from './pages/approveProjects';
import ProjectsListPage from './pages/teacherProjects';
import ProjectPage from './pages/editProjects';
import AllProjectsListPage from './pages/allProjects';
import StudentProjectsPage from './pages/studentProjects';
import ProjectModulesPage from './pages/studentResponse';
import GradeSubmissionsPage from './pages/grading';


export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Layout />}>
        <Route index element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><HomePage /></motion.div>}/>
        <Route path="login" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><LogIn /></motion.div>}/>
        <Route path="/users/:username" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProfilePage /></motion.div>}/>
        <Route path="/settings" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><UserSettings /></motion.div>}/>
        <Route path="/change/username" element={ <motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ChangeName /></motion.div>}/>
        <Route path="/change/email" element={ <motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ChangeEmail /></motion.div>}/>
        <Route path="/change/password" element={ <motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ChangePass /></motion.div>}/>
        <Route path="/projects/add" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'учитель', 'owner']}><AddCatalogItem /></ProtectedRoute></motion.div>}/>
        <Route path="/users/edit" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'owner']}><EditUsers /></ProtectedRoute></motion.div>}/>
        <Route path="/catalog/edit" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'owner']}><EditCatalog /></ProtectedRoute></motion.div>}/>
        <Route path="/admin/delete/user" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'owner']}><DeleteUser /></ProtectedRoute></motion.div>}/>
        <Route path="/admin/change/user-stuf" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['admin', 'owner']}><UpdateUserInfo /></ProtectedRoute></motion.div>}/>
        <Route path="/generate/password" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><GeneratePassword /></motion.div>}/>
        <Route path="/owner/grant-admin" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner']}><GrantAdmin /></ProtectedRoute></motion.div>}/>
        <Route path="/owner/revoke-admin" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner']}><RevokeAdmin /></ProtectedRoute></motion.div>}/>
        <Route path="/user/delete" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><DeleteAccount /></motion.div>}/>    
        <Route path="/update/date" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ChangeBirth /></motion.div>}/>    
        <Route path="/update/user-info" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ChangeFIO /></motion.div>}/> 
        <Route path="/projects/approve" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['owner', 'admin']}><PendingProjects/></ProtectedRoute></motion.div>}/>    
        <Route path="/teacher/projects" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['учитель']}><ProjectsListPage/></ProtectedRoute></motion.div>}/>
        <Route path="/teacher/analysis" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['учитель']}><ProjectsListPage/></ProtectedRoute></motion.div>}/> 
        <Route path="/teacher/projects/id/:id" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['учитель']}><ProjectPage/></ProtectedRoute></motion.div>}/>
        <Route path="/all-projects" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['ученик']}><AllProjectsListPage/></ProtectedRoute></motion.div>}/>  
        <Route path="/my-projects" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['ученик']}><StudentProjectsPage/></ProtectedRoute></motion.div>}/>    
        <Route path="/my-projects/respond/:project_id" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['ученик']}><ProjectModulesPage/></ProtectedRoute></motion.div>}/>
        <Route path="/grading" element={<motion.div variants={getRandomTransition()} initial="initial" animate="animate" exit="exit"><ProtectedRoute allowedRoles={['учитель']}><GradeSubmissionsPage/></ProtectedRoute></motion.div>}/>    








          <Route path="*" element={<NoPage />}/>
      </Route>
    </Routes>
  </AnimatePresence>
  );
}
// Using createRoot for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Router><ScrollToTop/><UserProvider><App /></UserProvider></Router>);