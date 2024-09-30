"use client";

import { loginExpencConverterUser, signInGoogle } from "@/firebase/firebase.auth";
import { Button, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import Link from "next/link";
import { useState, ChangeEvent } from "react";

// Define Firebase Error Types
interface FirebaseAuthError extends Error {
  code: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Handle input changes
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      setOpenSnackbar(true);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 6 characters long.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      await loginExpencConverterUser(email, password);
      // Handle successful login (e.g., redirect to another page)
    } catch (error) {
      const firebaseError = error as FirebaseAuthError;
      console.error("Error details:", firebaseError); // Log the error details for debugging
      switch (firebaseError.code) {
        case "auth/invalid-email":
          setErrorMessage("Invalid email format. Please enter a valid email.");
          break;
        case "auth/user-not-found":
          setErrorMessage("No user found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setErrorMessage(
            "Access temporarily disabled due to too many failed attempts. You can restore access by resetting your password or try again later."
          );
          break;
        case "auth/invalid-credential":
          setErrorMessage(
            "The provided credentials are invalid or expired. Please try signing in again."
          );
          break;
        default:
          setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInGoogle();
      // Handle successful login (e.g., redirect to another page)
    } catch (error) {
      const firebaseError = error as FirebaseAuthError;
      console.error("Error details:", firebaseError); // Log the error details for debugging
      switch (firebaseError.code) {
        case "auth/invalid-credential":
          setErrorMessage("Failed to sign in with Google due to invalid credentials. Please try again.");
          break;
        default:
          setErrorMessage("Failed to sign in with Google. Please try again.");
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        direction={"column"}
        spacing={4}
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: '20px'
        }}
      >
        <Stack direction={"column"} spacing={4} sx={{ width: "100%", maxWidth: "30em" }}>
          <TextField
            label="Enter your email"
            color="warning"
            value={email}
            onChange={handleEmailChange}
            error={!!email && !validateEmail(email)}
            helperText={!!email && !validateEmail(email) ? "Invalid email format" : ""}
            required
          />
          <TextField
            label="Enter your password"
            type="password"
            color="warning"
            value={password}
            onChange={handlePasswordChange}
            error={!!password && !validatePassword(password)}
            helperText={!!password && !validatePassword(password) ? "Password must be at least 6 characters" : ""}
            required
          />
          <Typography>
            If you don&apos;t have an account <Link style={{ color: "blue" }} href={'/signup'}>sign up</Link>
          </Typography>
          <Button onClick={handleLogin} variant="contained" color="warning" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            onClick={handleGoogleLogin}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Typography>
            <Link style={{ color: "blue" }} href={'/reset-password'}>Forgot your password?</Link>
          </Typography>
        </Stack>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
