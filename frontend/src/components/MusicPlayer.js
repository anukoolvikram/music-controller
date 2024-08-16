import React from "react";
import {
  Grid,
  Typography,
  Card,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { Pause, PlayArrow, SkipNext } from "@mui/icons-material";

export default function MusicPlayer(props) {
  const {
    image_url,
    title,
    artist,
    time,
    duration,
    is_playing,
    votes,
    votes_required,
  } = props;

  const songProgress = (time / duration) * 100;

  const skipSong = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/skip-song", requestOptions);
  };

  const pauseSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause-song", requestOptions);
  };

  const playSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play-song", requestOptions);
  };

  return (
    <Card style={{ width: "50%" }}>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={image_url} height="100%" width="100%" alt="Music" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {artist}
          </Typography>
          <div>
            <IconButton
              onClick={() => {
                is_playing ? pauseSong() : playSong();
              }}
            >
              {is_playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={() => {
                skipSong();
              }}
            >
              {`${votes} / ${votes_required}`}
              <SkipNext />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
}
