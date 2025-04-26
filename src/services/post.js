import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getExtensionFromFile } from "../libraries/file";
import { getFileURL, uploadFile } from "./file-storage";

/**
 * Guarda un Post en Firebase
 * 
 * @param {{email: string, content: string}} data 
 * @returns {Promise<null>}
 */
export function savePost(data, img) {
    const refPosts = collection(db, 'posts');

    return addDoc(refPosts, {
        ...data,
        created_at: serverTimestamp(),
    })
        .then(async doc => {
        });
}

/**
 * Permite editar un Post
 * 
 * @param {Object} data 
 * @param {String} id 
 * @returns 
 */
export function editPost(data, id) {

    const refPost = doc(db, `posts/${id}`);

    return updateDoc(refPost, {
        ...data
    }).then(() => {
    
    })
}

/**
 * Ejecuta el callback cada vez que los Posts cambien actualizandolos
 * 
 * 
 * @param {(posts: {email: string, content: string}[]) => null} callback 
 * @returns {Unsubscribe}
 */
export function subscribeToAllPosts(callback) {
    const refPosts = collection(db, 'posts');

    const q = query(refPosts, orderBy('created_at'));

    return onSnapshot(q, snapshot => {

        const posts = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                email: doc.data().email,
                title: doc.data().title,
                content: doc.data().content,
                created_at: doc.data().created_at.toDate(),
                img: doc.data().img,
            }
        });

        callback(posts);
    });
}

/**
 * Sube una imagen para el Post
 * 
 * @param {File} imgData 
 * @param {String} id 
 * @returns {Promise<null>}
 */
export async function updateImg(imgData, id) {
    try {
        const fileName = `posts/${id}/img.${getExtensionFromFile(imgData)}`;

        await uploadFile(fileName, imgData);

        const imgURL = await getFileURL(fileName);

        const storagePromise = updatePostImg(id, { img: imgURL });

        return Promise.all([storagePromise]);
    } catch (error) {
        throw error;
    }
}

/**
 * Actualiza la imagen del Post
 * 
 * @param {String} id 
 * @param {Object} data 
 */
export async function updatePostImg(id, data) {
    const refPost = doc(db, `posts/${id}`);
    await updateDoc(refPost, data);
}