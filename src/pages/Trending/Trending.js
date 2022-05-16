/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Button, PostBox, Select } from 'components';
import { withProtectedRoute } from 'hoc';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrendingPosts } from 'store/selectors';
import { getTrendingPosts } from 'store/reducers/slices';

const selectOptions = [
  {
    label: 'Likes',
    value: 'likes',
  },
  { label: 'Followers', value: 'followers' },
  { label: 'Retweets', value: 'retweets' },
];
const Search = () => {
  const [selectOpen, setSelectOpen] = useState(false);

  const dispatch = useDispatch();
  const posts = useSelector(selectTrendingPosts);

  useEffect(() => {
    dispatch(getTrendingPosts());
  }, [dispatch]);

  const handleModalOpen = () => {};

  return (
    <div className="bg-green w-full p-4">
      <Select options={selectOptions} defaultValue="Filters" dropdownClassName="top-10" />
      {posts?.map((post) => (
        <PostBox post={post} key={post.id} />
      ))}
    </div>
  );
};

export default withProtectedRoute(Search);
