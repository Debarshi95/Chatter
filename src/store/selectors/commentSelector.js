const selectCommentState = (state) => state.comments;
const selectPostComments = (state) => state.comments.comments;

export { selectPostComments, selectCommentState };
