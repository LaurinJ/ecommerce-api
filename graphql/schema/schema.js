import { typeDefs as orderSchema } from "./orderSchema.js";
import { typeDefs as userSchema } from "./userSchema.js";
import { typeDefs as productSchema } from "./productSchema.js";
import { typeDefs as paymentSchema } from "./paymentSchema.js";
import { typeDefs as deliverySchema } from "./deliverySchema.js";
import { typeDefs as messageSchema } from "./messageSchema.js";
import { typeDefs as categorySchema } from "./categorySchema.js";
import { typeDefs as reviewSchema } from "./reviewSchema.js";

export const schema = [
  productSchema,
  userSchema,
  orderSchema,
  paymentSchema,
  deliverySchema,
  messageSchema,
  categorySchema,
  reviewSchema,
];
