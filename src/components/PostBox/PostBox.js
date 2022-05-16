import sanitizeHtml from 'sanitize-html';
import cn from 'clsx';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { BiComment } from 'react-icons/bi';
import { MdOutlineDelete } from 'react-icons/md';
import { CardHeader, Button, PostBoxFooter } from 'components';
import { createPost } from 'store/reducers/slices';

const PostBox = ({
  contentEditable,
  post,
  headerComponent,
  user,
  canDeletePost,
  onDeletePost,
  onUpdatePost,
}) => {
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
          userId={post?.user?.id}
          username={post?.user?.username}
        />
      )}
      <div className="flex flex-col px-4">
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
          <div className="flex text-slate-300 text-2xl cursor-pointer">
            <BiComment
              className={
                (cn('block mr-auto hover:text-slate-500 '),
                {
                  'mr-10': canDeletePost,
                })
              }
            />
            <PostBoxFooter post={post} onUpdate={onUpdatePost} />
            {canDeletePost && (
              <MdOutlineDelete
                className="text-2xl block ml-4 md:ml-20 hover:text-white"
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
  onDeletePost: null,
  onUpdatePost: null,
};
export default PostBox;
