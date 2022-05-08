import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostBox } from 'components';
import { withProtectedRoute } from 'hoc';
import { selectPosts, selectAuthUser } from 'store/selectors';
import { requestGetAllPosts } from 'store/reducers/slices/postSlice';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const authUser = useSelector(selectAuthUser);

  useEffect(() => {
    if (authUser?.uid) {
      dispatch(requestGetAllPosts({ userId: authUser.uid, following: authUser.following }));
    }
  }, [authUser.uid, dispatch, authUser.following]);

  return (
    <div className="p-4">
      <PostBox contentEditable user={authUser} />
      <section>
        {posts.map((post) => (
          <PostBox key={post.id} post={post} user={authUser} />
        ))}
      </section>
    </div>
  );
};

export default withProtectedRoute(Home);
