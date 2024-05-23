import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { useUser } from "./usercontext";
import { isMobile } from "react-device-detect";
import MobileLogIn from "./Mobile/mobileLogin";
import ReCAPTCHA from "react-google-recaptcha";
import './styles/root.css';
import './styles/login.css';

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null); // State to store reCAPTCHA token
  const [error, setError] = useState("");
  const [role, setRole] = useState("Ученик")
  const API_BASE_URL = process.env.API || 'http://localhost:4000';

  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setCaptchaToken(null); // Clear captcha token
  };

  const handleLogin = async () => {
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }
    if (!password || !username) {
      setError("Пожалуйста, введите все параметры")
      return
    }

    try {
      const postData = { username, password, captchaToken }; // Include captchaToken in postData
      const response = await axios.post(`${API_BASE_URL}/login`, postData);

      if (response.status === 200) {
        clearInputs()
        const token = response.data.token;
        const userResponse = await axios.get(`${API_BASE_URL}/user-info/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        

        const userData = userResponse.data[0];
        const user = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          token,
        };

        updateUser(user);
        navigate(`/users/${userData.email}`);
      } else {
        setError("Login failed: unexpected status code.");
        setTimeout(() => {
          setError("");          
        }, 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed: " + (error.response?.data?.message || "Unexpected error"));
    }
  };

  const handleSignup = async () => {
    if (!role.toLowerCase() === 'ученик' || !role.toLowerCase === 'учитель') {
      setError("Можно выбрать либо учителя либо ученика")
      return
    }
    if (!role || !password || !username || !email) {
      setError("Пожалуйста, введите все параметры")
      return
    }
    try {
      const postData = { username, email, password, role }; // Include captchaToken in postData
      const response = await axios.post(`${API_BASE_URL}/sign`, postData);

      if (response.status === 201) {
        const token = response.data.token;
        const userResponse = await axios.get(`${API_BASE_URL}/user-info/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = userResponse.data[0];
        console.log(userData)
        const user = {
          username: userData.username,
          email: userData.email,
          role: userData.role,
          token,
        };

        updateUser(user);
        navigate(`/users/${userData.email}`);
      } else {
        setError("Signup failed: unexpected status code.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed: " + (error.response?.data?.message || "Unexpected error"));
    }
  };

  const HandleFormSubmit = (e) => {
    e.preventDefault();
    const isSignup = document.getElementById("chk").checked;

    if (!isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
    clearInputs();
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  if (isMobile) {
    return <MobileLogIn />;
  }

  return (
    <div className="contact-info-2">
      <p style={{position:'fixed', top:"80vh", color: 'var(--main-bg)', zIndex:'100000000000000000', background:'var(--third)', borderRadius:'30px'}}>{error}</p>
      <div className="contact-form-2">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="signup">
          <form>
            <label className='form-label' htmlFor="chk" aria-hidden="true">Регистрация</label>
            <input className='form-input' type="text" name="txt" placeholder="Логин" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className='form-input' type="email" name="email" placeholder="Почта" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className='form-input' type="password" name="pswd" placeholder="Пароль" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className='form-input' type="text" name="role" placeholder="Роль" required autoComplete="role" value={role} onChange={(e) => setRole(e.target.value)} />
            <button className="submit-form-button" type="submit" onClick={HandleFormSubmit}>Регистрация</button>
          </form>
        </div>
        <div className="login">
          <form>
            <label className='form-label' htmlFor="chk" aria-hidden="true">Вход</label>
            <input className='form-input' type="text" name="email" placeholder="Логин" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className='form-input' type="password" name="pswd" placeholder="Пароль" required autoComplete="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{display:'flex', justifyContent:'center'}}>
              <ReCAPTCHA
                sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                onChange={handleCaptchaChange}
              />
           </div>
            <button className="submit-form-button" onClick={HandleFormSubmit} type="submit">Войти</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
