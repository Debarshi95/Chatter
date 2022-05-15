/* eslint-disable jsx-a11y/label-has-associated-control */
import ReactModal from 'react-modal';
import { useState } from 'react';
import { Avatar, Button, Text } from 'components';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from 'store/reducers/slices';

ReactModal.setAppElement(document.querySelector('body'));

const validFileExt = ['png', 'jpg', 'jpeg'];

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [userDetails, setUserDetails] = useState({
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
  });
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.split('/')[1];

    if (!validFileExt.includes(fileType)) {
      return setError('Only images of type png/jpg or jpeg allowed');
    }

    setUserDetails({
      ...userDetails,
      avatar: file,
    });
    return null;
  };

  const handleInputChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = () => {
    dispatch(updateUserInfo({ ...userDetails, userId: user.id }));
    onClose(false);
  };
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      style={{
        content: {
          inset: 0,
          position: 'fixed',
          border: 'none',
          background: '#334155',
          maxWidth: '24rem',
          width: '100%',
          height: '90%',
          margin: '2rem auto 0 auto',
          zIndex: 999,
        },
        overlay: {
          background: 'rgb(0, 0, 0, 0.4)',
        },
      }}
    >
      <div className="p-2">
        <input
          id="avatar"
          type="file"
          title="Change your avatar"
          className="bg-transparent hidden"
          onChange={handleUploadImage}
        />
        <label htmlFor="avatar">
          <Avatar
            className="mx-auto w-48 h-48 mb-2 cursor-pointer"
            url={
              typeof userDetails.avatar === 'object'
                ? URL.createObjectURL(userDetails.avatar)
                : userDetails.avatar
            }
            alt={userDetails.username}
          />
        </label>
        <Text className="text-xl">{error}</Text>
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-gray-200 p-2 rounded-md my-2"
            value={userDetails.username}
            name="username"
            onChange={handleInputChange}
          />
          <textarea
            className="w-full bg-gray-200 p-2 my-2 h-32 rounded-md resize-none"
            maxLength="200"
            placeholder="Bio"
            name="bio"
            value={userDetails.bio}
            onChange={handleInputChange}
          />
        </div>
        <Button
          className="w-full rounded-md bg-slate-800 py-2 text-white hover:bg-slate-900"
          onClick={handleUpdateProfile}
        >
          Update
        </Button>
      </div>
    </ReactModal>
  );
};

EditProfileModal.defaultProps = {
  isOpen: false,
};
export default EditProfileModal;
