const selectPosts = (state) => state.posts.posts;
const selectPostById = (id) => (state) => state.posts.posts.find((post) => post.id === id);
export { selectPosts, selectPostById };
