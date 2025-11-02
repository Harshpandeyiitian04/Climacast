import { useState } from "react";
import Header from "../components/layout/header";
import SearchBar from "../components/search/searchbar";
import Dashboard from "../components/dashboard/dashboard";

function Home() {
  const [searchedCities, setSearchedCities] = useState([]);

  const handleCitySelect = (cityName) => {
    if (!searchedCities.includes(cityName)) {
      setSearchedCities((prev) => [...prev, cityName]);
    }
  };

  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        <SearchBar onCitySelect={handleCitySelect} />
        <Dashboard searchedCities={searchedCities} />
      </main>
    </div>
  );
}

export default Home;