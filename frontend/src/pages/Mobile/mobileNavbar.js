import React from 'react';
import { Link } from 'react-router-dom';

const MobileNav = ({ user, showDrop }) => {
  return (
    <>
    <div id='mobile-header'>     
        <Link to="/" style={{outline:'none'}}>
            <div className="intro logo">
              <h6 style={{fontSize:'40px', marginTop:'120px'}}>WikiArea</h6>
            </div>
        </Link> 
      <div id="overflow-drop"></div>
      {user ? (
        <div id="user" onClick={showDrop}>
          <p className="username-clickable">{user.username}</p>
          <div id="phone-user-click-menu" className="user-drop-hidden">
          <Link className="dropdown-a-hidden" to={`/settings`}>
                    Настройки
                  </Link>
                  <Link className="dropdown-a-hidden" to={`/users/${user.username}`}>
                    Профиль
                  </Link>
                  {user.role === 'учитель' ? (
                    <>
                      <Link className="dropdown-a-hidden" to={`/teacher/projects`}>Проекты</Link>
                    </>
                  ) : user.role === 'ученик' ? (
                    <>
                      <Link className="dropdown-a-hidden" to={`/all-projects`}>
                      Каталог проектов
                      </Link>
                      <Link className="dropdown-a-hidden" to={`/my-projects`}>Проекты</Link>
                    </>
                  ) : null}
          </div>
        </div>
      ) : (
        <Link to="/login" className='log-in-a'>Вход / Регистрация</Link>
      )}
      </div>
    </>
  );
};

export default MobileNav;
