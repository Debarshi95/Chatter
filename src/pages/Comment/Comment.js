import sanitizeHtml from 'sanitize-html';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCommentState } from 'store/selectors';
import { Loader, PostBox, Text } from 'components';
import { createComment, getPostById, getPostComments } from 'store/reducers/slices';
import useDocumentTitle from 'hooks/useDocumentTitle';
import { withProtectedRoute } from 'hoc';

const Comment = ({ user: authUser }) => {
  const dispatch = useDispatch();
  const { postId = '' } = useParams();
  const { comments, post, loading } = useSelector(selectCommentState);

  useDocumentTitle('Comment | Chatter');

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
      dispatch(getPostComments(postId));
    }
  }, [dispatch, postId]);

  const dispatchCreateComment = async ({ image, text }) => {
    dispatch(createComment({ postId: post.id, userId: authUser.id, text, image }));
  };

  if (loading) return <Loader />;

  return (
    <div className="p-2 flex-1">
      <Text className="text-gray-300 text-xl mb-2 text-center"> Comments</Text>
      {post && (
        <div>
          <PostBox key={post.id} post={post}>
            <PostBox.Header
              avatarClassName="w-16 h-16"
              avatar={post?.user?.avatar}
              userId={post?.user?.id}
              username={post?.user?.username || post?.user?.fullname}
            />
            <PostBox.Content>
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.content) }}
                contentEditable
                className="bg-transparent my-4 text-base outline-none w-full h-full text-slate-300"
              />
              {post?.image && <img alt="" src={post.image} />}
            </PostBox.Content>
          </PostBox>
          <PostBox>
            <PostBox.Header
              avatarClassName="w-16 h-16"
              avatar={authUser?.avatar}
              userId={authUser?.id}
              username={authUser?.username}
              fullname={authUser?.fullname}
            />
            <PostBox.Editable
              onComment={dispatchCreateComment}
              type="COMMENT"
              placeholder="Make some comment.."
            />
          </PostBox>
        </div>
      )}
      <div>
        {comments.map((comment) => {
          return (
            <PostBox key={comment.id}>
              <PostBox.Header
                avatarClassName="w-20 h-20"
                avatar={comment?.user?.avatar}
                userId={comment?.user?.userId}
                username={comment?.user?.username}
              />
              <PostBox.Content>
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment?.text) }}
                  className="bg-transparent my-4 text-base outline-none w-full h-full text-slate-300"
                />
                {comment?.url && <img alt="" src={comment.url} />}
              </PostBox.Content>
            </PostBox>
          );
        })}
      </div>
    </div>
  );
};

export default withProtectedRoute(Comment);
