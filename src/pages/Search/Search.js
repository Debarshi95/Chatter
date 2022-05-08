import { CardHeader } from 'components';
import { withProtectedRoute } from 'hoc';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllUsers } from 'store/reducers/slices';
import { selectUsers } from 'store/selectors';

const Search = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  useEffect(() => {
    dispatch(requestGetAllUsers());
  }, [dispatch]);

  return (
    <div className="bg-green w-full p-4">
      {users?.map((user) => (
        <div className="border-2 border-slate-700 rounded-lg p-4 my-2" key={user.id}>
          <CardHeader key={user.id} user={user} showFollowButton />
        </div>
      ))}
    </div>
  );
};

export default withProtectedRoute(Search);
