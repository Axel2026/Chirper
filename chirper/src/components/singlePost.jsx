import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import trashIcon from "../images/trash_icon.png"
import {useAuth0} from "@auth0/auth0-react";
import moment from "moment";
import LoadingSpin from "react-loading-spin";

function SinglePost({id, userId, content, date, time, refreshPosts, likedBy, chirpIndex}) {

    const [liked, setLiked] = useState(false);
    const [likedByArray, setLikedByArray] = useState(likedBy);
    const [userData, setUserData] = useState();

    const {isAuthenticated, isLoading, user} = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        getUserData();
        setLiked(likedByArray.includes(user.sub));
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

    function getPostTime() {
        return moment(date + time, "DD[.]MM[.]YYYY HH:mm:ss").fromNow();
    }

    function NavigateToProfile() {
        navigate(`/profile/${userId}`);
    }

    function deletePost() {
        axios({
            url: `http://localhost:3001/api/feed/deletepost/${id}`,
            method: 'DELETE',
        }).catch((e) => {
            console.warn(e);
        });
        refreshPosts()
    }

    function likePost() {
        axios({
            url: 'http://localhost:3001/api/feed/updatelikes',
            method: 'POST',
            data: {
                isLiked: liked,
                postId: id,
                userId: user.sub
            }
        })
            .then((response) => {
                setLikedByArray(response.data.likedBy)
            })
            .catch(() => {
                console.log('Internal server error');
            });
    }

    if (isLoading || userData === undefined) {
        if (chirpIndex === 0) {
            return <LoadingSpin primaryColor="#1E80CD" secondaryColor="#FFFFFF"/>;
        } else {
            return <div></div>
        }
    } else {
        return (
            isAuthenticated && (
                <div className="blog-post__display_new">

                    <div className="blog_post_avatar_div">
                        <div className="blog_post_avatar" onClick={() => NavigateToProfile()}><img
                            className="blog_post_avatar" src={userData.picture} alt="user_avatar"/></div>
                    </div>

                    <div className="blog_post_full">
                        <div className="blog_post_header">
                            <div className="blog_post_nickname"
                                 onClick={() => NavigateToProfile()}>{userData.nickname}</div>
                            <div className="blog_post_postTime">&nbsp;·&nbsp;{getPostTime()}</div>
                            {user.sub === userId ?
                                <img className="blog_post_delete" src={trashIcon} onClick={() => deletePost()}
                                     alt="Avatar"/> : false}
                        </div>

                        <div className="blog_post_content">
                            {content}
                        </div>
                        <div className="blog_post_engagement">
                            <div>
                                {liked ? <img onClick={likePost} className="blog_post_heart" id="imageHeart"
                                              src="https://icons.iconarchive.com/icons/succodesign/love-is-in-the-web/256/heart-icon.png"
                                              alt="like_heart"/> :
                                    <img onClick={likePost} className="blog_post_heart" id="imageHeart"
                                         src="https://emojigraph.org/media/google/white-heart_1f90d.png"
                                         alt="like_heart"/>}
                                {likedByArray.length}
                            </div>
                        </div>
                    </div>
                </div>
            )
        )
    }
}

export default SinglePost;
