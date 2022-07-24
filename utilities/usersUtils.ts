import store from '../redux/store';

const getSignedInUser = () => {
  const userCache =
    localStorage.getItem('ianthe.user') ||
    sessionStorage.getItem('ianthe.user');

  if (userCache) return JSON.parse(userCache);

  const user = store.getState().users.user;

  return user;
};

const usersUtils = {
  getSignedInUser,
};

export default usersUtils;
