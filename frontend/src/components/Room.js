import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
  const { roomCode } = useParams();
  const { clearRoomCode } = props;
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
    song: {},
  });
  const Navigate = useNavigate();

  const getRoomDetails = () => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          clearRoomCode();
          Navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setRoomDetails((prevDetails) => ({
          ...prevDetails,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        }));

        if (data.is_host) {
          authenticateSpotify();
        }
      });
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
        setRoomDetails((prevDetails) => ({
          ...prevDetails,
          spotifyAuthenticated: data.status,
        }));
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setRoomDetails((prevDetails) => ({
          ...prevDetails,
          song: data,
        }));
      });
  };
  const leaveButtonPressed = () => {
    axios
      .post("/api/leave-room")
      .then((response) => {
        if (response.status === 200) {
          clearRoomCode();
          Navigate("/");
        }
      })
      .catch((error) => {
        console.error("There was an error leaving the room!", error);
      });
  };

  const updateShowSettings = (value) => {
    setRoomDetails({
      ...roomDetails,
      showSettings: value,
    });
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={roomDetails.votesToSkip}
            guestCanPause={roomDetails.guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  useEffect(() => {
    getRoomDetails();

    const interval = setInterval(getCurrentSong, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [roomCode]);

  return roomDetails.showSettings ? (
    renderSettings()
  ) : (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      {/* <Grid item xs={12} align="center">
        {Object.entries(roomDetails.song).map(([key, value]) => (
          <Typography key={key} variant="h6" component="h6">
            <strong>{key}:</strong> {value.toString()}
          </Typography>
        ))}
      </Grid> */}
      <Grid item xs={12} align="center">
        <MusicPlayer {...roomDetails.song} />
      </Grid>
      {roomDetails.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}
