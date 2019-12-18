import React, {useState} from "react";

export default function Users(props) {
    return (
        <div className="list">
            {
                props.users.map(user => {
                    return <User firstName={user.firstName} lastName={user.lastName}/>;
                })}
        </div>
    )
}

function User(props) {
    return (
        <tr>
            <td>Alphonse Armored Man</td>
            <td>Elric</td>
        </tr>
    )
}