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
    createdAt: serverTimestamp(),
  });
};

export const createNote = ({
  userId,
  tags,
  isPinned,
  cardColor,
  status,
  priority = 'Low',
  content = '',
}) => {
  return addDoc(collection(firestore, 'notes'), {
    content,
    userId,
    tags,
    cardColor,
    status,
    isPinned,
    priority,
    createdAt: serverTimestamp(),
  });
};

export const updateNote = ({
  id,
  userId,
  tags,
  isPinned,
  cardColor,
  status,
  priority,
  content = '',
}) => {
  const docRef = doc(firestore, 'notes', id);
  return updateDoc(docRef, { userId, tags, isPinned, cardColor, status, priority, content });
};

export const deleteNote = (id) => {
  const docRef = doc(firestore, 'notes', id);
  return deleteDoc(docRef);
};

export const getNotes = (userId) => {
  const queryRef = query(collection(firestore, 'notes'), where('userId', '==', userId));
  return getDocs(queryRef);
};

export const createTag = ({ tagName, value, userId, notes = [] }) => {
  return addDoc(collection(firestore, 'tags'), {
    tagName,
    value,
    userId,
    notes,
    createdAt: serverTimestamp(),
  });
};

export const getTags = (userId) => {
  const queryRef = query(
    collection(firestore, 'tags'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return getDocs(queryRef);
};

export const getDocById = (docId, path = '') => {
  const docRef = doc(firestore, path, docId);
  return getDoc(docRef);
};
export const signout = async () => signOut(auth);
