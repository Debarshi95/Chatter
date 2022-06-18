import PostBox from './PostBox';
import PostBoxFooter from '../PostBoxFooter/PostBoxFooter';
import CardHeader from '../CardHeader/CardHeader';
import Editable from './Editable';
import PostBoxContent from './PostBoxContent';

PostBox.Header = CardHeader;
PostBox.Footer = PostBoxFooter;
PostBox.Editable = Editable;
PostBox.Content = PostBoxContent;

export default PostBox;
