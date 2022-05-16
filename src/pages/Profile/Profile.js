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
    <div className="text-white p-4 w-full mx-auto" id="modalContainer">
      <header className="p-4 bg-slate-700 rounded-md">
        <div className="flex text-white items-center">
          <Avatar url={user.avatar} alt={user.username} />
          <div className="my-2 w-2/3 ml-4">
            <div className="flex items-center justify-between">
              {user?.username && (
                <Text className="text-gray-300 text-base text-start font-medium">{`@${user.username}`}</Text>
              )}

              {user.id !== authUser?.id ? (
                <Button
                  className="border-2 border-slate-500 w-36 h-8 hover:bg-slate-900"
                  onClick={handleFollowClick}
                >
                  {isFollowingUser ? 'Following' : 'Follow'}
                </Button>
              ) : (
                <Button
                  className="border-2 border-slate-500 w-36 text-base h-8 hover:bg-slate-900"
                  onClick={() => handleModalOpen(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
            <Text className="text-start text-base my-2">{user?.bio || 'No Bio found'}</Text>
            <Text className="inline-block text-base">
              <span className="font-medium mr-1">{user?.following?.length}</span>
              <span>Following</span>
            </Text>
            <Text className="inline-block ml-2 text-lg">
              <span className="font-medium mr-1">{user?.followers?.length}</span>
              <span>Followers</span>
            </Text>
          </div>
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
