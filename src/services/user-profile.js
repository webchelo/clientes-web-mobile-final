import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene la data del usuario por el parametro de ID en la coleccion de firestore
 * 
 * @param {string} id 
 * @returns {Promise}
 */
export async function getUserProfileById(id) {
    const refUser = doc(db, `users/${id}`);

    const userDoc = await getDoc(refUser);

    return {
        id: userDoc.id,
        email: userDoc.data().email,
        displayName: userDoc.data().displayName,
        pet: userDoc.data().pet,
        petBio: userDoc.data().petBio,
        photoURL: userDoc.data().photoURL,
    }
}

/**
 * Crea un perfil de usuario en Firestore
 * 
 * @param {string} id 
 * @param {{email: string}} data 
 * @returns {Promise}
 */
export async function createUserProfile(id, data) {
    const refUser = doc(db, `users/${id}`);

    await setDoc(refUser, data);
}

/**
 * Actualiza el perfil de usuario
 * 
 * @param {string} id 
 * @param {{displayName: string|null, photoURL: string|null}} data 
 * @returns {Promise<void>}
 */
export async function updateUserProfile(id, data) {
    const refUser = doc(db,`users/${id}`);
    await updateDoc(refUser, data);
}