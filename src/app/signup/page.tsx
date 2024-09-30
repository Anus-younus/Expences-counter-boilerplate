"use client";

import { createExpencConverterUser } from "@/firebase/firebase.auth";
import { Button, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import Link from "next/link";
import { useState, ChangeEvent } from "react";

// Define Firebase Error Types
interface FirebaseAuthError extends Error {
    code: string;
}

export default function Signup() {
    const [name, setName] = useState<string>('');
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
        return password.length >= 6; // Adjust the minimum length as needed
    };

    const handleSubmit = async () => {
        // Validate fields
        if (!name || !email || !password) {
            setErrorMessage("Please fill in all fields.");
            setOpenSnackbar(true);
            return;
        }
        
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
            await createExpencConverterUser(name, email, password);
            // Handle successful signup (e.g., redirect to another page)
            // Example: Router.push('/welcome');
        } catch (error) {
            const firebaseError = error as FirebaseAuthError;
            console.error("Signup error:", error);

            // Check if the error has a code
            if (firebaseError && firebaseError.code) {
                switch (firebaseError.code) {
                    case "auth/email-already-in-use":
                        setErrorMessage("This email is already in use. Please try a different one.");
                        break;
                    case "auth/invalid-email":
                        setErrorMessage("The email address is not valid. Please enter a valid email.");
                        break;
                    case "auth/weak-password":
                        setErrorMessage("The password is too weak. Please choose a stronger password.");
                        break;
                    default:
                        setErrorMessage("Failed to create account. Please try again.");
                }
            } else {
                setErrorMessage("An unknown error occurred. Please try again later.");
            }

            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack direction={"column"} spacing={4} sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
                <Stack direction={"column"} spacing={4} sx={{ width: "100%", maxWidth: "30em" }}>
                    <TextField 
                        label="Enter your name" 
                        color="warning" 
                        value={name} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
                        required 
                    />
                    <TextField 
                        label="Enter your email" 
                        color="warning" 
                        value={email} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                        required 
                    />
                    <TextField 
                        label="Enter your password" 
                        type="password" 
                        color="warning" 
                        value={password} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                        required 
                    />
                    <Typography>
                        If you have an account <Link style={{ color: "blue" }} href={'/login'}>login</Link>
                    </Typography>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="warning" 
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign up"}
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
