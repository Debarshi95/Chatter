import cn from 'clsx';
import { cloneElement } from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { MdThumbUp, MdOutlineThumbUpOffAlt, MdOutlineComment, MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updatePost } from 'store/reducers/slices';
import { selectAuthUser } from 'store/selectors';
import { removeTrailingChar, toCapitalize } from 'utils/helperFuncs';

const footerItems = [
  { name: 'likes', outlined: <MdOutlineThumbUpOffAlt />, contained: <MdThumbUp /> },
  { name: 'retweets', outlined: <AiOutlineRetweet />, contained: <AiOutlineRetweet /> },
  { name: 'bookmarks', outlined: <BsBookmark />, contained: <BsBookmarkFill /> },
];

const PostBoxFooter = ({ post, onUpdate, deleteOption, onDelete }) => {
  const dispatch = useDispatch();

  const user = useSelector(selectAuthUser);

  const handleOnButtonClick = (path = 'likes', type = 'UPDATE') => {
    dispatch(
      updatePost({
        type,
        postId: post.id,
        userId: user.id,
        path,
      })
    );

    if (typeof onUpdate === 'function') {
      onUpdate();
    }
  };

  return (
    <div className="flex content-between text-slate-300 text-2xl cursor-pointer py-3 border-stone-500 border-t">
      {footerItems.map((item) => {
        const itemLength = post?.[item.name]?.length;
        const postClicked = post?.[item.name]?.includes(user.id);
        const icon = postClicked ? item.contained : item.outlined;
        return (
          <div
            className="relative tooltip text-inherit flex items-center mr-4 font-thin"
            onClick={() => {
              const type = postClicked ? 'DELETE' : 'UPDATE';
              handleOnButtonClick(item.name, type);
            }}
            role="button"
            aria-hidden
            key={item.name}
            data-tooltip={toCapitalize(removeTrailingChar(item.name, 's'))}
          >
            {cloneElement(icon, {
              className: cn('block text-xl font-thin hover:text-slate-600', {
                'text-sm': item.name === 'bookmarks',
              }),
            })}
            <p className="text-base ml-2">{itemLength}</p>
          </div>
        );
      })}
      <Link
        to={`/comment/${post?.id}`}
        className="relative tooltip flex items-center mr-4 font-thin"
        data-tooltip="Comments"
      >
        <MdOutlineComment className={cn('block text-xl font-thin hover:text-slate-600 ')} />
        <p className="text-base ml-2">{post?.comments?.length}</p>
      </Link>
      {deleteOption && (
        <div
          role="button"
          aria-hidden
          className="relative tooltip ml-auto"
          data-tooltip="Delete"
          onClick={() => onDelete(post.id)}
        >
          <MdDelete className="block font-thin" />
        </div>
      )}
    </div>
  );
};

PostBoxFooter.defaultProps = {
  deleteOption: false,
  onDelete: () => null,
};

export default PostBoxFooter;
