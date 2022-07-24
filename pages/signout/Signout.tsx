const SignOut = () => {
  sessionStorage.removeItem('ianthe.user');

  return <div>Signout</div>;
};

export default SignOut;
