import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import Modal from 'react-bootstrap/Modal'

function SingleHotPost({currentUserId, id, userId, content, date, time, likedBy}) {

    const [userData, setUserData] = useState();
    const [modalOpened, setModalOpened] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likedByArray, setLikedByArray] = useState(likedBy);

    const {isAuthenticated, isLoading} = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        getUserData();
        setLiked(likedByArray.includes(currentUserId));
    }, [likedByArray]);

    function getUserData() {
        axios({
            url: `http://localhost:3001/api/user/getinfo/${userId}`,
            method: 'GET',
        })
            .then((response) => {
                setUserData(response.data);
            })
            .catch(() => {
                console.log('Internal server error');
            });
    }

    function likePost() {
        axios({
            url: 'http://localhost:3001/api/feed/updatelikes',
            method: 'POST',
            data: {
                isLiked: liked,
                postId: id,
                userId: currentUserId
            }
        })
            .then((response) => {
                setLikedByArray(response.data.likedBy)
            })
            .catch(() => {
                console.log('Internal server error');
            });
    }

    function navigateToProfile() {
        navigate(`/profile/${userId}`)
        setModalOpened(!modalOpened)
        window.location.reload()
    }

    function shortenString(stringToBeShortened, maxLength) {
        return (stringToBeShortened.length > maxLength) ? stringToBeShortened.substr(0, maxLength - 1) + '...' : stringToBeShortened;
    }

    if (isLoading || userData === undefined) {
        return <div></div>;
    } else {
        return (
            isAuthenticated && (
                <div>


                    <Modal show={modalOpened} fullscreen={true} className="hot_post_modal">
                        <div className="post_details_container">
                            <div id="hot_post_exit_details" onClick={() => setModalOpened(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="bi bi-x-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path
                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                            <div className="post_details_avatar_nickname_container" onClick={() => navigateToProfile()}>
                                <img className="hot_post_details_avatar" src={userData.picture} alt="user_avatar"/>
                                <div className="post_details_nickname"
                                     onClick={() => navigateToProfile()}>{userData.nickname}</div>
                            </div>
                            <div className="post_details_post_container">
                                <div className="blog_post_content">
                                    {content}
                                </div>
                            </div>
                            <div className="post_details_likes_date">
                                <div className="post_details_likes">
                                    {liked ? <img onClick={likePost} className="blog_post_heart" id="imageHeart"
                                                  src="https://icons.iconarchive.com/icons/succodesign/love-is-in-the-web/256/heart-icon.png"
                                                  alt="like_heart"/> :
                                        <img onClick={likePost} className="blog_post_heart" id="imageHeart"
                                             src="https://emojigraph.org/media/google/white-heart_1f90d.png"
                                             alt="like_heart"/>}
                                    {likedByArray.length}</div>
                                <div className="post_details_time">{time}</div>
                                <div className="post_details_date">{date}</div>
                            </div>
                        </div>
                    </Modal>


                    <div className="hot-post__display_new">

                        <div className="blog_post_avatar_div">
                            <div className="blog_post_avatar" onClick={() => navigateToProfile()}><img
                                className="blog_post_avatar" src={userData.picture} alt="user_avatar"/></div>
                        </div>

                        <div className="blog_post_full">
                            <div className="blog_post_header">
                                <div className="blog_post_nickname"
                                     onClick={() => navigateToProfile()}>{userData.nickname}</div>
                            </div>

                            <div className="blog_post_content" onClick={() => setModalOpened(!modalOpened)}>
                                {shortenString(content, 35)}
                            </div>
                        </div>
                    </div>
                </div>
            )
        )
    }
}

export default SingleHotPost;
