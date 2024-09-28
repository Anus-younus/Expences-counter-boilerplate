import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC2Pax_A-UK4TjsT7Lf0o6xbfUWgpebXOU",
  authDomain: "nextjs-saylani-batch-11.firebaseapp.com",
  projectId: "nextjs-saylani-batch-11",
  storageBucket: "nextjs-saylani-batch-11.appspot.com",
  messagingSenderId: "967652255821",
  appId: "1:967652255821:web:bd9aebf82904c782f65404"
};

export const app = initializeApp(firebaseConfig)