import { useCallback, useEffect, useReducer, useRef, useState } from "react";

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
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

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = useCallback(() => {
    dispatchStories({ type: storiesFetchInit });

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: storiesFetchSuccess,
          payload: result.hits,
        });
      })
      .catch(() => dispatchStories({ type: storiesFetchFailure }));
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = (event) => setSearchTerm(event.target.value);

  const handleSearchSubmit = () => setUrl(`${API_ENDPOINT}${searchTerm}`);

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
        onInputChange={handleSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      &nbsp;
      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
        Submit
      </button>
      <hr />
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
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
    <p>
      <a href={item.url} target="_blank">
        {item.title}
      </a>
    </p>
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
