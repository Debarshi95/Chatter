import React from 'react';
import cn from 'clsx';
import { useField } from 'formik';

const Input = ({ hasLabel, className, label, ...props }) => {
  const [field, meta] = useField(props);

  const InputComp = (
    <>
      <input
        className={cn(
          'bg-gray-800 text-gray-200 placeholder-gray-400 py-2 px-3 rounded-md w-full my-2 outline-none',
          className
        )}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 mb-2 text-sm font-semibold">{meta.error}</div>
      ) : null}
    </>
  );

  return (
    <div className="w-full text-base border-gray-500">
      {hasLabel && (
        <label htmlFor={props.id || props.name} className="block text-white">
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
