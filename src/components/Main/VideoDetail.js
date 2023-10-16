import React, { useEffect, useState } from "react";
import "./VideoDetail.css";
import { Avatar, Typography, Button } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
// import ReplySharpIcon from "@mui/icons-material/ReplySharp";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import { useStateProvider } from "../../utils/StateProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VideoDetail() {
  const navigate = useNavigate();
  const [{ selectedVideo, list, token }, dispatch] = useStateProvider();
  const randomArr = Math.floor(Math.random() * 4);
  var endIndex = randomArr * 20 + 19;
  const displayedList = list.slice((0 + randomArr) * 19, endIndex);

  const subscribeNum = Math.floor(Math.random() * 10) + 1;
  let viewNum;
  let hoursNum;

  const handleVideoDetail = (obj) => {
    var videocard = JSON.parse(localStorage.getItem("video")) || [];
    const flag = videocard.some((card) => card._id === obj._id);
    console.log(flag);
    if (!flag) {
      const UpdatedVideo = [...videocard, obj];
      localStorage.setItem("video", JSON.stringify(UpdatedVideo));
    }

    setTimeout(() => {
      dispatch({ type: "SET_VIDEO", payload: obj });
      navigate("/");
      navigate("/detail");
      console.log("obj", obj);
    }, 1000);
  };

  useEffect(() => {
    const videocard = JSON.parse(localStorage.getItem("video")) || [];
    const changedVideo = videocard.find((obj) => obj._id === selectedVideo._id);
    console.log("find", changedVideo);
    if (changedVideo) {
      dispatch({ type: "SET_VIDEO", payload: changedVideo });
    }
  }, []);


  const setDispatch = () => {
    const videocard = JSON.parse(localStorage.getItem("video")) || [];
    const index = videocard.findIndex((obj) => obj._id === selectedVideo._id);
    videocard[index] = selectedVideo;
    // console.log("updated", videocard);
    localStorage.setItem("video", JSON.stringify(videocard));
    dispatch({ type: "SET_VIDEO", payload: selectedVideo });
  };
  const handleWatchLater = () => {
    if (token === null) {
      console.log(token);
      alert("Please LogIn");
    } else {
      const apiUrl =
        "https://academics.newtonschool.co/api/v1/ott/watchlist/like";
      const jwtToken = token;
      const projectId = "f104bi07c490";
      const showId = selectedVideo._id; // Replace 'your_show_id' with the actual show ID.

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        projectID: projectId,
      };

      const data = {
        showId: showId,
      };
      // axios.method(url,header,body).then((response)=>{}).catch((errror)=>{})
      axios
        .patch(apiUrl, data, { headers })
        .then((response) => {
          console.log("PATCH request successful:", response.data);
          if (
            response.data.message === "Show added to watchlist successfully."
          ) {
            selectedVideo.watchLater = true;
            alert("Show added to watchlist successfully.");
          } else if (
            response.data.message ===
            "Show removed from watchlist successfully."
          ) {
            selectedVideo.watchLater = false;
            alert("Show removed from watchlist successfully.");
          }
          setDispatch();
        })
        .catch((error) => {
          console.error("Error making PATCH request:", error);
        });

      console.log(token);
    }
  };

  const handleLike = () => {
    if (selectedVideo?.liked) {
      selectedVideo.liked = false;
    } else {
      selectedVideo.liked = true;
    }
    setDispatch();
  };

  const handleDislike = () => {
    if (selectedVideo?.liked) {
      selectedVideo.liked = false;
    }

    if (selectedVideo?.dislike) {
      selectedVideo.dislike = false;
    } else {
      selectedVideo.dislike = true;
    }
    setDispatch();
  };
  const handleSubscribe = () => {
    if (selectedVideo?.subscribe) {
      selectedVideo.subscribe = false;
    } else {
      selectedVideo.subscribe = true;
    }
    setDispatch();
  };

  return (
    <div className="main-body">
      <div className="primary-section">
        <video loop controls style={{ width: "100%" }}>
          <source src={selectedVideo?.video_url} />
        </video>
        <h3
          style={{
            fontFamily: "Roboto, Arial, sans-serif",
            margin: "12px 0px 12px 0px",
          }}>
          {selectedVideo?.title + " : " + selectedVideo?.description}
        </h3>
        <div className="video_footer">
          <div style={{ display: "flex", alignItems: "center", width: "700" }}>
            <Avatar
              sx={{
                width: 35,
                height: 35,
              }}
              src={selectedVideo?.thumbnail}
              alt="User Avatar"
            />
            <div style={{ paddingLeft: "15px" }}>
              <Typography sx={{ color: "Black" }}>
                {selectedVideo?.director}
              </Typography>
              <Typography sx={{ color: "gray", fontSize: "13px" }}>
                {subscribeNum}M subscribers
              </Typography>
            </div>
            <Button
              variant={selectedVideo?.subscribe ? "outlined" : "contained"}
              size="medium"
              onClick={handleSubscribe}
              style={{
                height: "38px",
                borderRadius: "40px",
                textTransform: "none",
                marginLeft: "10px",
              }}>
              {selectedVideo?.subscribe ? "Unsubscribe" : "Subscribe"}
            </Button>
          </div>
          <div className="button-group">
            <Button
              onClick={handleLike}
              className="button-style"
              style={{
                color: selectedVideo?.liked ? "blue" : "black",
                background: "#e4e5eb",
                marginLeft: "2px",
              }}>
              {/* need  to add gaps bet buttons */}
              <ThumbUpOffAltIcon />
              {selectedVideo?.liked ? 1 : 0}
            </Button>
            <Button
              onClick={handleDislike}
              className="button-style"
              style={{
                color: selectedVideo?.dislike ? "blue" : "black",
                background: "#e4e5eb",
                marginLeft: "2px",
              }}>
              <ThumbDownOffAltIcon />
            </Button>

            <Button
              className="button-style"
              onClick={handleWatchLater}
              sx={{
                color: "black",
                background: "#e4e5eb",
              }}>
              <BookmarkAddOutlinedIcon />
              Watch Later
            </Button>
          </div>
        </div>
      </div>
      <div className="secondary-section">
        {displayedList.map((obj, index) => {
          return (
            <div
              key={obj._id}
              className="video_card"
              onClick={() => {
                handleVideoDetail(obj);
              }}>
              <div>
                <img src={obj.thumbnail} alt="dummy" />
              </div>
              <div style={{ marginLeft: "10px" }}>
                <Typography sx={{ fontSize: "14px", color: "black" }}>
                  {obj.title}
                </Typography>
                <Typography sx={{ color: "gray", fontSize: "12px" }}>
                  {obj.director}
                </Typography>
                <Typography sx={{ color: "gray", fontSize: "13px" }}>
                  {(viewNum = Math.floor(Math.random() * 1000) + 1)}
                  {(hoursNum = Math.floor(Math.random() * 100) + 1)}
                  {viewNum} Views &#8226; {hoursNum}Hours ago
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VideoDetail;