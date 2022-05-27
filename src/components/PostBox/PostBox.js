import sanitizeHtml from 'sanitize-html';
import toast from 'react-hot-toast';
import { useRef, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { BsUpload } from 'react-icons/bs';
import { CardHeader, Button, PostBoxFooter } from 'components';
import { validImageTypes } from 'constants/fileTypes';
import { useSelector } from 'react-redux';
import { selectPostState } from 'store/selectors';

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
  const [postImage, setPostImage] = useState(null);
  const contentRef = useRef(null);

  const { isUploading } = useSelector(selectPostState);

  const handlePostClick = () => {
    if (contentRef.current.textContent === '') return;

    if (type === 'COMMENT') {
      onComment({ image: postImage, text: contentRef.current.textContent });
    } else {
      onCreatePost({ image: postImage, content: contentRef.current.textContent });
    }
    setPostImage(null);
    contentRef.current.textContent = '';
  };

  const handlePostImage = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.split('/')[1];

    if (!validImageTypes.includes(fileType)) {
      return toast.error('Only images of type png/jpg or jpeg allowed');
    }
    setPostImage(file);
    return null;
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
        <article>
          <div
            role="textbox"
            aria-hidden
            ref={contentRef}
            contentEditable={contentEditable}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.content || post?.text) }}
            className="bg-transparent my-4 text-base outline-none w-full h-full text-slate-300"
            data-placeholder={placeholder}
          />
          {(postImage || post?.image || post?.url) && (
            <img
              alt=""
              src={(postImage && URL.createObjectURL(postImage)) || post.image || post?.url}
            />
          )}
        </article>
        {contentEditable && (
          <div className="flex items-center justify-between tooltip">
            <label className="block w-9 cursor-pointer" data-tooltip="Add Image">
              <BsUpload
                htmlFor="postImg"
                className="block relative text-gray-300 text-2xl font-bold"
              />
              <input
                type="file"
                name="postImg"
                className="absolute top-0 z-0"
                onChange={handlePostImage}
              />
            </label>
            <Button
              className="w-32 relative rounded-lg p-2 bg-slate-700 text-base text-white ml-auto"
              onClick={handlePostClick}
            >
              {isUploading ? 'Posting' : 'Post'}
            </Button>
          </div>
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
