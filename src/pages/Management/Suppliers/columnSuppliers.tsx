import { ColumnsType } from "antd/es/table";
import { ISupplier } from "../../../interfaces/Supplier";

export const columnSuppliers: ColumnsType<ISupplier> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone_number",
    key: "phone_number",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Website",
    dataIndex: "affiliated_website",
    key: "affiliated_website",
  },
];
