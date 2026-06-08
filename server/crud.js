// .env configuration
// const path= require("path")
// require("dotenv").config({path:path.resolve(__dirname,"../../.env")})
require("dotenv").config()
// import what I need
const { initializeApp } = require("firebase/app");
const { 
    getFirestore, 
    doc, 
    setDoc, 
    collection, 
    getDocs, 
    query, 
    deleteDoc, 
    updateDoc, 
    deleteField 
} = require("firebase/firestore");
const randomId = () => {
    const digits = "A0BC1DbcdefjhE2FG3mnzyxHI4JK5LM6NO7PQ8UpquRS9TVWorstvwZYXaigkl"
    let random = "";
    for (let index = 0; index < 20; index++) {
        random += digits[Math.floor(Math.random() * digits.length)];
    }
    return random;
}
// TODO: Add SDKs for Firebase products that you want to use
let firestoreDB, app;

// Configuration & Initialize Firebase
const initializeFirebaseApp = (firebaseConfig) => {
    try {
        app = initializeApp(firebaseConfig);
        firestoreDB = getFirestore(app);
        return app;
    } catch (error) {
        console.log(error, "firebase-initializeFirebaseApp");
        throw error;
    }
};

const configuration = () => {
    try {
        const firebaseConfig = {
            apiKey: process.env.apiKey,
            authDomain:`${process.env.projectId}.firebaseapp.com`,
            projectId: process.env.projectId,
            storageBucket: `${process.env.projectId}.firebasestorage.app`,
            messagingSenderId: process.env.messagingSenderId,
            appId: process.env.appId
        };
        initializeFirebaseApp(firebaseConfig);
    } catch (error) {
        throw error;
    }
};

// Create & Update Document
const uploadProcessData = async (
    dataToUpload = {},
    collectionName,
    documentId
) => {
    try {
        if (!firestoreDB) {
            console.error("FirestoreDB hasn't been initialized yet");
            return;
        }
        // Generates a new ID if documentId is not provided
        const id = documentId || doc(collection(firestoreDB, "_")).id;
        const document = doc(firestoreDB, collectionName, id);
        await setDoc(document, dataToUpload);
        return;
    } catch (error) {
        console.log(error, "firebase-uploadProcessData");
    }
};

// Get Firebase App
const getFirebaseApp = () => app;

// Read the docs of a collection
const GetData = async (collectionName) => {
    try {
        if (!firestoreDB) {
            console.error("FirestoreDB hasn't been initialized yet");
            return [];
        }
        const collectionRef = collection(firestoreDB, collectionName);
        const finalData = [];
        const q = query(collectionRef);
        const docSnap = await getDocs(q);
        docSnap.forEach((doc) => {
            finalData.push(doc.data());
        });
        return finalData;
    } catch (error) {
        throw error;
    }
};

// Delete Doc
const deleteDocument = async (collectionName, documentId) => {
    try {
        if (!firestoreDB) {
            console.error("Firestore DB not initialized. Call initializeFirebaseApp first.");
            return false;
        }
        const docRef = doc(firestoreDB, collectionName, documentId);
        await deleteDoc(docRef);
        console.log(`Document with ID '${documentId}' successfully deleted from collection '${collectionName}'.`);
        return true;
    } catch (error) {
        console.error(`Error deleting document '${documentId}' from collection '${collectionName}':`, error);
        return false;
    }
};

// Delete Field
const delField = async (collectionName, documentId, fieldToDelete) => {
    try {
        if (!firestoreDB) {
            console.error("FirestoreDB haven't been initialized yet");
            return;
        }
        const docRef = doc(firestoreDB, collectionName, documentId);
        await updateDoc(docRef, {
            [fieldToDelete]: deleteField()
        });
        return "Deleted";
    } catch (error) {
        console.log("Couldn't remove field:", error);
        throw error;
    }
};

// Exporting all functions using CommonJS
module.exports = {
    configuration,
    uploadProcessData,
    getFirebaseApp,
    GetData,
    deleteDocument,
    delField,
    randomId
};