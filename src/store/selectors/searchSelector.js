const selectSearchData = (state) => state.search;

const selectUsers = (state) => state.search.users;

const selectUserById = (id) => (state) => {
  const users = selectUsers(state);
  return users.find((user) => user.uid === id);
};

export { selectUsers, selectUserById, selectSearchData };
