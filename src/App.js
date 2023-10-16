import React, { useEffect } from "react";
import "./styles/App.css";
import Header from "./components/Header/Header";
import SideBar from "./components/SideBar/SideBar";
import VideoFeed from "./components/Main/VideoFeed";
import WatchLater from "./components/Watchlater/WatchLater";
import { Route, Routes, useLocation } from "react-router-dom";
import YoutubePremium from "./components/SideBar/YoutubePremium";
import VideoDetail from "./components/Main/VideoDetail";
import SignUp from "./components/Header/SignUp";
import SignIn from "./components/Header/SignIn";
import VideoSuggestion from "./components/Main/VideoSuggestion";
import { useStateProvider } from "./utils/StateProvider";

const App = () => {
  const [, dispatch] = useStateProvider();
  const location = useLocation();
  // localStorage.removeItem("video");
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const userName = localStorage.getItem("userName");

    if (jwtToken && userName) {
      dispatch({ type: "SET_NAME", payload: userName });
      dispatch({ type: "SET_TOKEN", payload: jwtToken });
    }
  }, [dispatch]);
  return (
    <>
      {location.pathname === "/signup" ? (
        <SignUp />
      ) : location.pathname === "/signin" ? (
        <SignIn />
      ) : location.pathname === "/premium" ? (
        <YoutubePremium />
      ) : (
        <div className="main">
          <Header />
          <div className="section">
            <SideBar />
            <Routes>
              <Route path="/" exact element={<VideoFeed />} />

              <Route path="/later" element={<WatchLater />} />
              <Route path="/premium" element={<YoutubePremium />} />
              <Route path="/detail" element={<VideoDetail />} />
              <Route path="/suggestion" element={<VideoSuggestion />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
};

export default App;