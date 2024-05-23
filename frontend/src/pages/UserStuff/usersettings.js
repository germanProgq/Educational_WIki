import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../usercontext";
import Cookies from 'js-cookie'

import "./styles/root.css";
import "./styles/usersettings.css";

const UserSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const logout = () => {
    updateUser(null);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="settings-div">
        <h3 className="settings-title">User Settings</h3>
        <p>You must be logged in to view user settings.</p>
      </div>
    );
  }

  const commonSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Поменять</h5>
      <li className="what-can-be-changed-options">        
          <Link to={`/change/email`}>Имейл</Link>        
      </li>
      <li className="what-can-be-changed-options">        
          <Link to={`/change/username`}>Логин</Link>        
      </li>
      <li className="what-can-be-changed-options">        
          <Link to={`/change/password`}>Пароль</Link>        
      </li>
    </ul>
  );

  const updateSettings = (
    <>
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Информация</h5>
      <li className="what-can-be-changed-options">        
          <Link to={`/update/user-info`}>ФИО</Link>       
      </li>
      <li className="what-can-be-changed-options">        
          <Link to={`/update/date`}>Дата Рождения</Link>        
      </li>
    </ul>
    </>
  )

  // const userSpecificSettings = (
  //   <ul className="what-can-be-changed-row">
  //     <h5 className="settings-name">Update</h5>
  //     <li className="what-can-be-changed-options">        
  //         <Link to={`/update/name`}>Name</Link>       
  //     </li>
  //     <li className="what-can-be-changed-options">        
  //         <Link to={`/update/surname`}>Surname</Link>        
  //     </li>
  //     <li className="what-can-be-changed-options">        
  //         <Link to={`/update/payment`}>Payment</Link>        
  //     </li>
  //   </ul>
    
  // );

  const teacherSpecificSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Учителям</h5>
      <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>        
          <Link to={`/projects/add`}>Добавить Проект</Link>    
          <Link to={`/grading`}>Оценить</Link>               
      </li>
    </ul>
  );

  const adminSpecificSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Админу</h5>
      <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>        
          <Link to={`/users/edit`}>Пользователи</Link>
          <Link to={`/projects/approve`}>Подтвердить проект</Link>
      </li>
    </ul>
  );

  const ownerSpecificSettings = (
    <ul className="what-can-be-changed-row">
      <h5 className="settings-name">Владельцу</h5>
      <li className="what-can-be-changed-options" style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>        
          <Link to={`/owner/grant-admin`}>Дать Админ</Link>                
          <Link to={`/owner/revoke-admin`}>Забрать Админ</Link>                
      </li>
    </ul>
  );

  const displayOwnerOptions = user.role === "owner";
  const displayTeacherOptions = user.role === "учитель";
  const displayCommonOptions = user.role === "ученик" || displayOwnerOptions || displayTeacherOptions;
  const displayAdminOptions = user.role === "admin" || displayOwnerOptions;

  return (
    <div className="settings-div">
      <h3 className="settings-title">Настройки</h3>
      <div className="what-can-be-changed">
        {displayCommonOptions && commonSettings}
        {/* {displayCommonOptions && userSpecificSettings} */}
        {updateSettings}
        {displayTeacherOptions && teacherSpecificSettings}
        {displayAdminOptions && adminSpecificSettings}
        {displayOwnerOptions && ownerSpecificSettings}
        <ul className="what-can-be-changed-row">
          <h5 className="settings-name">Аккаунт</h5>
          <li className="what-can-be-changed-options">
            <button onClick={logout} style={{padding:'2vh 5vw', marginBottom:'30px'}}>Выйти</button>
          </li>
          <Link to={`/user/delete`} style={{color:'#f5f5f5', textDecoration:'none', background:'red'}} className="delete-account">Удалить аккаунт</Link>
        </ul>
      </div>
    </div>
  );
};

export default UserSettings;
