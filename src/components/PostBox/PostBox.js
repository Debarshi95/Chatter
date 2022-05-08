import sanitizeHtml from 'sanitize-html';
import cn from 'clsx';
import { BiComment } from 'react-icons/bi';
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CardHeader, Button } from 'components';
import { requestCreatePost, requestUpdatePost } from 'store/reducers/slices';

const PostBox = ({ contentEditable, post, user }) => {
  const contentRef = useRef(null);
  const dispatch = useDispatch();

  const username = post?.username || user?.username || '';

  const handleCreatePost = () => {
    if (contentRef.current.textContent === '') return;
    dispatch(
      requestCreatePost({
        content: contentRef.current.textContent,
        userId: user.uid,
        username: user.username,
        following: user.following,
      })
    );
    contentRef.current.textContent = '';
  };

  const handleOnButtonClick = useCallback(
    (path = 'likes', type = 'UPDATE') => {
      switch (type) {
        case 'UPDATE':
          return dispatch(
            requestUpdatePost({
              type,
              postId: post.id,
              userId: user.uid,
              path,
              following: user.following,
            })
          );
        case 'DELETE':
          return dispatch(
            requestUpdatePost({
              type: 'DELETE',
              postId: post.id,
              userId: user.uid,
              path,
              following: user.following,
            })
          );
        default:
          return null;
      }
    },
    [dispatch, post?.id, user?.following, user?.uid]
  );

  const renderRetweetButton = useCallback(() => {
    const tweeted = post?.retweets?.find((id) => id === user?.uid) || false;
    const type = tweeted ? 'DELETE' : 'UPDATE';

    return (
      <div onClick={() => handleOnButtonClick('retweets', type)} role="button" aria-hidden>
        <AiOutlineRetweet className={cn('block hover:text-gray-300', { 'text-white': tweeted })} />
      </div>
    );
  }, [handleOnButtonClick, post?.retweets, user?.uid]);

  const renderLikeButton = useCallback(() => {
    const liked = post?.likes?.find((id) => id === user?.uid) || false;
    const type = liked ? 'DELETE' : 'UPDATE';

    return (
      <div onClick={() => handleOnButtonClick('likes', type)} role="button" aria-hidden>
        {liked ? (
          <AiFillHeart className="text-white" />
        ) : (
          <AiOutlineHeart className="block hover:text-gray-300" />
        )}
      </div>
    );
  }, [handleOnButtonClick, post?.likes, user?.uid]);

  return (
    <div className="border-2 border-slate-700 rounded-lg p-4 mb-4">
      <header className="flex text-white">
        <CardHeader userId={post?.userId} username={username} authUserId={user?.uid} />
      </header>
      <div className="flex flex-col">
        <div
          ref={contentRef}
          contentEditable={contentEditable}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.content) }}
          className="bg-transparent my-6 text-lg outline-none w-full h-full text-gray-300"
          data-placeholder="Write something interesting..."
        />
        {contentEditable && (
          <Button
            className="w-32 rounded-lg p-2 text-base bg-gray-200 ml-auto"
            onClick={handleCreatePost}
          >
            Post
          </Button>
        )}
      </div>
      {!contentEditable && (
        <div className="flex text-gray-500 text-2xl justify-between cursor-pointer">
          <BiComment className="block hover:text-white" />
          {renderRetweetButton()}
          {renderLikeButton()}
        </div>
      )}
    </div>
  );
};

PostBox.defaultProps = {
  contentEditable: false,
  post: null,
  user: null,
};
export default PostBox;
