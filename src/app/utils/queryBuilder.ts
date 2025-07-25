import { Query } from "mongoose";
import { excludedFields } from "../globalConstant";

export class queryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filterQuery = { ...this.query };

    for (const field of excludedFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filterQuery[field];
    }
    this.modelQuery = this.modelQuery.find(filterQuery); //Tour.find().find(filterQuery)

    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm || "";

    const searchQeury = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchQeury);

    return this;
  }
}
