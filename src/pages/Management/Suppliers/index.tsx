import { useState, useEffect } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import { ISupplier } from "../../../interfaces/Supplier";
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
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { API_URL } from "../../../constants/URLS";
import { columnSuppliers } from "./columnSuppliers";
import { addedAttribute } from "../../../utils/AddAttributeToColumns";
import style from "./suppliers.module.css";
import CustomForm from "../../../components/common/CustomForm";
import moment from "moment";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ISupplier>({});
  const [createFormVisible, setCreateFormVisible] = useState(false);
  // Form
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  useEffect(() => {
    axiosClient
      .get("/suppliers")
      .then((response) => {
        const filteredSuppliers = response.data.filter(
          (supplier: ISupplier) => {
            return supplier.is_delete === false;
          }
        );
        setSuppliers(filteredSuppliers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const columns: ColumnsType<ISupplier> = [
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
                    .patch("/suppliers/" + id, { is_delete: true })
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
  addedAttribute(columnSuppliers, columns);

  const phoneValidator = (rule: any, value: any, callback: any) => {
    const phoneNumberPattern =
      /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    if (value && !phoneNumberPattern.test(value)) {
      callback("Invalid phone number!");
    } else {
      callback();
    }
  };
  // Handle Form
  const supplierField = [
    {
      name: "name",
      label: "Tên",
      rules: [
        {
          required: true,
          message: "Tên không được để trống!",
        },
      ],
      component: <Input />,
    },
    {
      name: "email",
      label: "Email",
      rules: [
        {
          required: true,
          message: "Email không được để trống!",
        },
        { type: "email", message: "Email không hợp lệ!" },
      ],
      component: <Input />,
    },
    {
      name: "phone_number",
      label: "SĐT",
      rules: [
        { required: true, message: "Số điện thoại không được để trống!" },
        {
          validator: phoneValidator,
        },
      ],
      component: <Input maxLength={10} />,
    },
    {
      name: "address",
      label: "Địa chỉ",
      rules: [
        {
          required: true,
          message: "Địa chỉ không được để trống!",
        },
      ],
      component: <Input />,
    },
    {
      name: "affiliated_website",
      label: "Website",
      component: <Input />,
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
  const onFinish = (values: ISupplier) => {
    axiosClient
      .post("/suppliers", values)
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
  const onUpdateFinish = (values: ISupplier) => {
    axiosClient
      .patch("/suppliers/" + selectedRecord._id, values)
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
      <h1>Supplier List</h1>
      <Button
        className={`${style.custom_button}`}
        onClick={() => {
          setCreateFormVisible(true);
        }}
      >
        Thêm nhà cung cấp
      </Button>
      <Modal
        centered
        open={createFormVisible}
        title="Thêm mới nhà cung cấp"
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
          fields={supplierField}
        />
      </Modal>
      {/* Update Form */}
      <Modal
        centered
        title="Chỉnh sửa nhà cung cấp"
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
          fields={supplierField}
        />
      </Modal>
      <Table rowKey={"_id"} dataSource={suppliers} columns={columns} />
    </div>
  );
}