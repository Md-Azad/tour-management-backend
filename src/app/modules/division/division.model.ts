import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";
import { makeSlug } from "../../utils/handleSlug";

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
    const createdSlug = makeSlug(this.name, "division");
    this.slug = createdSlug;
  }

  next();
});

divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as Partial<IDivision>;
  if (division.name) {
    const createdSlug = makeSlug(division.name, "division");
    division.slug = createdSlug;
  }

  this.setUpdate(division);

  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
