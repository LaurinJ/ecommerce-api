import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    profile_image: {
      type: String,
      // required: true,
      default: "default.jpg",
    },
  },

  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
