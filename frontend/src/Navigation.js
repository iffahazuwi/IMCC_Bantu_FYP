import { Link, useMatch, useResolvedPath } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import './App.css';
import axios from './axios';

export default function Navigation() {

    const [userType, setUserType] = useState('');

    useEffect(() => {

        const fetchUserRole = async () => {
            try{
                const response = await axios.get('http://localhost:5000/getUserRole', {withCredentials: true});
                setUserType(response.data.type);
            } catch (error){
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    return (userType === "admin" || userType === "student") ? (
        <nav className="nav">
            <Link to="/home" className="site-title">
                <img src="./USM_Logo.png" alt="" width={36} height={36}/>
                <img src="./Latest_IMCC-Logo-2017.png" alt="" width={36} height={36}/>
                IMCC Bantu
            </Link>
            <ul>
                <CustomLink to="/matching-page">Matching Page</CustomLink>
                <CustomLink to="/community-page">Community Page</CustomLink>
                <CustomLink to="/user-page">User Page</CustomLink>
            </ul>
        </nav>
    ) : (
        <nav className="nav-2">
            <div className="site-title-2 pt-1 pb-1"><img src="./universiti-sains-malaysia-logo-AFF9957016-seeklogo.com.png" alt="" width={120} height={60}/></div>
            <div className="site-title-2">IMCC Bantu: Match Made in Heaven</div>
            <div className="site-title-2 pt-1 pb-1"><img src="./Latest_IMCC-Logo-2017 (1).png" alt="" width={140} height={60}/></div>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to}{...props}>
                {children}
            </Link>
        </li>
    )
}