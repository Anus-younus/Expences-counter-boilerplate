"use client";

import PieChart from "@/components/pieChart";
import { auth } from "@/firebase/firebase.auth";
import { db } from "@/firebase/firebase.firestore";
import { onAuthStateChanged } from "firebase/auth";
import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

// Define an interface for the dataset
interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
}

// Define an interface for userData
interface UserData {
    labels: string[];
    datasets: Dataset[];
}

export default function ExpencesTrack() {
    const [expneces, setExpences] = useState<DocumentData[]>([]);
    const [userData, setUserData] = useState<UserData>({
        labels: [],
        datasets: [{
            label: "Categories expense per month",
            data: [],
            backgroundColor: ["yellow", "orange", "blue", "green", "purple", "pink"],
            borderWidth: 2,
        }]
    });

    useEffect(() => {
        console.log(expneces)
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    fetchExpences(); // Fetch expenses only if the user is authenticated
                }
            return () => unsubscribe(); // Cleanup the listener on unmount
        })
    }, []);

    const fetchExpences = () => {
        const collectionRef = collection(db, "expences");
        const condition = where("uid", "==", auth.currentUser?.uid);
        const q = query(collectionRef, condition);

        onSnapshot(q, (snapshot) => {
            const updateExpence: DocumentData[] = [];
            snapshot.forEach((doc) => {
                const exp = { ...doc.data(), id: doc.id };
                updateExpence.push(exp);
            });
            setExpences(updateExpence);

            // Update userData after setting expences
            setUserData({
                labels: updateExpence.map((data) => data.category || "Unknown"), // Use fallback for category
                datasets: [{
                    label: "Categories expense per month",
                    data: updateExpence.map((data) => data.amount || 0), // Use fallback for amount
                    backgroundColor: ["yellow", "orange", "blue", "green", "purple", "pink"], // Adjusted for more categories
                    borderWidth: 2,
                }]
            });
        });
    };

    return (
        <>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}></div>
            <div style={{ width: "500px", marginLeft: "400px" }}>
                <PieChart charData={userData} />
            </div>
        </>
    );
}
