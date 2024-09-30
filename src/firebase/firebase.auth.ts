import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth'
import { app } from './firebase.config'
import { addUserDB, updateUserDB } from './firebase.firestore'


export const auth = getAuth(app)

export async function createExpencConverterUser(name: string, email: string, password: string) {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        if (user) {
            const uid = user.uid; // Use the uid from the user object directly
            await addUserDB({ name, email, uid }); // Assuming addUserDB is an async function
            console.log("User created successfully", user);
            return user; // Optionally return the user object
        }
    } catch (e) {
        console.error("Error during user creation:", e);

        // Throw the error to be caught by the calling function
        throw e;
    }
}
export async function loginExpencConverterUser(email: string, password: string) {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        console.log("User login successful", user);
        return user; // You can return the user object or any relevant data if needed
    } catch (e) {
        console.error("Login error:", e);

        // Throw the error so it can be caught by the calling function
        throw e;
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

export const sendResetPasswordEmail = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully.");
    } catch (error) {
        console.error("Error sending password reset email:", error);
        // Re-throw the error for handling in the component
        throw error;
    }
};

export const sendVerificationEmail = async (): Promise<void> => {
    const user = auth.currentUser; // Get the currently signed-in user
    if (!user) {
        throw new Error("No user is currently signed in.");
    }

    try {
        await sendEmailVerification(user);
        console.log("Verification email sent successfully.");
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

export const checkEmailVerification = async (): Promise<boolean> => {
    const user = auth.currentUser; // Get the currently authenticated user

    if (user) {
        await user.reload(); // Reload the user to get updated information
        if (user.emailVerified) {
            await updateUserDB(user.uid, { isEmailVerify: true }); // Update the verification status in your database
            console.log("Email is verified.");
            return true; // Return true if the email is verified
        } else {
            console.log("Email is not verified yet.");
            return false; // Return false if the email is not verified
        }
    }
    return false; // Return false if no user is found
}