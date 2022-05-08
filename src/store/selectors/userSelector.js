const selectUserProfileState = (state) => state.user;

const selectUserPosts = (state) => state.user.posts;

export { selectUserProfileState, selectUserPosts };
