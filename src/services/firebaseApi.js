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
  doc,
  setDoc,
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
  return setDoc(doc(firestore, 'users', uid), {
    username,
    email,
    followers: [],
    following: [],
    posts: [],
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const createPost = ({ userId, content = '', username }) => {
  return addDoc(collection(firestore, 'posts'), {
    likes: [],
    retweets: [],
    comments: [],
    content,
    userId,
    username,
    createdAt: serverTimestamp(),
  });
};

export const getPosts = (userId, followingIds = []) => {
  const queryRef = query(
    collection(firestore, 'posts'),
    where('userId', 'in', [userId, ...followingIds]),
    orderBy('createdAt', 'desc')
  );
  return getDocs(queryRef);
};

export const updatePost = ({ docId, data, type = 'UPDATE', path = 'likes' }) => {
  const docRef = doc(firestore, 'posts', docId);
  const arrayOperation = type === 'UPDATE' ? arrayUnion : arrayRemove;
  return updateDoc(docRef, {
    [path]: arrayOperation(data),
  });
};

export const getDocById = (docId, path = '') => {
  const docRef = doc(firestore, path, docId);
  return getDoc(docRef);
};

export const updateUserPost = (docId, post) => {
  const docRef = doc(firestore, 'users', docId);
  return updateDoc(docRef, {
    posts: arrayUnion(post),
  });
};

export const updateUserStats = ({ docId, data, type = 'UPDATE', path = 'followers' }) => {
  const docRef = doc(firestore, 'users', docId);
  const arrayOperation = type === 'UPDATE' ? arrayUnion : arrayRemove;
  return updateDoc(docRef, {
    [path]: arrayOperation(data),
  });
};

export const getAllUsers = (collectionName = 'users') => {
  const queryRef = query(collection(firestore, collectionName), orderBy('createdAt', 'desc'));
  return getDocs(queryRef);
};

export const signout = async () => signOut(auth);
