import React, {useState} from "react";
import './App.css';
import {orderBy} from "lodash";

const USERS = [
    {
        id: 1,
        userName: "WSmith",
        email: "will@smith.com",
        firstName: "Will",
        lastName: "Smith",
        dateOfBirth: "15/09/1995",
        address: "Smithsroad 123"
    },
    {
        id: 2,
        userName: "WSmith",
        email: "will@smith.com",
        firstName: "Carlton",
        lastName: "Banks",
        dateOfBirth: "15/09/1995",
        address: "Smithsroad 123"
    },
    {
        id: 3,
        userName: "WSmith",
        email: "will@smith.com",
        firstName: "Dwayne",
        lastName: "Johnson",
        dateOfBirth: "15/09/1995",
        address: "Smithsroad 123"
    },
    {
        id: 4,
        userName: "WSmith",
        email: "will@smith.com",
        firstName: "Harry",
        lastName: "Potter",
        dateOfBirth: "15/09/1995",
        address: "Smithsroad 123"
    },
    {
        id: 5,
        userName: "WSmith",
        email: "will@smith.com",
        firstName: "Katniss",
        lastName: "Everdeen",
        dateOfBirth: "15/09/1995",
        address: "Smithsroad 123"
    }
];


function Header() {
    return (
        <div className="header">
            <header>
                <h1>WORLD GAME USERS</h1>
            </header>
        </div>
    )
}

function List() {

    const [sortBy, setSortBy] = useState('firstName');

    const sortByFirstName = () => {
        setSortBy('firstName');
        updateDirection();
    };

    const sortByLastName = () => {
        setSortBy('lastName');
        updateDirection();
    };


    const [sortDirection, setDirection] = useState('asc');
    const updateDirection = () => {
        setDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortedCollection = orderBy(
        USERS,
        [sortBy],
        [sortDirection]
    );

    return (
        <div className="list">
            <table>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th onClick={sortByFirstName}>First name</th>
                    <th onClick={sortByLastName}>Last name</th>
                    <th>Date of birth</th>
                    <th>Address</th>
                </tr>
                </thead>
                <tbody>

                {sortedCollection.map(user => (

                    <tr key={user.id}>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.dateOfBirth}</td>
                    <td>{user.address}</td>
                    </tr>

                ))}
                </tbody>
            </table>
        </div>
    )
}


function App() {
    return (
        <div className="App">
            <Header/>
            <List direction="asc"/>
        </div>
    );
}

export default App;