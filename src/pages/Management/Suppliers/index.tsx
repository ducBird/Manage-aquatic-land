import { useState, useEffect, useRef } from "react";
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
  InputRef,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { columnSuppliers } from "./columnSuppliers";
import { addedAttribute } from "../../../utils/AddAttributeToColumns";
import style from "./suppliers.module.css";
import CustomForm from "../../../components/common/CustomForm";
import moment from "moment";
import type { ColumnType, ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";
import { FilterConfirmProps } from "antd/es/table/interface";
import axios from "axios";
import { API_URL } from "../../../constants/URLS";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ISupplier>({});
  const [createFormVisible, setCreateFormVisible] = useState(false);
  //State search
  type DataIndex = keyof ISupplier;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  // File
  const [file, setFile] = useState<any>();
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
  //Search
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<ISupplier> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  console.log("sub", suppliers);

  const columns: ColumnsType<ISupplier> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "",
      dataIndex: "img_url",
      key: "img_url",
      render: (text) => {
        return (
          <div style={{ textAlign: "center" }}>
            {text && (
              <img
                style={{ maxWidth: 150, width: "30%", minWidth: 70 }}
                src={`${text}`}
                alt="img_supplier"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
      ...getColumnSearchProps("phone_number"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Website",
      dataIndex: "affiliated_website",
      key: "affiliated_website",
      ...getColumnSearchProps("affiliated_website"),
    },
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
                    .delete("/suppliers/" + id)
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
  // addedAttribute(columnSuppliers, columns);

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
      name: "file",
      label: "Hình ảnh",
      component: (
        <Upload
          showUploadList={true}
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
        </Upload>
      ),
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
  const onFinish = (values: any) => {
    axiosClient
      .post("/suppliers", values)
      .then((response) => {
        if (values.file !== undefined) {
          //UPLOAD FILE
          const { _id } = response.data;
          const formData = new FormData();
          formData.append("file", file);
          axios
            .post(`${API_URL}/upload/suppliers/${_id}`, formData)
            .then((response) => {
              message.success("Tải lên hình ảnh thành công!");
              // createForm.resetFields();
            })
            .catch((err) => {
              message.error("Tải lên hình ảnh thất bại!");
              console.log(err);
            });
        }
        createForm.resetFields();
        setRefresh((f) => f + 1);
        message.success("Thêm mới thành công!");
      })
      .catch((err) => {
        message.error("Thêm mới thất bại!");
        message.error(err.response.data.msg);
        console.log(err);
      });
    console.log("👌👌👌", values);
  };
  const onFinishFailed = (errors: object) => {
    console.log("💣💣💣 ", errors);
  };
  const onUpdateFinish = (values: any) => {
    axiosClient
      .patch("/suppliers/" + selectedRecord._id, values)
      .then((response) => {
        if (values.file !== undefined) {
          //UPLOAD FILE
          const { _id } = response.data;
          const formData = new FormData();
          formData.append("file", file);
          axios
            .post(`${API_URL}/upload/suppliers/${_id}`, formData)
            .then((response) => {
              message.success("Cập nhật ảnh thành công!");
              // createForm.resetFields();
            })
            .catch((err) => {
              message.error("Tải lên hình ảnh thất bại!");
              console.log(err);
            });
        }
        updateForm.resetFields();
        setEditFormVisible(false);
        setRefresh((f) => f + 1);
        message.success("Cập nhật thành công!");
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
