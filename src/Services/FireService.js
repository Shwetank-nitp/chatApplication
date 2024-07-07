import {
  apiKey,
  appId,
  authDomain,
  measurementId,
  messagingSenderId,
  projectId,
  storageBucket,
} from "../../envConfig";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

class FireService {
  db;
  constructor() {
    const configs = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      measurementId,
    };

    this.app = initializeApp(configs);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  async login(email, password) {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredentials.user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async createAccount(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async uploadImage(file) {
    const metaData = {
      contentType: file.type,
      size: file.size,
    };
    const imgRef = ref(
      this.storage,
      `profile_pics/_${Date.now()}_${file.name}}`
    );
    const uploadTask = uploadBytesResumable(imgRef, file, metaData);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapsort) => {
          const progress = snapsort.bytesTransferred / snapsort.totalBytes;
          console.log(`process completed ${progress * 100}%`);
          switch (snapsort.state) {
            case "paused":
              console.log("process paused");
              break;
            case "canceled":
              console.log("process canceled");
              break;
            case "success":
              console.log("process successfull");
              break;
            case "error":
              console.log("failed");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        async () => {
          const url = getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  }

  async getAccount() {
    try {
      return new Promise((resolve, reject) => {
        onAuthStateChanged(
          this.auth,
          (user) => {
            resolve(user ? user.toJSON() : null);
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      console.log("signout-user");
    } catch (error) {
      throw error;
    }
  }

  async createDocument(data, id = undefined, collectionName = "users") {
    try {
      if (id) {
        const docRef = doc(this.db, collectionName, id);
        await setDoc(docRef, data);
        return { id: docRef.id };
      } else {
        const collectionRef = collection(this.db, collectionName);
        const docRef = await addDoc(collectionRef, data);
        return { id: docRef.id };
      }
    } catch (error) {
      throw error;
    }
  }

  async updateDocument(data, id, collection) {
    try {
      const docRef = doc(this.db, collection, id);
      await updateDoc(docRef, data);
      return docRef;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id, collection = "users") {
    try {
      const document = await getDoc(doc(this.db, collection, id)); // return a snapshort object
      if (document.exists()) {
        return document.data();
      } else {
        console.warn("NO Document of such id found");
      }
    } catch (error) {
      throw error;
    }
  }
  async getDocumentByQuary(objectQuery = {}, col = "users") {
    try {
      const { where } = objectQuery;

      const collectionRef = collection(this.db, col);
      const q = query(collectionRef, where);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      throw error;
    }
  }
  async getRealTimeData(id, collName = "users") {
    // To get real-time data
    
  }
}

export const fireService = new FireService();
