import DashBoard from "./components/DashBoard";
import "./App.css"
import MainPage from "./components/MainPage";
import { Route, Routes } from "react-router-dom";
export default function App(){
  return <Routes>
  <Route path="/" element={<DashBoard />} />
  <Route path="/main" element={<MainPage />} />
</Routes>

}