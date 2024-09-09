import axios from "axios";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
// import styles from "./App.module.css";
import styled from "styled-components";
import Check from "./assets/check-mark.svg?react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;

  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;

  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;

    > svg > g {
      fill: #ffffff;
      stroke: #ffffff;
    }
  }

  > svg > g {
    fill: rgba(0, 0, 0, 0);
    stroke: #000000;
    stroke-width: 5;
  }
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;

  > * {
    scale: 2;
  }
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;

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

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: storiesFetchInit });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: storiesFetchSuccess,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: storiesFetchFailure });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = (event) => setSearchTerm(event.target.value);

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item,
    });
  };

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </StyledContainer>
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
  <StyledItem>
    <StyledColumn width="40%">
      <a href={item.url} target="_blank">
        {item.title}
      </a>
    </StyledColumn>
    <StyledColumn width="30%">{item.author}</StyledColumn>
    <StyledColumn width="10%">{item.num_comments}</StyledColumn>
    <StyledColumn width="10%">{item.points}</StyledColumn>
    <StyledColumn width="10%">
      <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
        <Check height="18px" width="18px" />
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
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
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      <StyledInput
        ref={inputRef}
        type={type}
        id={id}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    &nbsp;
    <StyledButtonLarge type="submit" disabled={!searchTerm}>
      <FaMagnifyingGlass />
    </StyledButtonLarge>
  </StyledSearchForm>
);
