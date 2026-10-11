import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  category: { ar: string; en: string };
  coverImage: string;
  images: string[];
  liveUrl?: string;
  behanceUrl?: string;
  tools: string[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    category: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    coverImage: { type: String, required: true },
    images: { type: [String], default: [] },
    liveUrl: { type: String },
    behanceUrl: { type: String },
    tools: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;