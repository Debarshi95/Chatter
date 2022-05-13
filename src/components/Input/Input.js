import React from 'react';
import cn from 'clsx';
import { useField } from 'formik';

const Input = ({ hasLabel, className, label, ...props }) => {
  const [field, meta] = useField(props);

  const InputComp = (
    <>
      <input
        className={cn(
          'bg-slate-700 text-gray-200 placeholder-gray-400 p-3 rounded-md w-full my-2 outline-none',
          className
        )}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm sm:text-base">{meta.error}</div>
      ) : null}
    </>
  );

  return (
    <div className="w-full">
      {hasLabel && (
        <label htmlFor={props.id || props.name} className="block text-gray-400 md:text-lg">
          {label}
        </label>
      )}
      {InputComp}
    </div>
  );
};

Input.defaultProps = {
  type: 'text',
  hasLabel: false,
  label: '',
};

export default Input;
