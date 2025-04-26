import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Actualiza los posts del usuario para mostrarlos en el perfil
 * 
 * @param {() => {}} callback 
 * @param {String} userEmail 
 * @returns 
 */
export function subscribeToUserPosts(callback, userEmail) {
    const refPosts = collection(db, 'posts');

    const q = query(refPosts, where('email', '==', userEmail), orderBy('created_at'));

    return onSnapshot(q, snapshot => {

        const posts = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                email: doc.data().email,
                content: doc.data().content,
                title: doc.data().title,
                created_at: doc.data().created_at.toDate(),
                img: doc.data().img
            }
        });

        callback(posts);
    });
}
