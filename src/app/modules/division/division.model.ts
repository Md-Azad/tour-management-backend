import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

export const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    const slug = `${baseSlug}-division`;
    this.slug = slug;
  }

  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
