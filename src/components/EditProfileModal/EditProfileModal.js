import ReactModal from 'react-modal';
import { useState } from 'react';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { Avatar, Button, Text } from 'components';
import { useDispatch } from 'react-redux';
import { updateAuthUserProfile, setProfileState } from 'store/reducers/slices';
import { validImageTypes } from 'constants/fileTypes';

ReactModal.setAppElement('#root');

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [userDetails, setUserDetails] = useState({
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
    fullname: user?.fullname || '',
  });
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.split('/')[1];

    if (!validImageTypes.includes(fileType)) {
      return setError('Only images of type png/jpg or jpeg allowed');
    }

    setUserDetails({
      ...userDetails,
      avatar: file,
    });
    setError('');
    return null;
  };

  const handleInputChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    if (userDetails.fullname === '' || userDetails.bio === '') return;
    dispatch(updateAuthUserProfile({ ...userDetails, userId: user.id }));
    dispatch(setProfileState(true));
    onClose(false);
  };
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      style={{
        content: {
          inset: '6rem 0 0 0',
          position: 'fixed',
          border: 'none',
          background: '#1F2937',
          maxWidth: '28rem',
          width: '100%',
          height: '80%',
          margin: '0 auto',
          zIndex: 999,
        },
        overlay: {
          background: 'rgb(0, 0, 0, 0.4)',
        },
      }}
    >
      <div className="p-2 text-white font-light">
        <div className="flex items-center relative">
          <Text className="mr-20">Avatar :</Text>
          <input
            id="avatar"
            type="file"
            title="Change your avatar"
            className="bg-transparent hidden"
            onChange={handleUploadImage}
            accept="image/*"
          />
          <label htmlFor="avatar" className="relative tooltip" data-tooltip="Change Avatar">
            <MdOutlineCloudUpload className="absolute text-gray-200 top-[65%] right-[4px] text-3xl" />
            <Avatar
              className="mx-auto w-28 h-28 mb-2 cursor-pointer"
              url={
                typeof userDetails.avatar === 'object'
                  ? URL.createObjectURL(userDetails.avatar)
                  : userDetails.avatar
              }
              alt={userDetails.username}
            />
          </label>
        </div>
        <Text className="text-sm text-center font-normal text-red-600">{error}</Text>
        <div>
          <label className="flex mb-1">
            Username : <Text className="text-center ml-4 font-medium">{userDetails.username}</Text>
          </label>
          <label>
            Fullname :
            <input
              type="text"
              placeholder="Fullname"
              className="w-full border-blue-500 bg-slate-700 border p-2 rounded-md my-2"
              value={userDetails.fullname}
              accept="image/*"
              name="fullname"
              onChange={handleInputChange}
            />
          </label>

          <label>
            Bio :
            <textarea
              className="w-full border-blue-500 bg-slate-700 border p-2 my-2 h-32 rounded-md resize-none"
              maxLength="200"
              placeholder="Bio"
              name="bio"
              value={userDetails.bio}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <Button
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
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
