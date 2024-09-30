import {
    doc,
    addDoc,
    collection,
    Timestamp,
    setDoc,
    getFirestore,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore'

import { app } from './firebase.config'
import { auth } from './firebase.auth'
import { ExpenceType, UpdatedExpenceType, UserType } from '@/types/firebasetypes'

export const db = getFirestore(app)

export async function addUserDB({ name, email, uid, isEmailVerify }: UserType) {
    try {
        if (uid) {
            const docRef = doc(db, "users", uid)
            const res = await setDoc(docRef, { name, email, isEmailVerify })
            console.log("user add in db", res)
        }
    } catch (e) {
        console.log("error", e)
    }
}

export async function addExpeneDB({ title, amount, note, category }: ExpenceType) {
    try {
        const collectionRef = collection(db, "expences")
        const uid = auth.currentUser?.uid
        const res = await addDoc(collectionRef, { title, amount, uid, note, category, date: Timestamp.fromDate(new Date()) })
        console.log("user add in db", res)
    } catch (e) {
        console.log("error", e)
    }
}

export async function updateExpeceDB(updatedExpence: UpdatedExpenceType) {
    try {
        const docRef = doc(db, "expences", updatedExpence.id)
        const uid = auth.currentUser?.uid
        await updateDoc(docRef, {
            title: updatedExpence.title,
            amount: updatedExpence.amount,
            uid,
            note: updatedExpence.note,
            category: updatedExpence.category,
            date: Timestamp.fromDate(new Date())
        })
    } catch (e) {
        console.log("error", e)
    }
}

export async function deleteExpenceDB(id: string) {
    try {
        const docRef = doc(db, "expences", id)
        await deleteDoc(docRef)
    } catch (e) {
        console.log("error", e)
    }
}

export const updateUserDB = async (uid: string, data: { isEmailVerify: boolean }) => {
    try {
        const userDocRef = doc(db, "users", uid); // Assuming "users" is your collection name
        await updateDoc(userDocRef, data);
        console.log("User updated successfully:", uid);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error; // Re-throw the error if needed
    }
};
