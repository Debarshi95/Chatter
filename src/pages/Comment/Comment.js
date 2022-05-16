/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectAuthUser, selectPostById, selectPostComments } from 'store/selectors';
import { CardHeader, PostBox, Text } from 'components';
import { createComment, getPostComments } from 'store/reducers/slices';

const Comment = () => {
  const dispatch = useDispatch();
  const { postId = '' } = useParams();

  const post = useSelector(selectPostById(postId));
  const authUser = useSelector(selectAuthUser);
  const comments = useSelector(selectPostComments);

  useEffect(() => {
    if (!post?.comments) {
      dispatch(getPostComments(postId));
    }
  }, [dispatch, post, postId]);

  const handleCreateComment = async (value) => {
    dispatch(createComment({ postId: post.id, userId: authUser.id, text: value }));
  };

  return (
    <div className="p-4">
      {post && (
        <div>
          <PostBox post={post} user={post.user} />
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
              />
            }
          />
        </div>
      )}
      <div>
        <Text className="text-gray-300 text-xl mb-2"> Comments</Text>
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
