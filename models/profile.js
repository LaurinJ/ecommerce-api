import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    profile_image: {
      type: String,
      required: true,
      default: "/profile.jpg",
    },
  },

  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
