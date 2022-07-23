import store from '../store';

const getSignedInUser = () => {
  const userCache = localStorage.getItem('ianthe.user');

  if (userCache) return JSON.parse(userCache);

  const { users: user } = store.getState();

  return user;
};

const usersUtils = {
  getSignedInUser,
};

export default usersUtils;
