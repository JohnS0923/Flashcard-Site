import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateSet from "./pages/CreateSet";
import CreateFolder from "./pages/CreateFolder";
import SetDisplay from "./pages/SetDisplay";
import FolderDisplay from "./pages/FolderDisplay";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import axios from "axios";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // axios
    //   .get("https://localhost:7056/WeatherForecast")
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="login" element={<Login />}></Route>
          <Route path="signup" element={<SignUp />}></Route>
          <Route
            path="/"
            element={
              <>
                <Navbar></Navbar>
                <Home></Home>
              </>
            }
          ></Route>
          <Route
            path="createSet"
            element={
              <>
                <Navbar></Navbar>
                <CreateSet></CreateSet>
              </>
            }
          ></Route>
          <Route
            path="createFolder"
            element={
              <>
                <Navbar></Navbar>
                <CreateFolder></CreateFolder>
              </>
            }
          ></Route>
          <Route
            path="displaySet"
            element={
              <>
                <Navbar></Navbar>
                <SetDisplay></SetDisplay>
              </>
            }
          ></Route>
          <Route
            path="displaySet/:setId"
            element={
              <>
                <Navbar></Navbar>
                <SetDisplay></SetDisplay>
              </>
            }
          ></Route>
          <Route
            path="displayFolder"
            element={
              <>
                <Navbar></Navbar>
                <FolderDisplay></FolderDisplay>
              </>
            }
          ></Route>
          <Route
            path="displayFolder/:folderId"
            element={
              <>
                <Navbar></Navbar>
                <FolderDisplay></FolderDisplay>
              </>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
