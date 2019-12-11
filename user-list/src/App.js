import React, {useState} from "react";
import './App.css';
import {orderBy} from "lodash";
import {filter} from "lodash";
import sortArrow from "./elements/sort_arrow.svg";

// Placeholder user data
// NOTE: dateOfBirth needs to be a proper date, so it can be sorted properly and not just
// by numbers.
const USERS = [
    {
        id: 1,
        userName: "WSmith",
        email: "will@smith.com",
        firstName: "Will",
        lastName: "Smith",
        dateOfBirth: "05/09/1995",
        country: "Denmark",
        emailSub: "false"
    },
    {
        id: 2,
        userName: "Carlton",
        email: "Carlton@smith.com",
        firstName: "Carlton",
        lastName: "Banks",
        dateOfBirth: "15/09/1995",
        country: "Denmark",
        emailSub: "false"
    },
    {
        id: 3,
        userName: "Dwayne",
        email: "Dwayne@smith.com",
        firstName: "Dwayne",
        lastName: "Johnson",
        dateOfBirth: "13/09/1995",
        country: "Romania",
        emailSub: "false"
    },
    {
        id: 4,
        userName: "Harry",
        email: "Harry@smith.com",
        firstName: "Harry",
        lastName: "Potter",
        dateOfBirth: "23/09/1995",
        country: "Romania",
        emailSub: "true"
    },
    {
        id: 5,
        userName: "Katniss",
        email: "Katniss@smith.com",
        firstName: "Katniss",
        lastName: "Everdeen",
        dateOfBirth: "06/09/1995",
        country: "United Kingdom",
        emailSub: "true"
    },
    {
        id: 6,
        userName: "Barbara",
        email: "Barbara@smith.com",
        firstName: "Barbara",
        lastName: "Roberts",
        dateOfBirth: "21/09/1995",
        country: "Japan",
        emailSub: "false"
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
    // ----- SORT BY -----
    // Defines useStates for sortBy (the key from the header that is clicked) and
    // sortDirection (toggles between ascending and descending on click).
    const [sortBy, setSortBy] = useState('userName');
    const [sortDirection, setDirection] = useState('asc');

    // Sets useStates on click on one of the column headers.
    const sortByColumn = (column) => {
        console.log("Sorting");
        setSortBy(column);
        setDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    // orderBy (from 'lodash' library)
    const sortedCollection = orderBy(
        USERS,
        [sortBy],
        [sortDirection]
    );

    // The "sort arrow" next to the the clicked header rotates 180deg if the sortDirection
    // is descending. If not, the arrow will not be styled.
    let arrowStyle;
    if (sortDirection === 'desc') {
        arrowStyle = {transform: "rotateX(180deg)"}
    }

    // ----- FILTER BY -----

    const [filterBy, setFilterBy] = useState('All');
    const [filterColumn, setFilterColumn] = useState('All');

    const filterByColumn = (column, event) => {
        console.log("Changing", column, event);
        setFilterBy(event.target.value);
        setFilterColumn(column);
    };

    let filteredCollection;
    if (filterBy === 'All') {
    filteredCollection = filter(
        sortedCollection
    );
    }

    else {
    filteredCollection = filter(
        sortedCollection,
        [filterColumn, filterBy]
    );
    }

    // ----- LIST COMPONENT -----
    return (
        <div className="list">

            <label>
                Filter by country:
                <select onChange={(e) => filterByColumn("country", e)} name="filterByCountry" className="filterByCountry">
                    <option value="All">All</option>
                    <option value="Denmark">Denmark</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Romania">Romania</option>
                    <option value="Japan">Japan</option>
                </select>
            </label>

            <label>
                Filter by email subscription:
                <select onChange={(e) => filterByColumn("emailSub", e)} name="filterByEmailPrefs" className="filterByEmailPrefs">
                    <option value="All">All</option>
                    <option value="true">&#10003; Subscribed</option>
                    <option value="false">&times; Not subscribed</option>
                </select>
            </label>



            <table>
                <thead>

                {/*Headers for the table - sorts on click*/}
                <tr>

                    {/* onClick runs SortByColumn-function with userName as parameter. */}
                    <th onClick={() => sortByColumn("userName")}>
                        Username

                        {/* If sortBy is set to userName, this function will return true and
                        display the arrow.*/}
                        {sortBy === "userName" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("email")}>
                        Email
                        {sortBy === "email" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("firstName")}>
                        First name
                        {sortBy === "firstName" &&
                            <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("lastName")}>
                        Last name
                        {sortBy === "lastName" &&
                            <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("dateOfBirth")}>
                        Date of birth
                        {sortBy === "dateOfBirth" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("country")}>
                        Country
                        {sortBy === "country" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("emailSub")}>
                        Email subscription
                        {sortBy === "emailSub" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>
                </tr>
                </thead>
                <tbody>

                {/* This should ideally be in a seperate file, but I could not make that work
                 for now. */}
                {filteredCollection.map(user => (

                    <tr key={user.id}>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.dateOfBirth}</td>
                        <td>{user.country}</td>
                        <td>{user.emailSub}</td>
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