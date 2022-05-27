import sanitizeHtml from 'sanitize-html';
import { useRef } from 'react';
import { MdDelete } from 'react-icons/md';
import { CardHeader, Button, PostBoxFooter } from 'components';

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
    <div className="bg-slate-800 border border-gray-700 rounded-lg p-2 mb-2">
      {headerComponent || (
        <CardHeader
          avatarClassName="w-14 h-14"
          avatar={post?.user?.avatar}
          userId={post?.user?.id}
          username={post?.user?.username}
          fullname={post?.user?.fullname}
        />
      )}
      <div className="flex flex-col px-4">
        <div
          role="textbox"
          aria-hidden
          ref={contentRef}
          contentEditable={contentEditable}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.content || post?.text) }}
          className="bg-transparent my-4 text-base outline-none w-full h-full text-slate-300"
          data-placeholder={placeholder}
        />
        {contentEditable && (
          <Button
            className="w-32 rounded-lg p-2 bg-slate-700 text-base text-white ml-auto"
            onClick={handlePostClick}
          >
            Post
          </Button>
        )}
        {showPostIcons && (
          <div className="flex content-between text-slate-300 text-2xl cursor-pointer py-3 border-stone-500 border-t">
            <PostBoxFooter post={post} onUpdate={onUpdatePost} />
            {canDeletePost && (
              <MdDelete className="block font-thin" onClick={() => onDeletePost(post.id)} />
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
