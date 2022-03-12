import jwt from "jsonwebtoken";

export const generateToken = (value) => {
  const token = jwt.sign({ email: value }, process.env.FORGOT_PASSWORD_TOKEN, {
    expiresIn: "30m",
  });
  return token;
};

export const checkToken = (token) => {
  const data = jwt.verify(token, process.env.FORGOT_PASSWORD_TOKEN);
  return data;
};
