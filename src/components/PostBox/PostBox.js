import sanitizeHtml from 'sanitize-html';
import { BiComment } from 'react-icons/bi';
import { MdOutlineDelete } from 'react-icons/md';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CardHeader, Button, PostBoxFooter } from 'components';
import { createPost } from 'store/reducers/slices';

const PostBox = ({ contentEditable, post, headerComponent, user, canDeletePost, onDeletePost }) => {
  const contentRef = useRef(null);
  const dispatch = useDispatch();

  const handleCreatePost = () => {
    if (contentRef.current.textContent === '') return;
    dispatch(
      createPost({
        content: contentRef.current.textContent,
        user,
      })
    );
    contentRef.current.textContent = '';
  };

  return (
    <div className="bg-slate-700 rounded-lg p-4 mb-4">
      {headerComponent || (
        <CardHeader
          avatarClassName="w-20 h-20"
          avatar={post?.user?.avatar}
          userId={post?.user?.userId}
          username={post?.user?.username}
        />
      )}
      <div className="flex flex-col">
        <div
          ref={contentRef}
          contentEditable={contentEditable}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.content) }}
          className="bg-transparent my-6 text-lg outline-none w-full h-full text-gray-300"
          data-placeholder="Write something interesting..."
        />
        {contentEditable ? (
          <Button
            className="w-32 rounded-lg p-2 bg-slate-500 text-base text-white ml-auto"
            onClick={handleCreatePost}
          >
            Post
          </Button>
        ) : (
          <div className="flex text-gray-500 text-2xl  cursor-pointer">
            <BiComment className="block mr-auto hover:text-white" />
            <PostBoxFooter post={post} />
            {canDeletePost && (
              <MdOutlineDelete
                className="text-2xl text-white block ml-16 hover:text-white"
                onClick={() => onDeletePost(post.id)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

PostBox.defaultProps = {
  contentEditable: false,
  post: null,
  user: null,
  canDeletePost: false,
};
export default PostBox;
