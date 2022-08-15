const VALID_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyz!@#$&*ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PASSWORD_LENGTH = 8;

export const generate = () => {
  let password = '';

  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    var randomNumber = Math.floor(Math.random() * VALID_CHARS.length);
    password += VALID_CHARS.substring(randomNumber, randomNumber +1);
  }

  return password;
};
