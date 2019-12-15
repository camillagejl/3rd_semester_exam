import React, {useState} from "react";

export default function UserObject(props) {
    return (
        <div className="list">
            {
                props.posts.map(post => {
                    return <User firstName={post.firstName} lastName={post.lastName}/>;
                })}
        </div>
    )
}

function User(props) {
    return (
        <tr className="user">
            <td className="user_detail">{props.firstName}</td>
            <td className="user_detail">{props.lastName}</td>
        </tr>
    )
}