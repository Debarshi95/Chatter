import sanitizeHtml from 'sanitize-html';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CardHeader, Button } from 'components';
import { requestCreatePost } from 'store/reducers/slices';

const PostBox = ({ contentEditable, post, user }) => {
  const contentRef = useRef(null);
  const dispatch = useDispatch();

  const handleCreatePost = () => {
    if (contentRef.current.textContent === '') return;
    dispatch(
      requestCreatePost({
        content: contentRef.current.textContent,
        userId: user.id,
        username: user.username,
        following: user.following,
      })
    );
    contentRef.current.textContent = '';
  };
  return (
    <div className="border-2 border-slate-700 rounded-lg min-h-full p-4 mb-4">
      <header className="flex text-white">
        <CardHeader
          userId={post?.userId}
          username={post?.username || user?.username}
          authUserId={user.id}
        />
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
    </div>
  );
};

PostBox.defaultProps = {
  contentEditable: false,
  post: null,
  user: null,
};
export default PostBox;
