import React, {useState,useEffect} from "react";
import './App.css';
import {orderBy} from "lodash";
import {filter} from "lodash";
import sortArrow from "./elements/sort_arrow.svg";

function Header() {
    return (
        <div className="header">
            <header>
                <h1>WORLD GAME USERS</h1>
                <p>
                    Welcome to the user list for World Game.
                </p>
                <p>
                    On this page, you can view all users, filter and sort your view, and delete users.
                </p>
            </header>
        </div>
    )
}

function List() {
    // LOADING CURSOR
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // ----- GET USERS FROM DATABASE -----
    const [users, setUsers] = useState([]);

    useEffect(()=>{
        get()
    },[]);

    // Sets useStates on click on one of the column headers.
    function get() {
        fetch("https://eexam-6f38.restdb.io/rest/website-users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=uf-8",
                "x-apikey": "5dde99ff4658275ac9dc1fce",
                "cache-control": "no-cache"
            }
        })
            .then(e => e.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    }

    // Function to remove users
    const removeUser = (id) => {
        setLoading(true);
        setDeletingId(id);
        fetch("https://eexam-6f38.restdb.io/rest/website-users/" + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": "5dde99ff4658275ac9dc1fce",
                    "cache-control": "no-cache"
                }
            })
            .then(res => res.json())
            .then(function() {
                console.log("Deleted!");
                get();
            })
    };

    // ----- SORT BY -----
    // Defines useStates for sortBy (the key from the header that is clicked) and
    // sortDirection (toggles between ascending and descending on click).
    const [sortBy, setSortBy] = useState("userName");
    const [sortDirection, setDirection] = useState('asc');

    const sortByColumn = (column) => {
        setSortBy(column);
        setDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    // orderBy (from 'lodash' library)
    const sortedCollection = orderBy(
        users,
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

    const [countryFilter, setCountryFilter] = useState('All');
    const [emailSubFilter, setEmailSubFilter] = useState('All');

    const filterByCountry = (event) => {
        console.log("Changing Country", event.target.value);
        setCountryFilter(event.target.value);
    };

    const filterByEmailSub = (event) => {
        console.log("Changing emailSub", event.target.value);
        setEmailSubFilter(event.target.value);
    };

    let filteredCollection = sortedCollection;
    if (countryFilter !== 'All') {
        filteredCollection = filter(
            filteredCollection,
            ["country", countryFilter]
        );
    }

    if (emailSubFilter !== 'All') {
        filteredCollection = filter(
            filteredCollection,
            ["subscription", emailSubFilter]
        );
    }

    // ----- LIST COMPONENT -----

    return (
        <div className={`list ${loading ? "loading" : ""}`}>
            <div className="dropdowns">
            <label>
                Filter by country:
                <select onChange={filterByCountry} name="filterByCountry" className="filter_by filter_country">
                    <option value="All">All</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Germany">Germany</option>
                    <option value="Romania">Romania</option>
                    <option value="Sweden">Sweden</option>
                </select>
            </label>

            <label>
                Filter by email subscription:
                <select onChange={filterByEmailSub} name="filterByEmailPrefs" className="filter_by filter_email">
                    <option value="All">All</option>
                    <option value="Subscribed">&#10003; Subscribed</option>
                    <option value="Not Subscribed">&times; Not subscribed</option>
                </select>
            </label>
            </div>


            <table>
                <thead>

                {/*Headers for the table - sorts on click*/}
                <tr>

                    {/* onClick runs SortByColumn-function with userName as parameter. */}
                    <th onClick={() => sortByColumn("username")}>
                        Username

                        {/* If sortBy is set to username, this function will return true and
                        display the arrow.*/}
                        {sortBy === "username" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("email")}>
                        Email
                        {sortBy === "email" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("firstname")}>
                        First name
                        {sortBy === "firstname" &&
                            <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("lastname")}>
                        Last name
                        {sortBy === "lastname" &&
                            <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("dateofbirth")}>
                        Date of birth
                        {sortBy === "dateofbirth" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("country")}>
                        Country
                        {sortBy === "country" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th onClick={() => sortByColumn("subscription")}>
                        Email subscription
                        {sortBy === "subscription" &&
                        <img className="sortArrow" style={arrowStyle} src={sortArrow} alt="Sorting arrow"/>
                        }
                    </th>

                    <th className="delete_user_th">
                        Delete user
                    </th>
                </tr>
                </thead>
                <tbody>


                {/* This should ideally be in a seperate file, but I could not make that work
                 for now. */}
                {filteredCollection.map(user => (

                    <tr key={user._id} className={deletingId === user._id ? "deleting" : ""}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>
                        <td>{user.dateofbirth.slice(0,10)}</td>
                        <td>{user.country}</td>
                        <td>{user.subscription}</td>
                        {deletingId === user._id ?
                            <td className="delete_user">&times; Deleting</td>
                            :
                            <td className="delete_user" onClick={() => removeUser(user._id)}>&times; Delete</td>
                        }
                    </tr>

                ))}
                </tbody>
            </table>
        </div>
    )
}

function MobilePopup() {

    const [showingPopup, setShowingPopup] = useState(true);

    console.log(showingPopup);

    return (
        <div className={`${showingPopup ? "mobile_popup" : "hidden"}`}>
            <strong>Welcome to the World Games user list!</strong>
            <p>This user list is created for desktop. Please use a desktop for the best experience.</p>
            <p>If you wish continue on your current device, we recommend switching to landscape mode.</p>
            <button onClick={() => setShowingPopup(false)}>Continue to the list</button>
        </div>
    )
}

function App() {
    return (
        <div className={`App`}>
            <Header/>
            <List direction="asc"/>
            <MobilePopup/>
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
// Conditional rendering
// https://reactjs.org/docs/conditional-rendering.html?fbclid=IwAR3Nu5SDXMZ4yrBxZ86vnCRLchjlDdDgm0m9Lg3yi89WtVsPgS3I3b763Rw#inline-if-with-logical--operator1
//
// Adding class to popup depending on useState
// https://codesandbox.io/s/vv3qnlx347?fontsize=14