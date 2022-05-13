import cn from 'clsx';
import { Link } from 'react-router-dom';

const buttonComponents = {
  link: Link,
  button: 'button',
  div: 'div',
};
const Button = ({ component, text, className, children, ...props }) => {
  const Component = buttonComponents[component];

  return (
    <Component
      className={cn('p-3 text-lg md:text-xl w-full font-medium text-center bg-white', className, {
        'bg-gray-500': props.disabled,
        'hover:bg-gray-200 cursor-pointer': !props.disabled,
      })}
      {...props}
    >
      {children}
    </Component>
  );
};

Button.defaultProps = {
  children: '',
  component: 'button',
  text: '',
  disabled: false,
};
export default Button;
