import React from "react";
import MovieList from "./components/MovieList";
import Navbar from "./components/navbar";

const App = () => {
  return (
    <div>
      <Navbar/>
      <MovieList/>
    </div>
  );
};

export default App;
