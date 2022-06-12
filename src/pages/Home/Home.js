import sanitizeHtml from 'sanitize-html';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, PostBox, ProgressBar, Text } from 'components';
import { withProtectedRoute } from 'hoc';
import { selectPostState } from 'store/selectors';
import { createPost, getAllPosts } from 'store/reducers/slices';
import useDocumentTitle from 'hooks/useDocumentTitle';
import useLazyLoad from 'hooks/useLazyLoad';

const Home = ({ user: authUser }) => {
  const postRef = useRef();
  const dispatch = useDispatch();

  const { posts = [], isUploading } = useSelector(selectPostState);

  const { postFeed, isLoading } = useLazyLoad(posts, postRef);

  useDocumentTitle('Feed | Chatter');

  useEffect(() => {
    if (authUser?.uid) {
      dispatch(getAllPosts({ userId: authUser.uid, following: authUser.following?.slice(0, 8) }));
    }
  }, [authUser.uid, dispatch, authUser.following]);

  const dispatchCreatePost = async (data) => {
    dispatch(createPost({ ...data, user: authUser }));
  };

  return (
    <div className="p-2 flex-1">
      <PostBox>
        <PostBox.Header
          avatarClassName="w-16 h-16"
          avatar={authUser?.avatar}
          userId={authUser?.id}
          username={authUser?.username}
          fullname={authUser?.fullname}
        />
        <PostBox.Editable
          onCreate={dispatchCreatePost}
          type="CREATE"
          placeholder="Write something interesting..."
        />
      </PostBox>
      {isUploading === 'pending' && <ProgressBar />}
      <section>
        {postFeed?.map((post) => (
          <div key={post.id} ref={postRef}>
            <PostBox key={post.id} post={post}>
              <PostBox.Header
                avatarClassName="w-16 h-16"
                avatar={post.user?.avatar}
                userId={post.user?.id}
                username={post?.user?.username || post?.user?.fullname}
              />
              <PostBox.Content>
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(post?.content) }}
                  contentEditable
                  className="bg-transparent my-4 text-base outline-none w-full h-full text-slate-300"
                />
                {post?.image && <img alt="" src={post.image} />}
              </PostBox.Content>
              <PostBox.Footer post={post} />
            </PostBox>
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
