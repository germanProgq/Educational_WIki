import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { isMobile } from 'react-device-detect';
import MobileNav from './Mobile/mobileNavbar'
import './styles/root.css';
import './styles/navbar.css';
import './styles/user-click-menu.css';

const Navbar = () => {
  const [phone, setPhone] = useState(false);
  const [user] = useState(() => {
    const userCookie = Cookies.get("user");
    return userCookie ? JSON.parse(userCookie) : null;
  });

  useEffect(() => {
    if (isMobile) {
      setPhone(true);
    }
  }, []);

  const showDrop = () => {
    let dropdown = document.getElementById('user-click-menu');
    let phoneDropdown = document.getElementById('phone-user-click-menu');
    let pagecontent = document.getElementById('overflow-drop');

    pagecontent.onclick = showDrop;

    if (dropdown) {
      let links = dropdown.querySelectorAll('a');
      if (dropdown.classList.contains('user-drop-shown')) {
        dropdown.classList.remove('user-drop-shown');
        dropdown.classList.add('user-drop-hidden');
        document.body.style.overflowY = 'auto';
        pagecontent.style.opacity = '0';
        pagecontent.style.transform = "translateX(-100vw)";

        links.forEach((link) => {
          link.classList.remove('dropdown-a-shown');
          link.classList.add('dropdown-a-hidden');
        });
      } else {
        dropdown.classList.add('user-drop-shown');
        dropdown.classList.remove('user-drop-hidden');
        document.body.style.overflowY = 'hidden';
        pagecontent.style.opacity = '.64';
        pagecontent.style.transform = "translateX(0)";

        links.forEach((link) => {
          link.classList.add('dropdown-a-shown');
          link.classList.remove('dropdown-a-hidden');
        });
      }
    } else if (phoneDropdown) {
      let links = phoneDropdown.querySelectorAll('a');
      links.forEach((link) => {
        link.addEventListener('click', showDrop);
      });
      if (phoneDropdown.classList.contains('user-drop-shown')) {
        phoneDropdown.classList.remove('user-drop-shown');
        phoneDropdown.classList.add('user-drop-hidden');
        document.body.style.overflowY = 'auto';
        pagecontent.style.opacity = '0';
        pagecontent.style.transform = "translateX(-100vw)";

        pagecontent.onclick = showDrop;

        links.forEach((link) => {
          link.classList.remove('dropdown-a-shown');
          link.classList.add('dropdown-a-hidden');
        });
      } else {
        phoneDropdown.classList.add('user-drop-shown');
        phoneDropdown.classList.remove('user-drop-hidden');
        document.body.style.overflowY = 'hidden';
        pagecontent.style.opacity = '.64';
        pagecontent.style.transform = "translateX(0px)";

        links.forEach((link) => {
          link.classList.add('dropdown-a-shown');
          link.classList.remove('dropdown-a-hidden');
        });
      }
    }
  }

  return (
    <>
      {phone ? (
        <MobileNav user={user} showDrop={showDrop} />
      ) : (
        <div id="header">
          <Link to="/" style={{ outline: 'none', marginTop: '10px' }}>
            <div className="intro logo">
              <h6>WikiArea</h6>
            </div>
          </Link>
          <nav className="header-links">
            {user ? (
              <div id="user" onClick={showDrop}>
                <p className="username-clickable">{user.username}</p>
                <div id="user-click-menu" className="user-drop-hidden">
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
              <Link to="/login">Вход / Регистрация</Link>
            )}
          </nav>
          <div id="overflow-drop"></div>
        </div>
      )}
    </>
  );
};

export default Navbar;
