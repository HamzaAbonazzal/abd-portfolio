import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile extends Document {
  name: { ar: string; en: string };
  title: { ar: string; en: string };
  bio: { ar: string; en: string };
  avatar: string;
  email: string;
  phone: string;
  location: { ar: string; en: string };
  socials: {
    behance?: string;
    dribbble?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  resumeUrl?: string;
  stats: {
    experience: number;
    projects: number;
    clients: number;
    awards: number;
  };
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    title: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    bio: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    avatar: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    socials: {
      behance: String,
      dribbble: String,
      instagram: String,
      linkedin: String,
      twitter: String,
      github: String,
    },
    resumeUrl: { type: String },
    stats: {
      experience: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      clients: { type: Number, default: 0 },
      awards: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;