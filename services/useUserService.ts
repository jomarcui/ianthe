import { useGetUserByEmailAndPasswordMutation } from '../redux/api/usersApi';
// import store from '../redux/store';

// const HOST = process.env.NEXT_PUBLIC_HOST;

const useUserService = () => {
  const [
    signIn, // This is the mutation trigger
    { isLoading: isUpdating }, // This is the destructured mutation result
  ] = useGetUserByEmailAndPasswordMutation();
};

// const signin = async ({ email, password }) => {
//   const response = {
//     error: null,
//     user: null,
//   };

//   const {
//     data: post,
//     isFetching,
//     isLoading,
//   } = useGetUserByEmailAndPasswordMutation({ email, password});

//   return;

//   try {
//     const data = await fetch(`${HOST}/users/auth`, {
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//       headers: { 'Content-Type': 'application/json' },
//       method: 'POST',
//     });

//     const user = await data.json();

//     if (user) {
//       response.user = user;
//     } else {
//       response.error = new Error('User not found');
//     }
//   } catch (error) {
//     console.error(error);

//     response.error = new Error(error);
//   }

//   return response;
// };

export default useUserService;
