const selectSearchData = (state) => state.search;

const selectUsers = (authUserId) => (state) => {
  const { users } = selectSearchData(state);
  return users.filter((user) => user.id !== authUserId);
};

const selectUserById = (id) => (state) => {
  const searchData = selectSearchData(state);
  return searchData.users.find((user) => user.id === id);
};

const selectTrendingPosts = (state) => state.search.posts;
export { selectUsers, selectUserById, selectSearchData, selectTrendingPosts };
