import React, {useEffect, useState} from 'react';
import "../App.scss"
import axios from "axios";
import SinglePost from "./singlePost";

const Posts = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getBlogPosts();
    }, [])

    function getBlogPosts() {
        axios.get('http://localhost:3001/api/feed/posts')
            .then((response) => {
                setPosts(response.data);
                console.log('Posts have been received!');
            })
            .catch(() => {
                alert('Error retrieving posts!');
            });
    }

    const refreshPosts = () => {
        getBlogPosts();
    };

    function displayBlogPosts() {
        if (!posts.length) return null;

        return posts.slice(0).reverse().map((post, index) => (
            <SinglePost key={post._id.toString()}
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

    return (
        <div>
            {displayBlogPosts()}
        </div>
    )
};


export default Posts;
