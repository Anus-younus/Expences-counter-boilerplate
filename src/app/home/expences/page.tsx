"use client";

import { auth } from "@/firebase/firebase.auth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db, deleteExpenceDB } from "@/firebase/firebase.firestore";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function Expences() {
  const router = useRouter();
  const [expences, setExpences] = useState<DocumentData[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile view

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    const fetchExpences = () => {
      const collectionRef = collection(db, "expences");
      const condition = where("uid", "==", auth.currentUser?.uid);
      const q = query(collectionRef, condition);

      unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedExpences: DocumentData[] = [];

        snapshot.forEach((doc) => {
          const exp = { ...doc.data(), id: doc.id };
          updatedExpences.push(exp);
        });

        setExpences(updatedExpences); // Update expenses list
      });
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchExpences();
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const changeRoute = (id: string) => {
    router.push(`/home/${id}`);
  };

  return (
    <>
      {
        expences.length > 0 ? (
          <TableContainer component={Paper} sx={{ marginTop: "40px",width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650, tableLayout: 'auto' }} aria-label="responsive table">
              <TableHead>
                <TableRow>
                  {/* Visible columns */}
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>ID</TableCell> {/* Hide ID on small screens */}
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Category</TableCell> {/* Hide Category on mobile */}
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expences.map(({ title, amount, id, category, date }) => (
                  <TableRow key={id}>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{id}</TableCell> {/* Hide ID on small screens */}
                    <TableCell>{title}</TableCell>
                    <TableCell align="right">{amount}</TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{category}</TableCell> {/* Hide Category on mobile */}
                    <TableCell align="right">{new Date(date.seconds * 1000).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Button
                          onClick={() => changeRoute(id)}
                          color="success"
                          size={isMobile ? "small" : "medium"} // Smaller button for mobile
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          onClick={() => deleteExpenceDB(id)}
                          color="error"
                          size={isMobile ? "small" : "medium"} // Smaller button for mobile
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack style={{width: "100%", textAlign: "center"}}>
            <Button variant="text">No expenses available</Button>
          </Stack>
        )
      }
    </>
  );
}
