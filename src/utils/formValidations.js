import * as Yup from 'yup';

export const validateLogin = () => {
  return Yup.object().shape({
    email: Yup.string().email('Invalid Email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .max(10, 'Maximum 12 characters')
      .required('Password is required'),
  });
};

export const validateRegister = () => {
  return Yup.object().shape({
    username: Yup.string()
      .min(5, 'Minimum 6 characters')
      .max(10, 'Maximum 12 characters')
      .required('Username is required'),
    email: Yup.string().email('Invalid Email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .max(10, 'Maximum 12 characters')
      .required('Password is required'),
    confrimPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords donot match'),
  });
};
