import { ICategory } from "./Category";

export interface ISubCategory {
  _id?: object;
  name?: string;
  category?: ICategory;
  is_delete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
