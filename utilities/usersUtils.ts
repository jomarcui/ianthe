import store from '../redux/store';

const getSignedInUser = (key: string) => {
  const userCache = localStorage.getItem(key) || sessionStorage.getItem(key);

  if (userCache) return JSON.parse(userCache);

  const user = store.getState().users.user;

  return user;
};

const removeSignedInUser = (key: string) => sessionStorage.removeItem(key);

const setSignedInUser = ({ key, user = null }: { key: string; user: {} }) =>
  sessionStorage.removeItem(key);

const usersUtils = {
  getSignedInUser,
  removeSignedInUser,
  setSignedInUser,
};

export default usersUtils;
