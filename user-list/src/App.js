import React, {useState} from "react";
import './App.css';
import {orderBy} from "lodash";
import sortArrow from "./elements/sort_arrow.svg";

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
    const [sortDirection, setDirection] = useState('asc');

    const sortByColumn = (column) => {
        setSortBy(column);
        setDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortedCollection = orderBy(
        USERS,
        [sortBy],
        [sortDirection]
    );

    let arrowStyle;
    if (sortDirection === 'desc') {
        arrowStyle = {transform: "rotateX(180deg)"}
    }

    return (
        <div className="list">
            <table>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th data-name="firstName" onClick={() => sortByColumn("firstName")}>
                        First name
                        {sortBy === "firstName" &&
                            <img style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>
                    <th onClick={() => sortByColumn("lastName")}>
                        Last name
                        {sortBy === "lastName" &&
                            <img style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>
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

// SOURCES:
//
// SORTING
// Inspiration for adding sorting to the list
// https://jetrockets.pro/blog/creating-sortable-list-with-react-redux-and-reselect
//
// lodash library for easy sorting
// https://www.npmjs.com/package/lodash
//
//
// Conditional rendering
// https://reactjs.org/docs/conditional-rendering.html?fbclid=IwAR3Nu5SDXMZ4yrBxZ86vnCRLchjlDdDgm0m9Lg3yi89WtVsPgS3I3b763Rw#inline-if-with-logical--operator1