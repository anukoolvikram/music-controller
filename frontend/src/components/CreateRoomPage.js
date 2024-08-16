import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";

export default function CreateRoomPage(props) {
  const { update, roomCode, updateCallback } = props;
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(
    props.guestCanPause ? props.guestCanPause : true
  );
  const [votesToSkip, setVotesToSkip] = useState(
    props.votesToSkip ? props.votesToSkip : defaultVotes
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      votes_to_skip: votesToSkip,
      guest_can_pause: guestCanPause,
    };
    axios
      .post("/api/create-room", requestOptions)
      .then((response) => {
        const roomCode = response.data.code;
        navigate(`/room/${roomCode}`);
      })
      .catch((error) =>
        console.error("There was an error creating the room!", error)
      );
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      votes_to_skip: votesToSkip,
      guest_can_pause: guestCanPause,
      code: roomCode,
    };
    axios.patch("/api/update-room", requestOptions).then((response) => {
      if (response.status === 200) {
        setSuccessMsg("Room updated successfully!");
      } else {
        setErrorMsg("Error updating room...");
      }
      setTimeout(() => {
        updateCallback();
      }, 3000);
    });
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  const title = update ? "Update Room" : "Create A Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg !== "" || successMsg !== ""}>
          {successMsg !== "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMsg("");
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMsg("");
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <span align="center">Guest Control of Playback State</span>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required
            type="number"
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <span align="center">Votes Required To Skip Song</span>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}
