"use client";

import { createContext, useEffect, ReactNode } from "react";
import { auth } from "@/firebase/firebase.auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { checkEmailVerification } from "@/firebase/firebase.auth"; // Adjust the import path as needed

const UserContext = createContext(null);

export default function UserContextProvider({ children }: { children: ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check for email verification
                await checkEmailVerification(); // Call to check and update email verification status
                
                // Reload the user to get the latest verification status
                await user.reload();

                // Redirect based on email verification status
                if (user.emailVerified) {
                    router.replace('/home/expences'); // Redirect to the home page
                } else {
                    router.replace('/verify-email'); // Redirect to the verification page
                }
            } else {
                router.replace('/login'); // Redirect to the login page if not authenticated
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [router]);

    return <UserContext.Provider value={null}>{children}</UserContext.Provider>;
}
