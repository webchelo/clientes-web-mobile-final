import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene la data del usuario por el parametro de ID en la coleccion de firestore
 * 
 * @param {String} id 
 * @returns {Object}
 */
export async function getUserById(id) {
    const refUser = doc(db, `users/${id}`);

    const userDoc = await getDoc(refUser);

    return {
        email: userDoc.data().email,
        name: userDoc.data().name,
        pet: userDoc.data().pet
    }
}

/**
 * Guarda los cambios efectuados en el perfil
 * 
 * @param {String} id 
 * @param {Object} data 
 * @returns 
 */
export function saveChanges(id, data) {
    const refUser = doc(collection(db, 'users'), id);

    return updateDoc(refUser, {
        ...data
    })
    .then(() => {
     
    })
}