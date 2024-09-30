"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase.auth"; // Ensure you import the correct Firebase auth instance
import { Button, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { useState, ChangeEvent } from "react";
import Link from "next/link";

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleResetPassword = async (): Promise<void> => {
        if (!email) {
            setErrorMessage("Please enter your email.");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage("Password reset email sent! Check your inbox.");
            setEmail(''); // Clear the email input field
        } catch (error: unknown) {
            console.error("Error sending password reset email:", error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Failed to send password reset email. Please try again.");
            }
        } finally {
            setOpenSnackbar(true);
            setLoading(false);
        }
    };

    return (
        <>
            <Stack direction={"column"} spacing={4} sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
                <Stack direction={"column"} spacing={4} sx={{ width: "100%", maxWidth: "30em" }}>
                    <Typography variant="h5">Reset Password</Typography>
                    <TextField 
                        label="Enter your email" 
                        color="warning" 
                        value={email} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                        required 
                    />
                    <Button 
                        onClick={handleResetPassword} 
                        variant="contained" 
                        color="warning" 
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Email"}
                    </Button>
                    <Typography>
                        Remembered your password? <Link style={{ color: "blue" }} href={'/login'}>Login</Link>
                    </Typography>
                </Stack>
            </Stack>
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={successMessage ? "success" : "error"}>
                    {successMessage || errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ResetPassword;
