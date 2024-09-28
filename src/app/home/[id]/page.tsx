"use client";
import { db, updateExpeceDB } from "@/firebase/firebase.firestore";
import {
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ParamType = {
  params: { id: string };
};

export default function Edit({ params: { id } }: ParamType) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const docRef = doc(db, "expences", id);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      const data = doc.data(); // Check if data exists
      if (data) {
        setTitle(data.title || "");
        setAmount(data.amount || "");
        setCategory(data.category || "");
        setNote(data.note || "");
      }
    });

    return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
  }, [id]);

  const handleSubmit = () => {
    updateExpeceDB({ id, title, amount, category, note });
    router.push("/home/expences");
  };

  return (
    <>
      <Stack
        direction={"column"}
        spacing={4}
        sx={{
          height: "40em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack direction={"column"} spacing={4} sx={{ width: "30rem" }}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            color="warning"
            label="Enter your expence title"
          />
          <TextField
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            color="warning"
            label="Enter your expence price"
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <TextField
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            color="warning"
            label="Select category"
            select
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
          <Button onClick={handleSubmit} color="warning" variant="contained">
            Update Expense
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
