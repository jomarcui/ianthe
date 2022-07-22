const HOST = process.env.NEXT_PUBLIC_HOST;

const signin = async ({ email, password }) => {
  const data = await fetch(`${HOST}/users/auth`, {
    body: JSON.stringify({
      email,
      password,
    }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  const user = await data.json();

  return user;
};

const userService = {
  signin,
};

export default userService;
