import { typeDefs as orderSchema } from "./orderSchema.js";
import { typeDefs as userSchema } from "./userSchema.js";
import { typeDefs as productSchema } from "./productSchema.js";
import { typeDefs as paymentSchema } from "./paymentSchema.js";
import { typeDefs as deliverySchema } from "./deliverySchema.js";

export const schema = [
  productSchema,
  userSchema,
  orderSchema,
  paymentSchema,
  deliverySchema,
];
