import { ISubCategory } from "../interfaces/SubCategory";
import { axiosClient } from "../libraries/axiosClient";

export async function getAllSubCategories() {
  try {
    const response = await axiosClient.get("/sub-categories");
    const subCategories = response.data.filter((subCategoy: ISubCategory) => {
      return subCategoy.is_delete === false;
    });
    return subCategories;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch sub-categories");
  }
}
