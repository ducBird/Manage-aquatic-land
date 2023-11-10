import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineShopping,
  AiOutlineDatabase,
  AiOutlineDiff,
} from "react-icons/ai";
import {
  MdOutlineSupportAgent,
  MdOutlinePeopleAlt,
  MdOutlineArticle,
  MdOutlineManageAccounts,
  MdOutlineCategory,
} from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { RiLuggageDepositLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { useUser } from "../../../hooks/useUser";

export default function SiderMenu() {
  const { users } = useUser((state) => state);
  const navigate = useNavigate();
  const itemsSider = [
    { label: "Trang Chủ", key: "home", icon: <AiOutlineHome /> }, // remember to pass the key prop
    {
      label: "Quản Trị",
      key: "management",
      icon: <MdOutlineManageAccounts />,
      children: [
        {
          label: "Danh mục",
          key: "management-categories",
          icon: <MdOutlineCategory />,
        },
        {
          label: "Danh mục con",
          key: "management-subCategories",
          icon: <AiOutlineDiff />,
        },
        {
          label: "Sản phẩm",
          key: "management-products",
          icon: <AiOutlineShopping />,
        },
        {
          label: "Khách hàng",
          key: "management-customers",
          icon: <MdOutlinePeopleAlt />,
        },
        {
          label: "Nhân viên",
          key: "management-employees",
          icon: <MdOutlineSupportAgent />,
        },
        { label: "Đơn hàng", key: "sales-orders", icon: <MdOutlineArticle /> },

        {
          label: "Tích lũy tiền",
          key: "management-accumulated",
          icon: <RiLuggageDepositLine />,
        },
        // {
        //   label: "Nhà cung cấp",
        //   key: "management-suppliers",
        //   icon: <RiLuggageDepositLine />,
        // },
      ],
    },
    {
      label: "Quản Lý Bán Hàng",
      key: "sales",
      icon: <AiOutlineDatabase />,
      children: [
        {
          label: "Thống kê",
          key: "sales-statistics",
          icon: <MdOutlineArticle />,
          children: [
            {
              label: "Đơn hàng",
              key: "sales-statistics-orders",
              icon: <MdOutlineArticle />,
              children: [
                {
                  label: "Theo trạng thái",
                  key: "sales-orders-by-status",
                },
                {
                  label: "Theo hình thức thanh toán",
                  key: "sales-orders-by-payment_information",
                },
                {
                  label: "Theo trạng thái thanh toán",
                  key: "sales-orders-by-payment_status",
                },
                {
                  label: "Theo số điện thoại",
                  key: "sales-statistics-orders-number",
                },
                {
                  label: "Theo ngày cần tìm",
                  key: "sales-statistics-orders-day",
                },
              ],
            },
            {
              label: "Sản phẩm",
              key: "sales-statistics-products",
              icon: <AiOutlineShopping />,
            },
            {
              label: "Khách hàng",
              key: "sales-statistics-customers",
              icon: <MdOutlinePeopleAlt />,
            },
          ],
        },
      ],
    },
    {
      label: "Quản lý vận chuyển",
      key: "shipping",
      icon: <FaShippingFast />,
      children: [
        { label: "Đơn mua", key: "shipping-purchase" },
        {
          label: "Đơn trả",
          key: "shipping-return",
        },
      ],
    },
    { label: "Cài Đặt", key: "settings", icon: <AiOutlineSetting /> }, // which is required
  ];
  const itemsSiderShipper = [
    {
      label: "Quản lý vận chuyển",
      key: "shipping",
      icon: <FaShippingFast />,
      children: [
        { label: "Đơn mua", key: "shipping-purchase" },
        {
          label: "Đơn trả",
          key: "shipping-return",
        },
      ],
    },
  ];
  return (
    <div>
      <Menu
        items={users.user.roles === "admin" ? itemsSider : itemsSiderShipper}
        mode="inline"
        onClick={({ item, key }) => {
          navigate("/" + key.split("-").join("/")); //
        }}
      />
    </div>
  );
}
