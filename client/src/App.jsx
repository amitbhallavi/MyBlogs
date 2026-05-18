import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import SingleProfile from "./pages/SinglePage";
import CreatePost from "./pages/CreatePost";
import ExplorePage from "./pages/Explore";
import Feed from "./pages/DashboardFeed";
import UserProfilePage from "./components/UserProfilePage";
import AuthSuccess from "./pages/AuthSuccess";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

  return "light";
};




export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <>

      <Router>

        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <Routes>

          <Route path='/' element={<Feed />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/auth/success' element={<AuthSuccess />} />
          <Route path='/explore' element={< ExplorePage />} />
          <Route path='/singleProfile/:id' element={<  SingleProfile />} />
          <Route path='/createPost' element={<  CreatePost />} />
          <Route path='/UserProfilePage' element={<  UserProfilePage />} />










        </Routes>

        <ToastContainer theme={theme} />

      </Router>

    </>
  );
}
