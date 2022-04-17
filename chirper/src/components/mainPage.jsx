import React, {useState} from 'react';
import axios from 'axios';
import {AwesomeButton} from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import Posts from "./posts";

const MainPage = () => {

    const [newPostContent, setNewPostContent] = useState('');

    const {isAuthenticated, isLoading, user} = useAuth0();
    const navigate = useNavigate();

    function NavigateLogin() {
        navigate('/login');
    }

    function createPost() {
        if (newPostContent.length !== 0) {
            console.log("asdasdasdasd")
            const newPostData = {
                author: user.nickname,
                userId: user.sub,
                content: newPostContent,
            };

            axios({
                url: 'http://localhost:3001/api/feed/save',
                method: 'POST',
                data: newPostData
            }).catch(() => {
                console.warn('Internal server error');
            });
        }
    }

    if (isLoading) {
        return <div></div>;
    } else if (!isAuthenticated) {
        return <div>{NavigateLogin()}</div>;
    } else {
        return (<div id="mainPageDiv">
            <form>
                <div className="form-input">
                        <textarea maxlength="150" className="chirpBody" placeholder="What's up?" name="content"
                                  onChange={e => setNewPostContent(e.target.value)}/>
                    <AwesomeButton type="primary" onPress={() => createPost()}>Add Chirp</AwesomeButton>
                </div>
            </form>
            <div>
                <Posts/>
            </div>
        </div>)
    }

}

export default MainPage;
