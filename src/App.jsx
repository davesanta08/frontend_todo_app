import Navbar from "./layout/Navbar";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./pages/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/" element={isAuth ? <Dashboard /> : <Hero/>} /> */}
        {/* <Route
          path="/register"
          element={isAuth ? <Dashboard /> : <Register />}
        /> */}
        {/* <Route path="/login" element={isAuth ? <Dashboard/> : <Login />} /> */}
        {/* <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Login />} /> */}
        {/* <Route path="/signout" element={isAuth ? <Signout /> : <Login />} /> */}
        {/* <Route path="/book/:bookId" element={isAuth ? <Book /> : <Login />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
