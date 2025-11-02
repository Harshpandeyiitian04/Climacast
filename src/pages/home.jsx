import Header from "../components/layout/header";
import SearchBar from "../components/search/searchbar";
import Dashboard from "../components/dashboard/dashboard";

function Home() {
  return (
    <div>
      <Header />
      <SearchBar />
      <Dashboard />
    </div>
  );
}

export default Home;
