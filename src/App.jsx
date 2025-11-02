import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import DetailedView from "./components/detailedview/detailedview";
import CacheStatus from "./components/common/cachestatus";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city/:cityName" element={<DetailedView />} />
      </Routes>
      <CacheStatus />
    </Router>
  );
}

export default App;
