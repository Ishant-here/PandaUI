import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Home from "./Pages/Home";
import Generate from "./Pages/Generate";
import AdminDashboard from "./Pages/AdminDashboard"
import Pricing from "./Pages/Pricing";
import MyComponents from "./Pages/MyComponents";
import AllComponents from "./Pages/AllComponents";
import { setUserData, setAllUser, setAllComponents } from "./Redux/userSlice";

export const serverUrl = "https://pandaui.onrender.com";

const App = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [authChecked, setAuthChecked] = useState(false);

  // --- Fetch current user on mount ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/user/current-user`,
          { withCredentials: true }
        );

        dispatch(setUserData(response.data.user));
        console.log("Current User:", response.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
        dispatch(setUserData(null));
      } finally {
        setAuthChecked(true);
      }
    };

    fetchUser();
  }, [dispatch]);

  // --- Fetch all users (admin only) ---
  useEffect(() => {
    if (!userData) return;

    const fetchAllUsers = async () => {
      try {
        const userResponse = await axios.get(
          `${serverUrl}/api/user/all-users`,
          { withCredentials: true }
        );

        dispatch(setAllUser(userResponse.data.users));
        console.log("All Users:", userResponse.data.users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, [userData, dispatch]);

  // --- Fetch all components ---
  useEffect(() => {
    if (!userData) return;

    const fetchAllComponents = async () => {
      try {
        const componentResponse = await axios.get(
          `${serverUrl}/api/component/all-components`,
          { withCredentials: true }
        );

        dispatch(setAllComponents(componentResponse.data.components));
        console.log("All Components:", componentResponse.data.components);
      } catch (error) {
        console.error("Error fetching all components:", error);
      }
    };

    fetchAllComponents();
  }, [userData, dispatch]);

  return (
    <>
      {!authChecked && (
        <div className="fixed top-0 left-0 w-full h-1 bg-purple-500 animate-pulse z-50" />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/components" element={<AllComponents />} />
        <Route path="/my-components" element={<MyComponents />} />
      </Routes>
    </>
  );
};

export default App;
