import sanitizeHtml from 'sanitize-html';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Avatar, Button, EditProfileModal, Loader, PostBox, Text } from 'components';
import { withProtectedRoute } from 'hoc';
import { getProfileData, updateAuthUserData, deletePost } from 'store/reducers/slices';
import { selectUserProfileState } from 'store/selectors';
import { isFollowing } from 'utils/helperFuncs';
import useDocumentTitle from 'hooks/useDocumentTitle';

const Profile = ({ user: authUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { state } = useLocation();

  const dispatch = useDispatch();

  const { user, loading } = useSelector(selectUserProfileState);

  const isFollowingUser = isFollowing(user, authUser?.id);

  useDocumentTitle(`Profile | ${user?.username}`);

  useEffect(() => {
    if (user?.id !== state?.id) {
      dispatch(getProfileData(state.id));
    }
  }, [dispatch, user?.id, state.id]);

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

  const dispatchDeletePost = (postId) => {
    dispatch(deletePost({ postId, userId: authUser.id }));
    dispatch(getProfileData(authUser.id));
  };

  if (loading === 'pending') return <Loader />;

  return (
    <div className="text-gray-300 p-2 flex-1 md:ml-4" id="modalContainer">
      <header className="flex flex-col md:flex-row justify-between rounded-md">
        <div className="flex justify-center">
          <Avatar url={user.avatar} alt={user.username} className="w-36 h-36" />
        </div>
        <div className="mt-2 text-center md:text-left flex-1 md:2/3 md:ml-4">
          {(user?.fullname || user?.username) && (
            <div className="mb-2 md:mb-0 font-sans">
              <Text className="font-semibold text-xl">{user.fullname || user.username}</Text>
              <Text className="text-base text-gray-400 font-light">{`@${user.username}`}</Text>
            </div>
          )}

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
              <PostBox key={post.id}>
                <PostBox.Header
                  avatarClassName="w-20 h-20"
                  avatar={user?.avatar}
                  userId={user?.userId}
                  username={user?.username}
                />
                <PostBox.Content>
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.content) }}
                    className="bg-transparent my-4 text-base outline-none w-full h-full text-slate-300"
                  />
                  {post?.image && <img alt="" src={post.image} />}
                </PostBox.Content>
                <PostBox.Footer
                  deleteOption={authUser.id === user.id}
                  post={post}
                  onUpdate={() => dispatch(getProfileData(user.id))}
                  onDelete={dispatchDeletePost}
                />
              </PostBox>
            ))}
          </>
        ) : (
          <Text className="text-xl font-medium mb-4 text-center mt-16">User has no post</Text>
        )}
      </section>

      <EditProfileModal isOpen={isModalOpen} onClose={handleModalOpen} user={user} key={user.id} />
    </div>
  );
};

export default withProtectedRoute(Profile);
