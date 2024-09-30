"use client"; // Ensure client-side rendering

import { sendVerificationEmail } from "@/firebase/firebase.auth"; // Adjust the import path
import { Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/firebase/firebase.auth"; // Adjust the import path to your Firebase config
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { db } from "@/firebase/firebase.firestore";

export default function VerifyEmail() {
    const [loading, setLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
    const router = useRouter(); // Initialize useRouter

    // Listen for email verification status
    useEffect(() => {
        const user = auth.currentUser; // Get the currently authenticated user
        if (user) {
            const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
                const data = doc.data();
                if (data && data.isEmailVerify) {
                    setIsEmailVerified(true); // Set verification status
                    setSuccessMessage("Your email has been verified!");
                    setOpenSnackbar(true);
                }
            });

            // Cleanup on unmount
            return () => unsubscribe();
        }
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
                        Please verify your email address to continue. If you haven't received an email, click the button below to resend the verification email.
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
};
