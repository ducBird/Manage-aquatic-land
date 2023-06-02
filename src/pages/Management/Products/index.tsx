import { useState, useEffect } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import { IProduct } from "../../../interfaces/Product";
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
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { columnProducts } from "./columnProducts";
import { addedAttribute } from "../../../utils/AddAttributeToColumns";
import style from "./products.module.css";
import CustomForm from "../../../components/common/CustomForm";
import moment from "moment";
import { ICategory } from "../../../interfaces/Category";
import { ISubCategory } from "../../../interfaces/SubCategory";
import { ISupplier } from "../../../interfaces/Supplier";
import { IVariant } from "../../../interfaces/Variant";

export default function Products() {
  //--- state để render dữ liệu ở columns, productField và xử lý <Select/> trong Form antd ---//
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [subCategoriesCreateForm, setSubCategoriesCreateForm] = useState<
    ISubCategory[]
  >([]);
  const [subCategoriesUpdateForm, setSubCategoriesUpdateForm] = useState<
    ISubCategory[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [selectedRecord, setSelectedRecord] = useState<IProduct>({});
  //----------------------------------------------------------------//

  //--- state quản lý đóng mở Modal ---//
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [openCreateModalVariant, setCreateOpenModalVariant] = useState(false);
  const [openUpdateModalVariant, setUpdateOpenModalVariant] = useState(false);
  //----------------------------------------------------------------//

  //--- state xử lý render khi có sự thay đổi ở useEffect ---//
  const [refresh, setRefresh] = useState(0);
  //----------------------------------------------------------------//

  const [disabledButtonVariant, setDisabledButtonVariant] = useState(true);
  const [variants, setVariants] = useState<IVariant[]>([]);

  // Form
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [createVariantForm] = Form.useForm();
  const [updateVariantForm] = Form.useForm();

  //gets list products
  useEffect(() => {
    axiosClient
      .get("/products")
      .then((response) => {
        const filteredProducts = response.data.filter((product: IProduct) => {
          return product.is_delete === false;
        });
        setProducts(filteredProducts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  //gets list categories
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
  //get list sub-categories by category_id for createForm
  useEffect(() => {
    if (selectedCategoryId) {
      axiosClient
        .get(`/sub-categories/${selectedCategoryId}`)
        .then((response) => {
          const filteredSubCategories = response.data.filter(
            (subCategory: ISubCategory) => {
              return subCategory.is_delete === false;
            }
          );
          setSubCategoriesCreateForm(filteredSubCategories);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedCategoryId]);
  //get list sub-categories by category_id for updateForm
  useEffect(() => {
    if (selectedRecord.category?._id) {
      axiosClient
        .get(`/sub-categories/${selectedRecord.category?._id}`)
        .then((response) => {
          const filteredSubCategories = response.data.filter(
            (subCategory: ISubCategory) => {
              return subCategory.is_delete === false;
            }
          );
          setSubCategoriesUpdateForm(filteredSubCategories);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedRecord.category?._id]);
  //get list suppliers
  useEffect(() => {
    axiosClient
      .get(`/suppliers`)
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
  }, []);

  // Columns Table
  const columns: ColumnsType<IProduct> = [
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
                  const formattedDateOfManufacture = moment(
                    record.date_of_manufacture,
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  const formattedExpirationDate = moment(
                    record.expiration_date,
                    "YYYY-MM-DD HH:mm:ss"
                  );
                  const updatedRecord = {
                    ...record,
                    createdAt: formattedCreatedAt,
                    updatedAt: formattedUpdatedAt,
                    date_of_manufacture: formattedDateOfManufacture,
                    expiration_date: formattedExpirationDate,
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
                    .patch("/products/" + id, { is_delete: true })
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
  addedAttribute(columnProducts, columns);

  // Handle Form
  const handleCategoryChange = (value: any) => {
    setSelectedCategoryId(value);
  };

  // PRODUCT FIELD For createForm & updateForm
  const productField = [
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
      name: "category_id",
      label: "Danh mục",
      rules: [
        {
          required: true,
          message: "Danh mục không được để trống!",
        },
      ],
      component: !editFormVisible ? (
        <Select
          onChange={handleCategoryChange}
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
      ) : (
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
      name: "sub_category_id",
      label: "Danh mục con",
      /* sử dụng defaultValue ở phía dưới sẽ bị antd cảnh báo nên sử dụng initialValue cho field ở <CustomForm /> */
      initialValue: editFormVisible
        ? [
            {
              value: selectedRecord?.sub_category?._id,
              label: selectedRecord?.sub_category?.name,
            },
          ]
        : "",
      rules: [
        {
          required: true,
          message: "Danh mục con không được để trống!",
        },
      ],
      component: !editFormVisible ? (
        <Select
          disabled={selectedCategoryId ? false : true}
          options={
            subCategoriesCreateForm &&
            subCategoriesCreateForm.map((subCategory) => {
              return {
                value: subCategory._id,
                label: subCategory.name,
              };
            })
          }
        />
      ) : (
        <Select
          // defaultValue={[
          //   {
          //     value: selectedRecord?.sub_category?._id,
          //     label: selectedRecord?.sub_category?.name,
          //   },
          // ]}
          options={
            subCategoriesUpdateForm &&
            subCategoriesUpdateForm.map((subCategory) => {
              return {
                value: subCategory._id,
                label: subCategory.name,
              };
            })
          }
        />
      ),
    },
    {
      name: "supplier_id",
      label: "Nhà cung cấp",
      rules: [
        {
          required: true,
          message: "Nhà cung cấp không được để trống!",
        },
      ],
      component: (
        <Select
          options={
            suppliers &&
            suppliers.map((supplier) => {
              return {
                value: supplier._id,
                label: supplier.name,
              };
            })
          }
        />
      ),
    },
    {
      name: "discount",
      label: "Giảm giá",
      initialValue: 0,
      rules: [
        {
          validator: (_: any, value: any) => {
            if (value < 0) {
              return Promise.reject(new Error("Giảm giá từ 0% đến 100%"));
            } else if (value > 100) {
              return Promise.reject(new Error("Giảm giá từ 0% đến 100%"));
            }
            return Promise.resolve();
          },
        },
      ],
      component: <InputNumber maxLength={3} addonAfter="%" />,
    },
    {
      name: "soft_order",
      label: "Thứ tự xếp",
      initialValue: 10,
      component: <InputNumber />,
    },
    {
      name: "date_of_manufacture",
      label: "Ngày sản xuất",
      initialValue: moment(new Date(), "YYYY-MM-DD HH:mm:ss"),
      component: (
        <DatePicker format={"YYYY/MM/DD-HH:mm:ss"} placeholder="Chọn ngày" />
      ),
    },
    {
      name: "expiration_date",
      label: "Ngày hết hạn",
      initialValue: moment(
        new Date(new Date().getFullYear() + 1, new Date().getMonth()),
        "YYYY-MM-DD HH:mm:ss"
      ),
      component: (
        <DatePicker format={"YYYY/MM/DD-HH:mm:ss"} placeholder="Chọn ngày" />
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
    {
      name: "description",
      label: "Mô tả",
      initialValue: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      component: <TextArea rows={3} />,
    },
    {
      name: "variantButton",
      component: editFormVisible ? (
        <Button
          type="dashed"
          onClick={() => {
            setUpdateOpenModalVariant(true);
          }}
        >
          Biến thể
        </Button>
      ) : (
        <Button
          type="dashed"
          disabled={disabledButtonVariant}
          onClick={() => {
            setCreateOpenModalVariant(true);
          }}
        >
          Biến thể
        </Button>
      ),
    },
  ];

  const onCreateFinish = (values: IProduct) => {
    axiosClient
      .post("/products", values)
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
  const onCreateFinishFailed = (errors: object) => {
    console.log("💣💣💣 ", errors);
  };
  const onFieldsChange = (_: any, allFields: any) => {
    // Danh sách thuộc tính không liên quan đến việc kiểm tra đầu vào trong createForm
    const valuesToDelete = ["variantButton", "createdAt", "updatedAt"];
    // Lọc và xóa phần tử cha khi phần tử con có giá trị trong valuesToDelete
    const newAllField = allFields.filter((value: any) => {
      return !valuesToDelete.includes(value.name[0]);
    });
    // để có thể biết được vì sao cần những dòng trên thì phải console.log("newAllField", newAllField) để xem allFields trả về
    // console.log("newAllField", newAllField);
    const isAllFieldsFilled = newAllField.every((field: any) => {
      return field.value !== undefined && field.value !== "";
    });
    console.log(moment(new Date(), "YYYY-MM-DD HH:mm:ss"));

    setDisabledButtonVariant(!isAllFieldsFilled);
  };
  const onUpdateFinish = (values: IProduct) => {
    axiosClient
      .patch("/products/" + selectedRecord._id, values)
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
      <h1>Product List</h1>
      <Button
        className={`${style.custom_button}`}
        onClick={() => {
          setCreateFormVisible(true);
        }}
      >
        Thêm sản phẩm
      </Button>
      {/* --- CREATE PRODUCT FORM --- */}
      <Modal
        centered
        open={createFormVisible}
        title="Thêm mới sản phẩm"
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
          onFinish={onCreateFinish}
          onFinishFailed={onCreateFinishFailed}
          onFieldsChange={onFieldsChange}
          fields={productField}
        />

        {/* --- CREATE VARIANT FORM --- */}
        <Modal
          centered
          open={openCreateModalVariant}
          title="Biến thể"
          onOk={() => {
            updateVariantForm.submit();
          }}
          onCancel={() => {
            setCreateOpenModalVariant(false);
          }}
          okText="Lưu"
          cancelText="Đóng"
        >
          <Form
            form={updateVariantForm}
            name="variant-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={(values: IVariant) => {
              console.log("variant finished", values);
            }}
          >
            {/* Form.Item cho trường "Title" */}
            <Form.Item label="Tên biến thể" name="title">
              <Input />
            </Form.Item>

            {/* Form.Item cho trường "price_adjustment" */}
            <Form.Item label="Giá" name="price_adjustment">
              <Input />
            </Form.Item>

            {/* Form.Item cho trường "position" */}
            <Form.Item label="Vị trí" name="position">
              <Input />
            </Form.Item>

            {/* Form.List cho danh sách "options" */}
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {/* Hiển thị các trường cho mỗi option */}
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      {/* Form.Item cho trường "Option Value" */}
                      <Form.Item
                        label={`Option Value ${index}`}
                        name={[field.name, "value"]}
                      >
                        <Input />
                      </Form.Item>
                      {/* Form.Item cho trường "Add Valuation" */}
                      <Form.Item
                        label={`Add Valuation ${index}`}
                        name={[field.name, "add_valuation"]}
                      >
                        <InputNumber />
                      </Form.Item>
                      {/* Form.Item cho trường "Inventory Quantity" */}
                      <Form.Item
                        label={`Inventory Quantity ${index}`}
                        name={[field.name, "inventory_quantity"]}
                      >
                        <InputNumber />
                      </Form.Item>
                      {/* Form.Item cho trường "Image Source" */}
                      <Form.Item
                        label={`Image Source ${index}`}
                        name={[field.name, "images", "src"]}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ))}

                  {/* Nút để thêm và xoá option */}
                  <Form.Item>
                    <button
                      type="button"
                      onClick={() => add()}
                      style={{ marginRight: "8px" }}
                    >
                      Add Option
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(fields.length - 1)}
                    >
                      Remove Option
                    </button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </Modal>

      {/* --- UPDATE PRODUCT FORM --- */}
      <Modal
        centered
        title="Cập nhật sản phẩm"
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
          fields={productField}
        />
        {/* --- UPDATE VARIANT FORM --- */}
        <Modal
          centered
          open={openUpdateModalVariant}
          title="Biến thể"
          onOk={() => {
            updateVariantForm.submit();
          }}
          onCancel={() => {
            setUpdateOpenModalVariant(false);
          }}
          okText="Lưu"
          cancelText="Đóng"
        >
          {/* UPDATE VARIANT FORM */}
          <Form
            form={updateVariantForm}
            name="variant-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={(values: IVariant) => {
              console.log("variant finished", values);
            }}
          >
            {/* Form.Item cho trường "Title" */}
            <Form.Item label="Tên biến thể" name="title">
              <Input />
            </Form.Item>

            {/* Form.Item cho trường "price_adjustment" */}
            <Form.Item label="Giá" name="price_adjustment">
              <Input />
            </Form.Item>

            {/* Form.Item cho trường "position" */}
            <Form.Item label="Vị trí" name="position">
              <Input />
            </Form.Item>

            {/* Form.List cho danh sách "options" */}
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {/* Hiển thị các trường cho mỗi option */}
                  {fields.map((field, index) => (
                    <div key={field.key}>
                      {/* Form.Item cho trường "Option Value" */}
                      <Form.Item
                        label={`Option Value ${index}`}
                        name={[field.name, "value"]}
                      >
                        <Input />
                      </Form.Item>
                      {/* Form.Item cho trường "Add Valuation" */}
                      <Form.Item
                        label={`Add Valuation ${index}`}
                        name={[field.name, "add_valuation"]}
                      >
                        <InputNumber />
                      </Form.Item>
                      {/* Form.Item cho trường "Inventory Quantity" */}
                      <Form.Item
                        label={`Inventory Quantity ${index}`}
                        name={[field.name, "inventory_quantity"]}
                      >
                        <InputNumber />
                      </Form.Item>
                      {/* Form.Item cho trường "Image Source" */}
                      <Form.Item
                        label={`Image Source ${index}`}
                        name={[field.name, "images", "src"]}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ))}

                  {/* Nút để thêm và xoá option */}
                  <Form.Item>
                    <button
                      type="button"
                      onClick={() => add()}
                      style={{ marginRight: "8px" }}
                    >
                      Add Option
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(fields.length - 1)}
                    >
                      Remove Option
                    </button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </Modal>
      <Table rowKey={"_id"} dataSource={products} columns={columns} />
    </div>
  );
}
