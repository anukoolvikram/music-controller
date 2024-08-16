import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Callback() {
  const navigate = useNavigate();
  const [authorizationCode, setAuthorizationCode] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setAuthorizationCode(code);
    }
  }, []);

  useEffect(() => {
    if (authorizationCode) {
      console.log(authorizationCode);
      fetch(`/spotify/redirect?code=${authorizationCode}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      setAuthorizationCode(null);
    }
  }, [authorizationCode]);

  return authorizationCode ? (
    navigate("/")
  ) : (
    <div>
      <h1>Callback</h1>
    </div>
  );
}
