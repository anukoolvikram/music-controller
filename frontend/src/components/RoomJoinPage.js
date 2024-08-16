import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RoomJoinPage() {
  const [roomJoinDetails, setRoomJoinDetails] = useState({
    roomCode: "",
    error: "",
  });

  const navigate = useNavigate();

  const handleTextFieldChange = (e) => {
    setRoomJoinDetails({
      ...roomJoinDetails,
      roomCode: e.target.value,
    });
  };

  const roomButtonPressed = () => {
    const requestOptions = {
      code: roomJoinDetails.roomCode,
    };
    axios
      .post("/api/join-room", requestOptions)
      .then((response) => {
        if (response.status === 200) {
          navigate(`/room/${roomJoinDetails.roomCode}`);
        } else {
          setRoomJoinDetails({
            ...roomJoinDetails,
            error: "Room not found.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setRoomJoinDetails({
          ...roomJoinDetails,
          error: "Room not found.",
        });
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={Boolean(roomJoinDetails.error)}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomJoinDetails.roomCode}
          helperText={roomJoinDetails.error}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={roomButtonPressed}>
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
