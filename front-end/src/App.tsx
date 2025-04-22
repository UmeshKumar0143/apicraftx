import DashBoard from "./components/DashBoard";
import "./App.css"
import MainPage from "./components/MainPage";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/Signin";
export default function App(){
  return <Routes>
  <Route path="/" element={<DashBoard />} />
  <Route path="/main" element={<MainPage />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/signup" element={<SignUp />} />
</Routes>

}