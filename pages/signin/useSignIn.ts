import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SubmitHandler } from 'react-hook-form';
import { setUser } from '../../redux/features/users/usersSlice';
import { useGetUserByEmailAndPasswordMutation } from '../../redux/api/usersApi';
import store from '../../redux/store';
import usersUtils from '../../utilities/usersUtils';

const USER_KEY = 'ianthe.user';

type Inputs = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const useSignIn = () => {
  const router = useRouter();

  const [signIn, { data, error, isLoading }] =
    useGetUserByEmailAndPasswordMutation();

  // TODO: redirect user to home if a user is already signed in
  useEffect(() => {
    const user = usersUtils.getSignedInUser(USER_KEY);

    if (user) router.push('/');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      usersUtils.setSignedInUser({ key: USER_KEY, user: data });

      store.dispatch(setUser(data));

      const returnUrl = router.query.returnUrl || '/';

      router.push(Array.isArray(returnUrl) ? returnUrl[0] : returnUrl);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    const { email, password } = formData;

    const signinInfo = {
      email,
      password,
    };

    await signIn(signinInfo).unwrap();
  };

  return { data, error, isLoading, handleFormSubmit };
};

export default useSignIn;
