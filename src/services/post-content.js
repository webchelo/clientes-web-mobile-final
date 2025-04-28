import { addDoc, arrayUnion, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Traemos los datos del usuario con el id provisto.
 * 
 * @param {string} id 
 * @returns {Promise}
 */
export async function getPostById(id) {
    const refPost = doc(db, `posts/${id}`);
    const postDoc = await getDoc(refPost);

    return {
        id: postDoc.id,
        user_id: postDoc.data().user_id,
        email: postDoc.data().email,
        displayName: postDoc.data().displayName,
        content: postDoc.data().content,
        title: postDoc.data().title,
        comments: postDoc.data().comments,
        img: postDoc.data().img,
    }
}

/**
 * Sube un comentario a firestore como un array
 * 
 * @param {String} id 
 * @param {Object} data 
 * @returns 
 */
export async function createComment(id, data) {
    const refPost = doc(db, `posts/${id}`);
  
    await updateDoc(refPost, {
        saveServerTimestamp: serverTimestamp()
    });
    const updatedPostDoc = await getDoc(refPost);
    const serverTime = updatedPostDoc.data().saveServerTimestamp;

    const comment = {
        ...data,
        created_at: serverTime
    };

    await updateDoc(refPost, {
        comments: arrayUnion(comment)
    });

    return comment;
}

/**
 * Actualiza los comentarios
 * 
 * @param {String} id 
 * @param {() => {}} callback 
 * @returns 
 */
export async function subscribeToComments(id, callback) {
    const refPost = doc(db, `posts/${id}`);

    return onSnapshot(refPost, snapshot => {
            const data = snapshot.data();
            const post = {
                comments: data.comments || []
            };
            
            callback(post);
    });

}