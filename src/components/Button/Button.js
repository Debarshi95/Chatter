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
      className={cn(
        'px-3 rounded-3xl text-base w-full bg-slate-700 font-normal text-center',
        className,
        {
          'bg-slate-600': props.disabled,
          'hover:bg-slate-900 cursor-pointer': !props.disabled,
        }
      )}
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
