// /* eslint react/prop-types: "off" */

import { useState } from "react";

// import PropTypes from "prop-types";

const App = () => {
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const handleSearch = (event) => {
    console.log(event.target.value);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch} />

      <hr />

      <List list={stories} />
    </div>
  );
};
export default App;

const List = (props) => (
  <ul>
    {props.list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

function Item({ item }) {
  return (
    <li>
      <h2>{item.title}</h2>
      <a href={item.url} target="_blank">
        Visit {item.title} Site
      </a>
      <p>Authors: {item.author}</p>
      <p>Comments: {item.num_comments}</p>
      <p>Points: {item.points}</p>
    </li>
  );
}

// List.propTypes = {
//   list: PropTypes.arrayOf(
//     PropTypes.exact({
//       title: PropTypes.string,
//       url: PropTypes.string,
//       author: PropTypes.string,
//       num_comments: PropTypes.number,
//       points: PropTypes.number,
//       objectID: PropTypes.number,
//     })
//   ),
// };

const Search = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

  function handleChange(event) {
    setSearchTerm(event.target.value);

    props.onSearch(event);
  }

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input type="text" id="search" onChange={handleChange} />

      <p>
        Seaching for <strong>{searchTerm}</strong>.
      </p>
    </div>
  );
};
