import React, { useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Callback from "./Callback";

export default function HomePage() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    axios
      .get("/api/user-in-room")
      .then((response) => {
        console.log(response);
        setRoomCode(response.data.code);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [roomCode]);

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            roomCode ? (
              <Navigate replace to={`/room/${roomCode}`} />
            ) : (
              renderHomePage()
            )
          }
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route
          path="/room/:roomCode"
          element={<Room clearRoomCode={clearRoomCode} />}
        />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}
