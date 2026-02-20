import mongoose, { Schema, model, models } from "mongoose";

const SiteSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const Site = models.Site || model("Site", SiteSchema);

export default Site;
