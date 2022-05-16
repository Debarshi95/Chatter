import cn from 'clsx';
import { useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';

const Select = ({ className, defaultValue, dropdownClassName, options, onSelect }) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleOnSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(e.target.textContent);
    setCurrentValue(e.target.textContent);
  };

  return (
    <div
      role="button"
      aria-hidden
      className={cn(
        'flex cursor-pointer text-sm text-center bg-slate-700 w-32 ml-auto text-white py-2 px-2 rounded-md mb-4 items-center justify-between relative',
        className
      )}
    >
      {currentValue}
      <div
        className={cn(
          'w-full absolute top-10 bg-transparent outline-none left-0 rounded-md',
          dropdownClassName
        )}
      >
        {options?.length &&
          options.map((item, idx) => (
            <div
              role="option"
              key={idx}
              aria-selected
              aria-hidden
              value={item.value}
              onClick={handleOnSelect}
              className="bg-slate-800 p-4 block hover:bg-slate-700"
            >
              {item.label}
            </div>
          ))}
      </div>
      <BsFillCaretDownFill className="block" />
    </div>
  );
};

Select.defaultProps = {
  title: 'Select',
  options: [],
  onSelect: () => null,
  defaultValue: '',
};
export default Select;
