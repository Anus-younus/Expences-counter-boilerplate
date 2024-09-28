"use client"

import { auth } from "@/firebase/firebase.auth"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { createContext, useEffect } from "react"

const UserContext = createContext(null)

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                router.push('/home/expences')
            } else {
                router.push('/login')
            }
        })
    }, [router])
    return (
        <UserContext.Provider value={null}>
            {children}
        </UserContext.Provider>
    )
}