import React, { useDebugValue, useEffect, useRef } from "react";
import BetweenPageElement from "./betweenMainPage";
import MainPageCards from "./main-page-cards";
import './styles/root.css'
import './styles/main-page.css'

const HomePage = () => {
    const targetRef = useRef(null);
    const HandleScroll = () => {
        targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (  
        <div>
            <div className="intro-text" style={{height: '78vh', display:'flex', flexDirection:'column', justifyContent:'space-between', marginTop:'20vh'}}>  
                <div style={{background:'var(--third)', borderRadius:'80px', height:'80%', textAlign:'center', alignContent:'center' }}>   
                <h1 className="intro">Wiki Area</h1>
                <p className="subintro" style={{color:'var(--main-bg)'}}>Доступное образование будущего</p>
                </div>
                <div>
                    <p style={{fontSize:'23px'}}>Узнать больше</p>
                    <i className="fa-solid fa-arrow-down-long" id="arrow-home" onClick={HandleScroll} style={{cursor:'pointer', fontSize:'30px'}}></i>
                </div>
            </div>
            <div ref={targetRef} style={{marginTop:"30vh", display:'flex', flexDirection:"column", textAlign:'center', paddingTop:"10vh "}}>
                <p style={{fontSize:'30px'}}>Добро пожаловать на WikiArea - вашу платформу для управления образовательными проекатми!</p>
                <br/>
                <p style={{fontSize:'30px'}}>Простота использования, мощные фунцыиональные возможности, и иновационные подходы делают WikiArea идеальным выбором для обучения и преподования.</p>
            </div>
            <BetweenPageElement/>
            <div style={{padding:'20px'}}>
                <p style={{fontSize:'23px', textAlign:'center', marginBottom:"20vh"}}>Платформа WikiArea - ваш главный инструмент для эффективного управления образовательными проектами! Вот почему именно наша платформа подходит вам лучше всего:</p>
                <MainPageCards/> 
            </div>
            <BetweenPageElement/>                     
        </div>
      
        
    )
}
export default HomePage;