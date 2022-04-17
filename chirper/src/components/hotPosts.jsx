import React, {useEffect, useState} from 'react';
import "../App.scss"
import axios from "axios";
import SingleHotPost from "./singleHotPost";
import {useAuth0} from "@auth0/auth0-react";

const HotPosts = () => {

    const [hotPosts, setHotPosts] = useState([]);

    const {user, isLoading} = useAuth0();

    useEffect(() => {
        getHotPosts();
    }, [])

    function getHotPosts() {
        axios.get('http://localhost:3001/api/posts/hotposts')
            .then((response) => {
                setHotPosts(response.data);
                console.log('Posts have been received!');
            })
            .catch(() => {
                alert('Error retrieving posts!');
            });
    }

    function displayHotPosts() {
        if (!hotPosts.length) return null;

        return hotPosts.slice(0).map((post) => (
            <SingleHotPost key={post._id.toString()}
                           currentUserId={user.sub}
                           id={post._id}
                           userId={post.userId}
                           content={post.content}
                           date={post.date}
                           time={post.time}
                           likedBy={post.likedBy}
            />
        ));
    }

    if (!isLoading) {
        return (
            <div id="hotPostsDiv">
                <div className="side_component_title">Hot posts</div>
                <div className="hot_posts_container">{displayHotPosts()}</div>
            </div>
        );
    } else {
        return <div></div>
    }
}


export default HotPosts;
