import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AuthErrorCodes } from 'Firebase';
import { authErrorMessage } from 'constants/authMessage';
import { Button, Text, Input } from 'components';
import { validateRegister } from 'utils/formValidations';
import { signup } from 'store/reducers/slices';
import { selectAuthState } from 'store/selectors';
import { withAuthRoute } from 'hoc';
import useDocumentTitle from 'hooks/useDocumentTitle';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector(selectAuthState);

  useDocumentTitle('Signup | Chatter');

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
    <div className="w-full translate-y-10 md:h-fit bg-slate-700 border-stone-600 border-1 max-w-md mx-auto p-4 rounded-md">
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
          const isLoading = isSubmitting || loading === 'pending';
          const authError = errors?.message;
          return (
            <>
              <Text
                variant="h5"
                className="text-2xl text-center  text-blue-500 font-bold mt-4 mb-8 md:mb-6"
              >
                Signup to get started
              </Text>
              {authError && (
                <Text
                  variant="p"
                  className="bg-red-600 text-white p-2 mb-8 md:mb-4 rounded-md text-center"
                >
                  {authError || 'Oops! Some error occurred'}
                </Text>
              )}
              <Form autoComplete="off" onSubmit={handleFormikSubmit}>
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
                    isLoading ||
                    !isValid ||
                    Boolean(
                      values.username === '' ||
                        values.email === '' ||
                        values.password === '' ||
                        values.confirmPassword === ''
                    )
                  }
                >
                  {isLoading ? 'Submitting...' : 'Sign Up'}
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
