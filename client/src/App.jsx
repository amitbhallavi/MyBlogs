import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import SingleProfile from "./pages/SinglePage";
import CreatePost from "./pages/CreatePost";
import ExplorePage from "./pages/Explore";
import Feed from "./pages/DashboardFeed";
import UserProfilePage from "./components/UserProfilePage";
import AuthSuccess from "./pages/AuthSuccess";





export default function App() {

  return (
    <>

      <Router>

        <Navbar />

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

        <ToastContainer />

      </Router>

    </>
  );
}
