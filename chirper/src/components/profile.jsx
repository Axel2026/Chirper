import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router-dom";
import SinglePost from "./singlePost";
import {useAuth0} from "@auth0/auth0-react";
import edit_profile_icon from "../images/edit_profile_icon.png"
import LoadingSpin from "react-loading-spin";

const Profile = () => {

    const [userData, setUserData] = useState();
    const [userPosts, setUserPosts] = useState([]);
    const [userBio, setUserBio] = useState();
    const [showBioEdit, setShowBioEdit] = useState(false);
    const [editedBioContent, setEditedBioContent] = useState();

    const {isAuthenticated, isLoading, user} = useAuth0();
    const {userid} = useParams();

    useEffect(() => {
        getUserData();
        getBio();
        getUserPosts();
    }, []);

    function getUserData() {
        axios({
            url: `http://localhost:3001/api/user/getinfo/${userid}`,
            method: 'GET',
        })
            .then((response) => {
                setUserData(response.data);
            })
            .catch(() => {
                console.log('Internal server error');
            });
    }

    function getUserPosts() {
        axios.get(`http://localhost:3001/api/feed/userposts/${userid}`)
            .then((response) => {
                setUserPosts(response.data)
                console.log('Data has been received!');
            })
            .catch(() => {
                alert('Error retrieving data!');
            });
    }

    function getBio() {
        axios.get(`http://localhost:3001/api/user/getbio/${userid}`)
            .then((response) => {
                setUserBio(response.data.content)
                console.log('Data has been received!');
            })
            .catch(() => {
                alert('Error retrieving data!');
            });
    }

    const refreshPosts = () => {
        getUserPosts();
    };

    function displayBlogPost() {
        if (!userPosts.length) return null;

        return userPosts.slice(0).reverse().map((post, index) => (
            <SinglePost
                key={post._id.toString()}
                id={post._id}
                userId={post.userId}
                content={post.content}
                date={post.date}
                time={post.time}
                refreshPosts={refreshPosts}
                likedBy={post.likedBy}
                chirpIndex={index}
            />
        ));
    }

    function editBio() {
        axios({
            url: 'http://localhost:3001/api/user/editbio',
            method: 'PUT',
            data: {
                content: editedBioContent,
                userId: userid
            }
        })
            .then(() => {
                setShowBioEdit(!showBioEdit)
                window.location.reload()
            })
            .catch((e) => {
                console.log('Internal server error' + e);
            });
    }

    if (isLoading || userData === undefined) {
        return <LoadingSpin primaryColor="#1E80CD" secondaryColor="#FFFFFF"/>;
    } else {
        return (
            isAuthenticated && (
                <div id="profileDiv">
                    <div id="backgroundPhotoProfile">
                        <img className="backgroundPhotoProfileImg"
                             src={userData.picture} alt="Avatar"/>
                    </div>
                    <div id="photoProfile">
                        <div className="photoProfileImg"><img className="photoProfileImg" src={userData.picture}
                                                              alt="profile_picture"/></div>
                    </div>
                    <div id="aboutMeProfile">
                        <div
                            id="profileName">{userData.nickname}</div>
                        <div id="profileDescription">{userBio}{showBioEdit &&
                        <textarea className="showBioEdit"
                                  onChange={e => setEditedBioContent(e.target.value)} defaultValue={userBio}/>}
                            {showBioEdit && <div className="editBioBtn" onClick={() => editBio()}>Save</div>}
                        </div>

                        {userData.nickname === user.nickname ?
                            <img className="bio_edit" src={edit_profile_icon} onClick={() => {
                                setShowBioEdit(!showBioEdit);
                            }} alt="Avatar"/> : false}
                    </div>
                    <div id="myPostsProfile">
                        <div className="blog-">
                            {displayBlogPost()}
                        </div>
                    </div>
                </div>
            )
        )
    }
}

export default Profile;
