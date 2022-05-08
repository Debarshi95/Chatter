import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostBox } from 'components';
import { withProtectedRoute } from 'hoc';
import { selectPosts, selectAuthUser } from 'store/selectors';
import { requestGetAllPosts } from 'store/reducers/slices/postSlice';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    if (user?.uid) {
      dispatch(requestGetAllPosts(user.uid));
    }
  }, [user?.uid, dispatch]);

  return (
    <div className="p-4">
      <PostBox contentEditable user={user} />
      <section>
        {posts.map((post) => (
          <PostBox key={post.id} post={post} user={user} />
        ))}
      </section>
    </div>
  );
};

export default withProtectedRoute(Home);
