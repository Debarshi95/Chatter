import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  firestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
  orderBy,
  arrayUnion,
  arrayRemove,
} from 'Firebase';

export const signup = async ({ email, password }) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signin = async ({ email, password }) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const checkUserNameTaken = async (username = '') => {
  const queryDoc = query(collection(firestore, 'users'), where('username', '==', username));
  return getDocs(queryDoc);
};

export const createUser = ({ username, uid, email }) => {
  return addDoc(collection(firestore, 'users'), {
    uid,
    username,
    email,
    followers: [],
    following: [],
    posts: [],
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const createPost = ({ userId, content = '' }) => {
  return addDoc(collection(firestore, 'posts'), {
    content,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const deleteNote = (id) => {
  const docRef = doc(firestore, 'notes', id);
  return deleteDoc(docRef);
};

export const getPosts = (userId) => {
  const queryRef = query(
    collection(firestore, 'posts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return getDocs(queryRef);
};

export const getDocById = (docId, path = '') => {
  const docRef = doc(firestore, path, docId);
  return getDoc(docRef);
};

export const getUserData = (userId) => {
  const queryRef = query(collection(firestore, 'users'), where('uid', '==', userId));
  return getDocs(queryRef);
};

export const updateUserPost = (docId, post) => {
  const docRef = doc(firestore, 'users', docId);
  return updateDoc(docRef, {
    posts: arrayUnion(post),
  });
};

export const updateUserStats = ({ docId, userId, type = 'UPDATE', path = 'followers' }) => {
  const docRef = doc(firestore, 'users', docId);
  const arrayOperation = type === 'UPDATE' ? arrayUnion : arrayRemove;
  return updateDoc(docRef, {
    [path]: arrayOperation(userId),
  });
};

export const getAllUsers = (currentUserId, collectionName = 'users') => {
  const queryRef = query(collection(firestore, collectionName), where('uid', '!=', currentUserId));
  return getDocs(queryRef);
};

export const signout = async () => signOut(auth);
