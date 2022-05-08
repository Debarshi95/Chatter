export const getFirstChar = (str = '') => str.charAt(0).toUpperCase();

export const isFollowing = (user, authUserId) => {
  return user?.followers?.find((followers) => followers === authUserId) || false;
};
