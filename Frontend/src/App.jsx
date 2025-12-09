import React,{useContext} from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { Route, Routes } from "react-router-dom";
import Customize from "./pages/Customize"
import Home from "./pages/Home"
import {userDataContext} from "./context/UserContext"
import { Navigate } from "react-router-dom";
import Customize2 from "./pages/Customize2"


function App() {
  const {userData,setUserData}=useContext(userDataContext)

  return (
    <div>
      <Routes>
        <Route path="/" element={(userData?.assistantimg && userData?.assistantname) ? <Home /> : <Navigate to={"/customize"}/>}/>
        <Route path="/signup" element={(!userData)?<SignUp /> : <Navigate to={"/"} />} />
        <Route path="/signin" element={(!userData)?<SignIn /> : <Navigate to={"/"}/>} />
        <Route path="/customize" element={userData ? <Customize /> : <Navigate to={"/signup"} />} />
        <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to={"/signup"} />} />
      </Routes>
    </div>
  );
}

export default App;
