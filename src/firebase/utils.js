import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "./config";

export const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (err) {
    return err;
  }
}

export const logout = async () => {
  try {
    const res = await signOut(auth);
    return res;
  } catch (err) {
    return err;
  }
}

export const onAuthChange = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(true);
    } else {
      callback(false);
    }
  });
}