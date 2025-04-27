import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, getUserProfileById, updateUserProfile } from "./user-profile";
import { getFileURL, uploadFile } from "./file-storage";
import { getExtensionFromFile } from "../libraries/file";

const EMPTY_USER_DATA = {
    id: null,
    email: null,
    displayName: null,
    pet: null,
    petBio: null,
    photoURL: null,
    fullyLoaded: false,
}

let userData = EMPTY_USER_DATA;

let observers = [];

if(localStorage.getItem('user') !== null) {
    userData = JSON.parse(localStorage.getItem('user'));
}

// Actualización del estado del usuario dependiendo de su estado en Firestore Authentication
onAuthStateChanged(auth, async user => {
    if(user) {
        setUserData({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        });

        const userProfile = await getUserProfileById(user.uid);
        setUserData({
            pet: userProfile.pet,
            petBio: userProfile.petBio,
            fullyLoaded: true,
        })
    } else {
        setUserData(EMPTY_USER_DATA);
    }
});

/**
 * Crea una cuenta de usuario con email y password, y lo autentica.
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} name 
 * @returns {Promise<void>}
 */
export async function register(email, password) {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuario creado. ID: ", userCredentials.user.uid)


        // displayname

        //Creamos el perfil del usuario
        await createUserProfile(userCredentials.user.uid, {email});
    } catch (error) {
        console.error("[auth.js register] Error al crear una cuenta: ", error.code)
        throw error;
    }
}

/**
 * Inicia sesión con las credenciales email y password
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<void>}
 */
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            console.log("Usuario autenticado. ID: ", userCredentials.user.uid);
        })
        .catch(error => {
            console.error("[auth.js login] Error al crear una cuenta: ", error.code);
            throw error;
        });
}

/**
 * Actualiza los datos del usuario
 * 
 * @param {{displayName: string|null, pet: string|null, petBio: string|null}}
 * @returns {Promise<void>}
 */
export async function updateUser({displayName, pet, petBio}) {
    try {
       const authPromise = updateProfile(auth.currentUser, {displayName});

       const firestorePromise = updateUserProfile(userData.id, {displayName, pet, petBio});

       await Promise.all([authPromise, firestorePromise]);

       setUserData({
            displayName,
            pet,
            petBio,
       })
    } catch (error) {
        throw error;
    }
}

/**
 * Actualiza la foto de perfil del usuario
 * 
 * @param {File} photo 
 * @returns {Promise}
 */
export async function updateUserPhoto(photo) {
    try {
        const fileName = `users/${userData.id}/avatar.${getExtensionFromFile(photo)}`;
        await uploadFile(fileName, photo);
        const photoURL = await getFileURL(fileName);

        // Actualiza Firebase Auth y Firestore
        const authPromise = updateProfile(auth.currentUser, { photoURL });
        const storagePromise = updateUserProfile(userData.id, { photoURL });
        await Promise.all([authPromise, storagePromise]);

       
        setUserData({ photoURL }); // Esto actualiza userData y llama a notifyAll()

        return photoURL;
    } catch (error) {
        throw error;
    }
}

/**
 * Desloguea al usuario
 *
 * @returns {Promise<void>}
 */
export function logout() {
    localStorage.removeItem('user')
    return signOut(auth);
}

/**
 * Suscribe un observer (el callback) para la autenticación.
 * Este callback va a ejecutarse cada vez que el estado cambie, y cuando se
 * suscribe.
 * Retorna una función para cancelar la suscripción.
 * 
 * @param {() => {}} callback 
 * @returns {() => void}
 */
export function subscribeToAuth(callback) {
    observers.push(callback);
    notify(callback);
    return () => { 
        observers = observers.filter(obs => obs !== callback);

    };
}

/**
 * Notifica a un observer de los datos actuales del usuario.
 * 
 * @param {() => {}} observer 
 */
function notify(observer) {
    observer({...userData});
}

/**
 * Notifica a todos los observers.
 * 
 * Esta función debe invocarse cada vez que la variable userData cambie.
 */
function notifyAll() {
    observers.forEach(observer => notify(observer));
}

/**
 * Actualiza los datos, o parte de ellos, del objeto userData, y notifica a todos
 * los observers suscritos del cambio.
 * 
 * @param {{}} newData 
 */
function setUserData(newData) {
    userData = {
        ...userData,
        ...newData,
    }

    localStorage.setItem('user', JSON.stringify(userData));

    notifyAll();
}