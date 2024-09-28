"use client";

import { createExpencConverterUser } from "@/firebase/firebase.auth";
import { Button, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            setErrorMessage("Please fill in all fields.");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        try {
            await createExpencConverterUser(name, email, password);
            // Handle successful signup (e.g., redirect to another page)
        } catch (error) {
            setErrorMessage("Failed to create account. Please try again.");
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
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
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
                        If you have an account <Link  style={{color: "blue"}}  href={'/login'}>login</Link>
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
