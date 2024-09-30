"use client"; // Ensure client-side rendering

import { sendVerificationEmail } from "@/firebase/firebase.auth"; // Adjust the import path
import { Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/firebase/firebase.auth"; // Adjust the import path to your Firebase config
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function VerifyEmail() {
    const [loading, setLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
    const router = useRouter(); // Initialize useRouter

    // Function to reload user and check verification status
    const checkEmailVerification = async () => {
        const user = auth.currentUser;
        if (user) {
            await user.reload(); // Reload user info to get updated email verification status
            if (user.emailVerified) {
                setIsEmailVerified(true); // Set state if email is verified
                setSuccessMessage("Your email has been verified!");
                setOpenSnackbar(true);
            }
        }
    };

    // Listen for email verification status
    useEffect(() => {
        checkEmailVerification();
        const interval = setInterval(checkEmailVerification, 3000); // Check every 3 seconds

        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);

    // Redirect to home if the email is verified
    useEffect(() => {
        if (isEmailVerified) {
            router.push("/home/expenses"); // Redirect to the home page without reload
        }
    }, [isEmailVerified, router]);

    const handleSendVerificationEmail = async (): Promise<void> => {
        setLoading(true);
        try {
            await sendVerificationEmail();
            setSuccessMessage("Verification email sent! Check your inbox.");
        } catch (error: unknown) {
            console.error("Error sending verification email:", error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Failed to send verification email. Please try again.");
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
                    <Typography variant="h5">Verify Your Email</Typography>
                    <Typography>
                        Please verify your email address to continue. If you haven&apos;t received an email, click the button below to resend the verification email.
                    </Typography>
                    <Button
                        onClick={handleSendVerificationEmail}
                        variant="contained"
                        color="warning"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Resend Verification Email"}
                    </Button>
                    <Typography>
                        If you have already verified your email, you can <Link style={{ color: "blue" }} href={'/login'}>login here</Link>.
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
}
