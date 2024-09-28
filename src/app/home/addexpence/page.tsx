"use client";

import { addExpeneDB } from "@/firebase/firebase.firestore";
import {
    Button,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Snackbar,
    Alert
} from "@mui/material";
import { useState } from "react";

export default function AddExpence() {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (!title || !amount || !category) {
            setErrorMessage("Please fill all required fields.");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        try {
            await addExpeneDB({ title, amount, category, note });
            setTitle('');
            setAmount('');
            setCategory('');
            setNote('');
            setOpenSnackbar(true);
        } catch (error) {
            setErrorMessage("Error adding expense. Please try again.");
            setOpenSnackbar(true);
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack direction={'column'} spacing={4} sx={{ marginTop: "40px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
                <Stack direction={'column'} spacing={4} sx={{ width: "100%", maxWidth: "30rem" }}>
                    <TextField
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        color="warning"
                        label="Enter your expense title"
                        required
                    />
                    <TextField
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        color="warning"
                        label="Enter your expense price"
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>
                        }}
                        required
                    />
                    <TextField
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        color="warning"
                        label="Select category"
                        select
                        required
                    >
                        <MenuItem value="Food">Food</MenuItem>
                        <MenuItem value="Transport">Transport</MenuItem>
                        <MenuItem value="Bills">Bills</MenuItem>
                        <MenuItem value="Education">Education</MenuItem>
                        <MenuItem value="Investments">Investments</MenuItem>
                        <MenuItem value="Luxuries">Luxuries</MenuItem>
                    </TextField>
                    <TextField
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        color="warning"
                        label="Enter a note"
                        multiline
                        rows={4}
                    />
                    <Button
                        onClick={handleSubmit}
                        color="warning"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Expense"}
                    </Button>
                </Stack>
            </Stack>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={errorMessage ? "error" : "success"}>
                    {errorMessage || "Expense added successfully!"}
                </Alert>
            </Snackbar>
        </>
    );
}
