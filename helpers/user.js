import { AuthenticationError } from "apollo-server-express";

export const isAuthenticate = (user) => {
  if (!user) throw new AuthenticationError("Nejsi přihlášený/ná");
};

export const isAdmin = (user) => {
  if (!user || !user.role)
    throw new AuthenticationError("Nejsi přihlášený/ná nebo nemáš práva");
};
