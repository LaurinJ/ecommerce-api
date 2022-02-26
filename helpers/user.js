import { AuthenticationError } from "apollo-server-express";

export const isAuthenticate = (user) => {
  if (!user) throw new AuthenticationError("Nejsi přihlášený/ná");
};
