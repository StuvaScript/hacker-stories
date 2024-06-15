const list = [
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

function App() {
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <label htmlFor="search">Search: </label>
      <input type="text" id="search" />
      <hr />

      <ul>
        {list.map((item) => (
          <li key={item.objectID}>
            <h2>{item.title}</h2>
            <a href={item.url} target="_blank">
              Visit {item.title} Site
            </a>
            <p>Authors: {item.author}</p>
            <p>Comments: {item.num_comments}</p>
            <p>Points: {item.points}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
