import sanitizeHtml from 'sanitize-html';
import cn from 'clsx';
import { useRef } from 'react';
import { BiComment } from 'react-icons/bi';
import { MdOutlineDelete } from 'react-icons/md';
import { CardHeader, Button, PostBoxFooter } from 'components';
import { Link } from 'react-router-dom';

const PostBox = ({
  contentEditable,
  post,
  headerComponent,
  canDeletePost,
  onDeletePost,
  onUpdatePost,
  onCreatePost,
  placeholder,
  onComment,
  type,
  showPostIcons,
}) => {
  const contentRef = useRef(null);

  const handlePostClick = () => {
    if (contentRef.current.textContent === '') return;

    if (type === 'COMMENT') {
      onComment(contentRef.current.textContent);
    } else {
      onCreatePost(contentRef.current.textContent);
    }

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
          role="textbox"
          aria-hidden
          ref={contentRef}
          contentEditable={contentEditable}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.content || post?.text) }}
          className="bg-transparent my-6 text-lg outline-none w-full h-full text-gray-300"
          data-placeholder={placeholder}
        />
        {contentEditable && (
          <Button
            className="w-32 rounded-lg p-2 bg-slate-500 text-base text-white ml-auto"
            onClick={handlePostClick}
          >
            Post
          </Button>
        )}
        {showPostIcons && (
          <div className="flex text-slate-300 text-2xl cursor-pointer">
            <Link to={`/comment/${post?.id}`} className="flex">
              <BiComment
                className={
                  (cn('block mr-auto hover:text-slate-500 '),
                  {
                    'mr-10': canDeletePost,
                  })
                }
              />
              <p className="text-base ml-2">{post?.comments?.length}</p>
            </Link>
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
  placeholder: 'Write something interesting...',
  onComment: () => null,
  onCreatePost: () => null,
  type: null,
  showPostIcons: true,
};
export default PostBox;
