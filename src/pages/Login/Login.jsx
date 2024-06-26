import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useUserAuth } from "../../context/userAuthContext";
import "./Login.css";

export default function Login() {
  const { googleSignInWithPopup, user, detectMob, googleSignIn } =
    useUserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e, provider) => {
    e.preventDefault();
    try {
      switch (provider) {
        case "google":
          (await detectMob()) ? googleSignIn() : googleSignInWithPopup();
          //navigate("/PairKeys");
          navigate("/chat"); //After successful login, navigate to the chat
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      //navigate("/PairKeys");
      navigate("/chat");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant="h3" color="orange" gutterBottom>
          Team 5 Chat App
        </Typography>
        <Box width="100%">
          <div
            className="google-btn"
            role={"button"}
            onClick={(e) => handleSignIn(e, "google")}
          >
            <div className="google-icon-wrapper">
              <img
                className="google-icon"
                src="./985_google_g_icon.jpg"
                alt="gmail"
              />
            </div>
            <p className="btn-text">
              <b>Login with G-mail</b>
            </p>
          </div>
        </Box>
      </CardContent>
    </React.Fragment>
  );
  return (
    <Layout sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          padding: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          inset: "0px",
          maxWidth: "480px",
          // height: '100%',
          overflowY: "auto",
          // margin: '50px auto 0',
          background: "rgba( 255, 255, 255, 0.4 )",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur( 5px )",
          WebkitBackdropFilter: "blur( 5px )",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          // marginBottom: '10px',
          width: "100%",

          margin: "auto",
        }}
      >
        <Card variant="elevation" sx={{ width: "100%" }}>
          {card}
        </Card>
      </Box>
    </Layout>
  );
}
