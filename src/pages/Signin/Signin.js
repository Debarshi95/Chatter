/* eslint-disable no-unused-vars */
import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthErrorCodes } from 'Firebase';
import withAuthRoute from 'hoc/withAuthRoute';

import { Button, Text, Input } from 'components';
import { validateLogin } from 'utils/formValidations';
import { authErrorMessage } from 'constants/authMessage';
import { requestSignIn } from 'store/reducers/slices';

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values, { resetForm }) => {
    let message;

    try {
      const res = await dispatch(requestSignIn(values)).unwrap();

      if (res?.id) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err?.code === AuthErrorCodes.INVALID_PASSWORD) {
        message = authErrorMessage.WRONG_PASSWORD;
      } else if (err?.code === AuthErrorCodes.USER_DELETED) {
        message = authErrorMessage.USER_NOT_FOUND;
      } else {
        message = err?.message;
      }
    }

    resetForm({
      values: { ...values, password: '' },
      errors: { message },
      touched: {
        password: true,
      },
    });
    return null;
  };

  return (
    <div className="w-full p-4 max-w-md mx-auto my-20">
      <Text
        variant="h5"
        className="text-3xl md:text-4xl mt-1 text-center text-white font-medium mb-6"
      >
        Sign in to continue
      </Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validateLogin()}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: handleFormikSubmit, isSubmitting, values, errors, touched }) => {
          return (
            <>
              {errors?.message && (
                <Text
                  variant="p"
                  className="text-red-500 bg-red-400 bg-opacity-30 p-2 mb-4 rounded-md text-center"
                >
                  {errors.message || 'Oops! Some error occurred'}
                </Text>
              )}
              <Form autoComplete="off" onSubmit={handleFormikSubmit}>
                <Input name="email" type="email" placeholder="Email" value={values.email} />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={values.password}
                />
                <Button
                  component="button"
                  type="submit"
                  className="mt-4 rounded-md text-slate-800"
                  disabled={Boolean(
                    isSubmitting || !touched || values.email === '' || values.password === ''
                  )}
                >
                  {isSubmitting ? 'Submitting...' : 'Sign In'}
                </Button>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default withAuthRoute(Signin);
