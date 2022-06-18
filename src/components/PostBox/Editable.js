import toast from 'react-hot-toast';
import { Button } from 'components';
import { useRef, useState } from 'react';
import { BsUpload } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { selectPostState } from 'store/selectors';
import { validImageTypes } from 'constants/fileTypes';

const Editable = ({ type, onComment, onCreate, placeholder }) => {
  const [postImage, setPostImage] = useState(null);
  const contentRef = useRef(null);
  const { isUploading } = useSelector(selectPostState);

  const handleCreatePost = () => {
    if (contentRef.current.textContent === '') return;

    if (type === 'COMMENT') {
      onComment({ image: postImage, text: contentRef.current.textContent });
    } else {
      onCreate({ image: postImage, content: contentRef.current.textContent });
    }
    setPostImage(null);
    contentRef.current.textContent = '';
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.split('/')[1];

    if (!validImageTypes.includes(fileType)) {
      return toast.error('Only images of type png/jpg or jpeg allowed');
    }
    setPostImage(file);
    return null;
  };

  return (
    <>
      <article>
        <div
          role="textbox"
          aria-hidden
          ref={contentRef}
          contentEditable
          className="bg-transparent my-4 text-base outline-none w-full h-full text-slate-300"
          data-placeholder={placeholder}
        />
        {postImage && <img alt="" src={postImage && URL.createObjectURL(postImage)} />}
      </article>
      <div className="flex items-center justify-between tooltip">
        <label className="block w-9 cursor-pointer" data-tooltip="Add Image">
          <BsUpload htmlFor="postImg" className="block relative text-gray-300 text-2xl font-bold" />
          <input type="file" name="postImg" className="absolute top-0 z-0" onChange={handleImage} />
        </label>
        <Button
          className="w-32 relative rounded-lg p-2 bg-slate-700 text-base text-white ml-auto"
          onClick={handleCreatePost}
          disabled={isUploading === 'pending'}
        >
          {isUploading === 'pending' ? 'Posting' : 'Post'}
        </Button>
      </div>
    </>
  );
};

Editable.defaultProps = {
  onComment: () => null,
  onCreate: () => null,
};
export default Editable;
