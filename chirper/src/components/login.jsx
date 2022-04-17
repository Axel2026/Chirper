import React, {useEffect} from 'react';
import "../App.scss"
import {useAuth0} from "@auth0/auth0-react";

const Login = () => {

    const {loginWithRedirect} = useAuth0();

    useEffect(() => {
        loginWithRedirect()
    }, [])

    return (
        <div id="loginBackground">
        </div>
    )
};


export default Login;
