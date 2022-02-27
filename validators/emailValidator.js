export const emailValidator = (email) => {
  let error;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!email) {
    error = "Toto pole je povinné";
  } else if (!regexEmail.test(email)) {
    error = "Email je ve špatném formátu";
  }
  return error;
};
