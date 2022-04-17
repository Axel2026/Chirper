import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import moment from "moment";

function SingleNewUser({id, nickname, picture, createdAt, locationIp}) {

    const [userCountryCode, setUserCountryCode] = useState();

    let formattedDate = moment(createdAt).format("MMMM Do YYYY HH:mm");
    const {isAuthenticated, isLoading} = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        getUserFlag()
    }, []);

    function getUserFlag() {
        axios.get(`http://api.ipapi.com/${locationIp}?access_key=212968b20952fcd076e89ebbc456ba94`).then((response) => {
            let data = response.data;
            setUserCountryCode(data.country_code)
        }).catch((error) => {
            console.log(error);
        });
    }

    function NavigateToProfile() {
        navigate(`/profile/${id}`);
        window.location.reload()
    }

    if (isLoading || userCountryCode === undefined) {
        return <div></div>;
    } else {
        return (
            isAuthenticated && (
                <div className="new-users__display_new" onClick={() => NavigateToProfile()}>

                    <div className="blog_post_avatar_div">
                        <div className="blog_post_avatar"><img
                            className="blog_post_avatar" src={picture} alt="user_avatar"/></div>
                    </div>

                    <div className="new_user_container">
                        <div className="new_user_nickname">{nickname}</div>
                        <img className="new_user_flag" alt="United States"
                             src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${userCountryCode}.svg`}/>
                    </div>
                    <div className="new_user_created_at">Since: {formattedDate}</div>
                </div>
            )
        )
    }
}

export default SingleNewUser;
