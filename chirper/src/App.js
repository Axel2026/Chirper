import * as React from "react"
import Login from "./components/login"
import Navbar from "./components/navbar";
import MainPage from "./components/mainPage";
import {BrowserRouter, Routes, Route, Navigate, useParams} from "react-router-dom";
import HotPosts from "./components/hotPosts";
import Profile from "./components/profile";
import {isExpired} from "react-jwt";
import {Auth0Provider} from "@auth0/auth0-react";
import NewUsers from "./components/newUsers";

function App() {

    return (
        <Auth0Provider
            domain="dev-pgnp7k35.us.auth0.com"
            clientId="u0T3wNlb1hQd5diX6qtaFpNEGjVsjzFi"
            redirectUri="http://localhost:3000/"
        >
            <BrowserRouter>
                <React.StrictMode>
                    <Routes>
                        <Route path="/" element={<><Navbar/><MainPage/><HotPosts/><NewUsers/></>}/>
                        <Route path="/profile/:userid" element={<><Navbar/><Profile/><HotPosts/><NewUsers/></>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </React.StrictMode>
            </BrowserRouter>
        </Auth0Provider>
    )
}

export default App;
