import { useState, useEffect } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import { ISubCategory } from "../../../interfaces/SubCategory";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  Modal,
  message,
  Upload,
  Space,
  DatePicker,
  Select,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { API_URL } from "../../../constants/URLS";
import { columnSubCategories } from "./columnSubCategories";
import { addedAttribute } from "../../../utils/AddAttributeToColumns";
import style from "./subcategories.module.css";
import CustomForm from "../../../components/common/CustomForm";
import moment from "moment";
import { ICategory } from "../../../interfaces/Category";
import { getAllSubCategories } from "../../../apis/subCategories";
import { getAllCategories } from "../../../apis/categories";

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ISubCategory>({});
  const [createFormVisible, setCreateFormVisible] = useState(false);
  // Form
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  useEffect(() => {
    const fetchDataSubCategories = async () => {
      try {
        const data = await getAllSubCategories();
        setSubCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataSubCategories();
  }, [refresh]);

  // get list categories
  useEffect(() => {
    const fetchDataCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataCategories();
  }, []);

  const columns: ColumnsType<ISubCategory> = [
    {
      title: "",
      key: "actions",
      render: (record) => {
        return (
          <div>
            <Space>
              {/* Button Edit */}
              <Button
                onClick={() => {
                  const formattedCreatedAt = moment(
                    record.createdAt,
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  const formattedUpdatedAt = moment(
                    record.updatedAt,
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  const updatedRecord = {
                    ...record,
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt,
                  };
                  setSelectedRecord(updatedRecord);
                  updateForm.setFieldsValue(updatedRecord);
                  setEditFormVisible(true);
                }}
                icon={<EditOutlined />}
              ></Button>
              {/* Button Delete */}
              <Popconfirm
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                title="Bạn có chắc chắn muốn xóa?"
                onConfirm={() => {
                  const id = record._id;
                  axiosClient
                    .patch("/sub-categories/" + id, { is_delete: true })
                    .then(() => {
                      message.success("Xóa thành công!");
                      setRefresh((f) => f + 1);
                    })
                    .catch((err) => {
                      console.log(err);
                      message.error("Xóa thất bại!");
                    });
                }}
                okText="Có"
                cancelText="Không"
              >
                <Button danger icon={<DeleteOutlined />}></Button>
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];
  addedAttribute(columnSubCategories, columns);

  // Handle Form
  const subcategoryField = [
    {
      name: "name",
      label: "Name",
      rules: [
        {
          required: true,
          message: "Tên không được để trống!",
        },
      ],
      component: <Input />,
    },
    {
      name: "category_id",
      label: "Category",
      rules: [
        {
          required: true,
          message: "Danh mục không được để trống!",
        },
      ],
      component: (
        <Select
          options={
            categories &&
            categories.map((category) => {
              return {
                value: category._id,
                label: category.name,
              };
            })
          }
        />
      ),
    },
    {
      name: "createdAt",
      label: "Ngày tạo",
      noStyle: createFormVisible ? true : editFormVisible ? false : true,
      //muốn input trong antd không hiện thị lên thì cần thuộc tính noStyle: true (của antd) và style={display:none} (của css)
      component: (
        <DatePicker
          style={{
            display: createFormVisible ? "none" : editFormVisible ? "" : "none",
          }}
          disabled
          format={"YYYY/MM/DD-HH:mm:ss"}
        />
      ),
    },
    {
      name: "updatedAt",
      label: "Ngày sửa",
      noStyle: createFormVisible ? true : editFormVisible ? false : true,
      component: (
        <DatePicker
          style={{
            display: createFormVisible ? "none" : editFormVisible ? "" : "none",
          }}
          disabled
          format={"YYYY/MM/DD-HH:mm:ss"}
        />
      ),
    },
  ];
  const onFinish = (values: ISubCategory) => {
    axiosClient
      .post("/sub-categories", values)
      .then(() => {
        createForm.resetFields();
        setRefresh((f) => f + 1);
        message.success("Thêm mới thành công!");
      })
      .catch((err) => {
        message.error("Thêm mới thất bại!");
        message.error(err.response.data.msg);
        console.log(err);
      });
    // console.log("👌👌👌", values);
  };
  const onFinishFailed = (errors: object) => {
    console.log("💣💣💣 ", errors);
  };
  const onUpdateFinish = (values: ISubCategory) => {
    axiosClient
      .patch("/sub-categories/" + selectedRecord._id, values)
      .then(() => {
        message.success("Cập nhật thành công!");
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
        message.error(err.response.data.msg);
        console.log(err);
      });
  };
  const onUpdateFinishFailed = (errors: object) => {
    console.log("💣💣💣 ", errors);
  };

  return (
    <div>
      <h1>SubCategory List</h1>
      <Button
        className={`${style.custom_button}`}
        onClick={() => {
          setCreateFormVisible(true);
        }}
      >
        Thêm danh mục con
      </Button>
      <Modal
        centered
        open={createFormVisible}
        title="Thêm mới danh mục con"
        onOk={() => {
          createForm.submit();
        }}
        onCancel={() => {
          setCreateFormVisible(false);
        }}
        okText="Lưu"
        cancelText="Đóng"
      >
        <CustomForm
          form={createForm}
          formName={"create-form"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          fields={subcategoryField}
        />
      </Modal>
      {/* Update Form */}
      <Modal
        centered
        title="Cập nhật danh mục con"
        open={editFormVisible}
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
        }}
        okText="Lưu"
        cancelText="Đóng"
      >
        <CustomForm
          form={updateForm}
          formName={"update-form"}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          fields={subcategoryField}
        />
      </Modal>
      <Table rowKey={"_id"} dataSource={subCategories} columns={columns} />
    </div>
  );
}
