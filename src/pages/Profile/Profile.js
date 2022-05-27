import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Avatar, Button, CardHeader, EditProfileModal, PostBox, Text } from 'components';
import { withProtectedRoute } from 'hoc';
import { getProfileData, updateAuthUserData, deletePost } from 'store/reducers/slices';
import { selectAuthUser, selectUserProfile } from 'store/selectors';
import { isFollowing } from 'utils/helperFuncs';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    state: { id },
  } = useLocation();

  const dispatch = useDispatch();

  const user = useSelector(selectUserProfile);
  const authUser = useSelector(selectAuthUser);

  const isFollowingUser = isFollowing(user, authUser.id);

  useEffect(() => {
    dispatch(getProfileData(id));
  }, [dispatch, id, user?.id]);

  const handleFollowClick = () => {
    const userId = user.id;
    const authUserId = authUser.id;

    let type = 'UPDATE';
    if (isFollowingUser) {
      type = 'DELETE';
    }
    dispatch(updateAuthUserData({ type, userId, authUserId }));
    dispatch(getProfileData(userId));
  };

  const handleModalOpen = (value) => {
    setIsModalOpen(value);
  };

  const handleOnDeletePost = (postId) => {
    dispatch(deletePost({ postId, userId: authUser.id }));
    dispatch(getProfileData(authUser.id));
  };

  return (
    <div className="text-gray-300 p-2 flex-1 md:ml-4" id="modalContainer">
      <header className="flex flex-col md:flex-row justify-between rounded-md">
        <div className="flex justify-center">
          <Avatar url={user.avatar} alt={user.username} className="w-36 h-36" />
        </div>
        <div className="mt-2 text-center md:text-left flex-1 md:2/3 md:ml-4">
          {user?.fullname ||
            (user?.username && (
              <div className="mb-2 md:mb-0 font-sans">
                <Text className="font-semibold text-xl">{user.fullname || user.username}</Text>
                <Text className="text-base text-gray-400 font-light">{`@${user.username}`}</Text>
              </div>
            ))}

          <Text className="text-base my-2 text-center font-extralight md:text-left">
            {user?.bio || 'No Bio found'}
          </Text>
          <Text className="inline md:inline-block text-base">
            <span className="font-medium mr-1">{user?.following?.length}</span>
            <span className="font-extralight">Following</span>
          </Text>
          <Text className="inline md:inline-block ml-2 text-base">
            <span className="font-medium mr-1">{user?.followers?.length}</span>
            <span className="font-extralight">Followers</span>
          </Text>
        </div>
        <div className="translate-y-4 mb-2">
          {user.id !== authUser?.id ? (
            <Button
              className="border border-slate-500 h-8 md:w-32 hover:bg-slate-900"
              onClick={handleFollowClick}
            >
              {isFollowingUser ? 'Following' : 'Follow'}
            </Button>
          ) : (
            <Button
              className="border ml-auto border-slate-500 text-base h-8 md:w-32 hover:bg-slate-900"
              onClick={() => handleModalOpen(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </header>
      <section>
        {user?.posts?.length ? (
          <>
            <Text className="text-xl sm:text-xl font-medium my-4">Latest Posts</Text>
            {user?.posts?.map((post) => (
              <PostBox
                key={post.id}
                post={post}
                canDeletePost={user?.id === authUser.id}
                onDeletePost={handleOnDeletePost}
                user={user}
                onUpdatePost={() => dispatch(getProfileData(user.id))}
                headerComponent={
                  <CardHeader
                    avatarClassName="w-20 h-20"
                    avatar={user?.avatar}
                    userId={user?.userId}
                    username={user?.username}
                  />
                }
              />
            ))}
          </>
        ) : (
          <Text className="text-2xl font-medium mb-4 text-center mt-16">User has no post</Text>
        )}
      </section>

      <EditProfileModal isOpen={isModalOpen} onClose={handleModalOpen} user={user} />
    </div>
  );
};

export default withProtectedRoute(Profile);
