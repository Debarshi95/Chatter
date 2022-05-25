import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AuthErrorCodes } from 'firebase/auth';
import { withAuthRoute } from 'hoc';

import { Button, Text, Input } from 'components';
import { validateRegister } from 'utils/formValidations';
import { authErrorMessage } from 'constants/authMessage';
import { signup } from 'store/reducers/slices';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values, { resetForm, setFieldError }) => {
    const { password, confirmPassword } = values;
    let message;

    if (password !== confirmPassword) {
      return setFieldError('confirmPassword', 'Passwords donot match');
    }

    try {
      const res = await dispatch(signup(values)).unwrap();
      if (res?.id) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err?.code === AuthErrorCodes.EMAIL_EXISTS) {
        message = authErrorMessage.EMAIL_IN_USE;
      } else {
        message = err?.message;
      }
    }

    resetForm({
      values: { ...values, password: '', confirmPassword: '' },
      errors: { message },
      touched: {
        password: true,
        confirmPassword: true,
      },
    });
    return null;
  };

  return (
    <div className="w-full h-screen md:h-fit bg-slate-700 border-stone-600 border-1 max-w-md mx-auto md:translate-y-14 p-4 rounded-md">
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validateRegister()}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: handleFormikSubmit, isSubmitting, values, errors, isValid }) => {
          return (
            <>
              <Text
                variant="h5"
                className="text-2xl text-center translate-y-10 md:translate-y-3 text-blue-500 font-bold mt-4 mb-6"
              >
                Signup to get started
              </Text>
              {errors?.message && (
                <Text
                  variant="p"
                  className="text-red-500 bg-red-400 bg-opacity-30 translate-y-10 md:translate-y-2 p-2 mb-4 rounded-md text-center"
                >
                  {errors.message || 'Oops! Some error occurred'}
                </Text>
              )}
              <Form
                autoComplete="off"
                onSubmit={handleFormikSubmit}
                className="translate-y-4 md:translate-y-0"
              >
                <Input
                  name="username"
                  hasLabel
                  label="Username"
                  type="text"
                  placeholder="johndoe99"
                  value={values.username}
                />
                <Input
                  hasLabel
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="johndoe@test.com"
                  value={values.email}
                />
                <Input
                  hasLabel
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="*****"
                  value={values.password}
                />
                <Input
                  hasLabel
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="*****"
                  value={values.confirmPassword}
                />
                <Button
                  component="button"
                  type="submit"
                  className="mt-4 p-2 text-gray-300 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold"
                  disabled={
                    isSubmitting ||
                    !isValid ||
                    Boolean(
                      values.username === '' ||
                        values.email === '' ||
                        values.password === '' ||
                        values.confirmPassword === ''
                    )
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Sign Up'}
                </Button>
                <Text className="text-gray-300 text-center my-4">
                  Already registered?{' '}
                  <Link
                    to="/signin"
                    className="text-white font-medium hover:border-b-2 border-white"
                  >
                    Signin
                  </Link>
                </Text>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default withAuthRoute(Signup);
