/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  selectAuthUser,
  selectCommentState,
  selectPostById,
  selectPostComments,
} from 'store/selectors';
import { CardHeader, Loader, PostBox, Text } from 'components';
import { createComment, getPostById, getPostComments } from 'store/reducers/slices';

const Comment = () => {
  const dispatch = useDispatch();
  const { postId = '' } = useParams();

  const authUser = useSelector(selectAuthUser);
  const { comments, post, loading } = useSelector(selectCommentState);
  console.log({ post });
  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
      dispatch(getPostComments(postId));
    }
  }, [dispatch, postId]);

  const handleCreateComment = async ({ image, text }) => {
    dispatch(createComment({ postId: post.id, userId: authUser.id, text, image }));
  };

  if (loading) return <Loader />;

  return (
    <div className="p-2 flex-1">
      <Text className="text-gray-300 text-xl mb-2 text-center"> Comments</Text>
      {post && (
        <div>
          <PostBox post={post} user={post.user} showPostIcons={false} />
          <PostBox
            user={authUser}
            contentEditable
            placeholder="Enter your comment"
            type="COMMENT"
            showPostIcons={false}
            onComment={handleCreateComment}
            headerComponent={
              <CardHeader
                avatarClassName="w-20 h-20"
                avatar={authUser?.avatar}
                userId={authUser?.id}
                username={authUser?.username}
                fullname={authUser?.fullname}
              />
            }
          />
        </div>
      )}
      <div>
        {comments.map((comment) => (
          <PostBox
            key={comment.id}
            user={comment.user}
            showPostIcons={false}
            post={comment}
            headerComponent={
              <CardHeader
                avatarClassName="w-20 h-20"
                avatar={comment?.user?.avatar}
                userId={comment?.user?.id}
                username={comment?.user?.username}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
