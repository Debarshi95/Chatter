export const getFirstChar = (str = '') => str.charAt(0).toUpperCase();

export const isFollowing = (user, authUserId) => {
  return user?.followers?.includes(authUserId);
};

export const generateFileFromUrl = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return blob;
};
