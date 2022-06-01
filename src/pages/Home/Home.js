import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLazyLoad from 'hooks/useLazyLoad';
import { CardHeader, Loader, PostBox, Text } from 'components';
import { withProtectedRoute } from 'hoc';
import { selectPosts, selectAuthUser } from 'store/selectors';
import { createPost, getAllPosts } from 'store/reducers/slices';
import useDocumentTitle from 'hooks/useDocumentTitle';

const Home = () => {
  const postRef = useRef();
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const authUser = useSelector(selectAuthUser);

  const { postFeed, isLoading } = useLazyLoad(posts, postRef);

  useDocumentTitle('Feed | Chatter');

  useEffect(() => {
    if (authUser?.uid) {
      dispatch(getAllPosts({ userId: authUser.uid, following: authUser.following }));
    }
  }, [authUser.uid, dispatch, authUser.following]);

  const handleCreatePost = async (data) => {
    dispatch(createPost({ ...data, user: authUser }));
  };

  return (
    <div className="p-2 flex-1">
      <PostBox
        contentEditable
        user={authUser}
        onCreatePost={handleCreatePost}
        showPostIcons={false}
        headerComponent={
          <CardHeader
            avatarClassName="w-16 h-16"
            avatar={authUser?.avatar}
            userId={authUser?.id}
            username={authUser?.username}
            fullname={authUser?.fullname}
          />
        }
      />
      <section>
        {postFeed?.map((post) => (
          <div key={post.id} ref={postRef}>
            <PostBox ref={postRef} key={post.id} post={post} />
          </div>
        ))}
        <div>
          {isLoading ? (
            <Loader className="text-xl flex items-center justify-center flex-1 my-4" />
          ) : (
            <Text className="text-gray-300 text-center">No more posts left</Text>
          )}
        </div>
      </section>
    </div>
  );
};

export default withProtectedRoute(Home);
