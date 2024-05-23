import React, { useEffect } from "react";
import { useUser } from "./usercontext";
import axios from "axios";
const API = process.env.API || 'http://localhost:4000'

const TeacherAnalytics = () => {
    const user = useUser()
    const token = user?.token
    const getAnalytics = async() => {
        const result = await axios.get(`${API}/teacher-analytics`)
    }
    useEffect(() => {
        getAnalytics()
    }, []) 
    return (
        <>
        <h3 style={{fontSize:'40px', textAlign:'center'}}>Teacher analysis</h3>
        </>
    )
}