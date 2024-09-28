import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import { app } from './firebase.config'
import { addUserDB } from './firebase.firestore'


export const auth = getAuth(app)

export async function createExpencConverterUser(name: string, email: string, password: string) {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        const uid = auth.currentUser?.uid
        addUserDB({name, email, uid})
        console.log("user created succesful", user)
    } catch (e) {
        console.error("error", e)
    }
}

export async function loginExpencConverterUser(email: string, password: string) {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        console.log("user login succesful", user)
    } catch (e) {
        console.error("error", e)
    }
}

export const signOutExpencConverterUser = async () => {
    const auth = getAuth();
    await signOut(auth);
};

export async function signInGoogle() {
const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider)
    } catch (e) {
        console.error("error", e)
    }
}