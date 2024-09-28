"use client";

import { loginExpencConverterUser, signInGoogle } from "@/firebase/firebase.auth"; // Import Google sign-in function
import { Button, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage("Please fill in both fields.");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        try {
            await loginExpencConverterUser(email, password);
            // Handle successful login (e.g., redirect to another page)
        } catch (error) {
            setErrorMessage("Invalid email or password. Please try again.");
            setOpenSnackbar(true);
            console.log(error);
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
            setErrorMessage("Failed to sign in with Google. Please try again.");
            setOpenSnackbar(true);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack direction={"column"} spacing={4} sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
                <Stack direction={"column"} spacing={4} sx={{ width: "100%", maxWidth: "30em" }}>
                    <TextField 
                        label="Enter your email" 
                        color="warning" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <TextField 
                        label="Enter your password" 
                        type="password" 
                        color="warning" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <Typography>
                        If you don&apos;t have an account <Link style={{ color: "blue" }} href={'/signup'}>sign up</Link>
                    </Typography>
                    <Button 
                        onClick={handleLogin} 
                        variant="contained" 
                        color="warning" 
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    {/* Google Sign-In Button with Icon */}
                    <Button 
                        onClick={handleGoogleLogin} 
                        variant="contained" 
                        color="primary" 
                        disabled={loading}
                        startIcon={<GoogleIcon />} // Use startIcon for proper alignment
                    >
                        Sign in with Google
                    </Button>
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
}
