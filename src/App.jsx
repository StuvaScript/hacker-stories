import { useEffect, useReducer, useRef, useState } from "react";

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  // const initialStories = [
  //   {
  //     title: "React",
  //     url: "https://reactjs.org/",
  //     author: "Jordan Walke",
  //     num_comments: 3,
  //     points: 4,
  //     objectID: 0,
  //   },
  //   {
  //     title: "Redux",
  //     url: "https://redux.js.org/",
  //     author: "Dan Abramov, Andrew Clark",
  //     num_comments: 2,
  //     points: 5,
  //     objectID: 1,
  //   },
  // ];

  // const getAsyncStories = () =>
  //   new Promise((resolve) =>
  //     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  //   );

  const getAsyncStories = () =>
    new Promise((resolve, reject) => setTimeout(reject, 2000));

  // const setStories = "SET_STORIES";
  const removeStory = "REMOVE_STORY";
  const storiesFetchInit = "STORIES_FETCH_INIT";
  const storiesFetchSuccess = "STORIES_FETCH_SUCCESS";
  const storiesFetchFailure = "STORIES_FETCH_FAILURE";

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case storiesFetchInit:
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case storiesFetchSuccess:
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case storiesFetchFailure:
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case removeStory:
        return {
          ...state,
          data: state.data.filter(
            (story) => action.payload.objectID !== story.objectID
          ),
        };
      default:
        throw new Error();
    }
  };

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    dispatchStories({ type: storiesFetchInit });

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: storiesFetchSuccess,
          payload: result.data.stories,
        });
      })
      .catch(() => dispatchStories({ type: storiesFetchFailure }));
  }, []);

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item,
    });
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};
export default App;

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <h2>{item.title}</h2>
    <a href={item.url} target="_blank">
      Visit {item.title} Site
    </a>
    <p>Authors: {item.author}</p>
    <p>Comments: {item.num_comments}</p>
    <p>Points: {item.points}</p>
    <button type="button" onClick={() => onRemoveItem(item)}>
      Dismiss
    </button>
  </li>
);

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        type={type}
        id={id}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};
