export const getFirstChar = (str = '') => str.charAt(0).toUpperCase();

export const isFollowing = (user, authUserId) => {
  return user?.followers?.includes(authUserId);
};

export const generateFileFromUrl = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return blob;
};

export const toCapitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeTrailingChar = (str = '', char = '') => {
  let sanitizedStr = str;
  if (str.includes(char)) {
    // eslint-disable-next-line prefer-destructuring
    sanitizedStr = str.split(char)[0];
    return sanitizedStr;
  }
  return str;
};
