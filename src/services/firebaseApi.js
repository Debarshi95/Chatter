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
  ref,
  storage,
  uploadBytes,
  deleteDoc,
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

export const createUser = ({
  username,
  uid,
  email,
  bio = '',
  avatar = 'https://picsum.photos/200/300',
}) => {
  return setDoc(doc(firestore, 'users', uid), {
    username,
    email,
    bio,
    avatar,
    followers: [],
    following: [],
    posts: [],
    bookmarks: [],
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    fullname: '',
  });
};

export const createPost = ({ userId, image, content = '', username }) => {
  return addDoc(collection(firestore, 'posts'), {
    likes: [],
    retweets: [],
    comments: [],
    bookmarks: [],
    content,
    userId,
    username,
    image,
    createdAt: serverTimestamp(),
  });
};

export const getPosts = (userId, followingIds = [], type = '') => {
  let queryRef;
  if (type === 'ALL') {
    queryRef = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
  } else {
    queryRef = query(
      collection(firestore, 'posts'),
      where('userId', 'in', [userId, ...followingIds]),
      orderBy('createdAt', 'desc')
    );
  }
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

export const updateUserProfile = ({ docId, data, type = 'UPDATE', path = 'followers' }) => {
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

export const createComment = ({ postId, userId, text, likes = [], url }) => {
  return addDoc(collection(firestore, 'comments'), {
    text,
    userId,
    postId,
    likes,
    url,
    createdAt: serverTimestamp(),
  });
};

export const uploadAvatar = async (file) => {
  const storageRef = ref(storage, `/avatars/${file.name}`);
  return uploadBytes(storageRef, file);
};

export const uploadPostImage = async (file) => {
  const storageRef = ref(storage, `/posts/${file.name}`);
  return uploadBytes(storageRef, file);
};

export const uploadCommentImage = async (file) => {
  const storageRef = ref(storage, `/comment/${file.name}`);
  return uploadBytes(storageRef, file);
};

export const updateUserInfo = async ({ userId, ...rest }) => {
  const docRef = doc(firestore, 'users', userId);
  return updateDoc(docRef, { ...rest });
};

export const deletePost = async (postId) => {
  const docRef = doc(firestore, 'posts', postId);
  return deleteDoc(docRef);
};

export const getAllComments = async (postId) => {
  const queryRef = query(
    collection(firestore, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'desc')
  );
  return getDocs(queryRef);
};
export const signout = async () => signOut(auth);
