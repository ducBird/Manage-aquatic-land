import { useState, useEffect } from "react";
import { axiosClient } from "../../../services/libraries/axiosClient";

interface ICategory {
  _id?: object;
  name?: string;
  image_url?: string;
  is_delete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const Categories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    axiosClient
      .get("/categories")
      .then((response) => {
        const filteredCategories = response.data.filter(
          (category: ICategory) => {
            return category.is_delete === false;
          }
        );
        setCategories(filteredCategories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>Category List</h1>
      <ul>
        {categories.map((category: ICategory, index: number) => (
          <li key={category._id ? category._id.toString() : index}>
            {category._id ? category._id.toString() : index}-{category.name} -{" "}
            {category.image_url}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
