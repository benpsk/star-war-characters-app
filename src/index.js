import React, { useCallback, useReducer } from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import CharacterList from "./CharacterList";
import CharacterView from "./CharacterView";

import URL from "./endpoint";
import "./styles.scss";

const initialState = {
  characters: [],
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  if (action.type === "LOADING") {
    return {
      characters: [],
      loading: true,
      error: null,
    };
  }

  if (action.type === "RESPONSE_COMPLETE") {
    return {
      characters: action.payload.characters,
      loading: false,
      error: null,
    };
  }

  if (action.type === "ERROR") {
    return {
      characters: [],
      loading: false,
      error: action.payload.error,
    };
  }

  return state;
};

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = useCallback(
    (action) => {
      if (typeof action === "function") {
        action(dispatch);
      } else {
        dispatch(action);
      }
    },
    [dispatch]
  );
  return [state, enhancedDispatch];
};

const fetchCharacters = (dispatch) => {
  dispatch({ type: "LOADING" });

  const fetchUrl = async () => {
    try {
      const response = await fetch(URL + "/characters");
      const data = await response.json();
      dispatch({
        type: "RESPONSE_COMPLETE",
        payload: { characters: data.characters },
      });
    } catch (error) {
      dispatch({ type: "ERROR", payload: { error } });
    }
  };

  fetchUrl();
};

const Application = () => {
  // const [response, loading, error] = useFetch(URL + "/characters");
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters } = (state && state) || [];

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button onClick={() => dispatch(fetchCharacters)}>
            Fetch Characters
          </button>
          <CharacterList characters={characters} />
        </section>
        <section className="CharacterView">
          <Routes>
            <Route path="/characters/:id" element={<CharacterView />} />
          </Routes>
        </section>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Application />
  </Router>
);
