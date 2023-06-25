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
import axios from "axios";

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
  const [openModalVariant, setOpenModalVariant] = useState(false);
  //----------------------------------------------------------------//

  //--- state xử lý render khi có sự thay đổi ở useEffect ---//
  const [refresh, setRefresh] = useState(0);
  //----------------------------------------------------------------//
  const [variants, setVariants] = useState<IVariant[]>([]);

  // Form
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [variantForm] = Form.useForm();

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
              {/* Button Variant */}
              <Button
                type="primary"
                onClick={() => {
                  setOpenModalVariant(true);
                  setSelectedRecord(record);
                  variantForm.setFieldsValue(record);
                  // console.log(record);
                }}
              >
                Biến thể
              </Button>
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
    // {
    //   name: "variantButton",
    //   component: editFormVisible ? (
    //     <Button
    //       type="dashed"
    //       onClick={() => {
    //         setOpenModalVariant(true);
    //       }}
    //     >
    //       Biến thể
    //     </Button>
    //   ) : (
    //     <></>
    //   ),
    // },
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

  const onVariantFinish = (values: any) => {
    if (!selectedRecord.variants?.length) {
      createVariants(values);
    } else {
      updateVariants(values);
    }
  };
  const updateVariants = (values: any) => {
    axios
      .put("http://localhost:9000/variants-p/updateVariants", values)
      .then((res) => {
        console.log("res.data", res.data);
        message.success("Cập nhật thành công!");
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại!");
        message.error(err.response.data.msg);
        console.log(err);
      });
  };
  const createVariants = (values: any) => {
    const updateVariants: any = [];
    values.variants.map((v: IVariant, index: number) => {
      const valueVariants = { ...v, product_id: selectedRecord._id };
      axiosClient
        .post("/variants-p/", valueVariants)
        .then((res) => {
          const variantId = res.data.id;
          updateVariants.push(variantId);
          // console.log("valueVariants", valueVariants);
          // console.log("res.data", res.data);
          // console.log("updateVariants",updateVariants);
          axiosClient.patch("/products/" + selectedRecord._id, {
            variants: updateVariants,
          });
          setRefresh((f) => f + 1);
          // setOpenModalVariant(false);
          message.success(`Biến thể ${index + 1} đã được cập nhật!`);
        })
        .catch((err) => {
          message.error("Cập nhật biến thể thất bại!");
          message.error(err.response.data.msg);
          console.log(err);
        });
    });
  };
  const onVariantFinishFailed = (errors: object) => {
    console.log(errors);
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
          fields={productField}
        />
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
      </Modal>

      {/* --- VARIANT FORM --- */}
      <Modal
        centered
        width={"50%"}
        open={openModalVariant}
        title="Biến thể"
        onOk={() => {
          variantForm.submit();
        }}
        onCancel={() => {
          setOpenModalVariant(false);
        }}
        okText="Lưu"
        cancelText="Đóng"
      >
        {/* UPDATE VARIANT FORM */}
        <Form
          form={variantForm}
          name="variant-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onVariantFinish}
          onFinishFailed={onVariantFinishFailed}
        >
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key} className={style.variant_container}>
                    <h4 style={{ marginTop: 0 }}>Biến thể {index + 1}</h4>
                    <Form.Item
                      label={`Tên biến thể`}
                      name={[field.name, "title"]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={`Giá điều chỉnh`}
                      name={[field.name, "price_adjustment"]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      label={`Thứ tứ xếp`}
                      name={[field.name, "position"]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item label="Tùy chọn" name={[field.name, "options"]}>
                      <Form.List name={[field.name, "options"]}>
                        {(
                          optionFields,
                          { add: addOption, remove: removeOption }
                        ) => (
                          <>
                            {optionFields.map((optionField, optionIndex) => (
                              <div
                                key={optionField.key}
                                className={style.option_container}
                              >
                                <Form.Item
                                  label={`Tùy chọn ${optionIndex + 1}`}
                                  name={[optionField.name, "value"]}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  label="Giá cộng thêm"
                                  name={[optionField.name, "add_valuation"]}
                                >
                                  <InputNumber />
                                </Form.Item>
                                <Form.Item
                                  label="Tồn kho"
                                  name={[
                                    optionField.name,
                                    "inventory_quantity",
                                  ]}
                                >
                                  <InputNumber />
                                </Form.Item>
                                <Form.Item
                                  label={`Hình ảnh`}
                                  name={[optionField.name, "images"]}
                                >
                                  <Form.List
                                    name={[optionField.name, "images"]}
                                  >
                                    {(
                                      imageFields,
                                      { add: addImage, remove: removeImage }
                                    ) => (
                                      <>
                                        {imageFields.map(
                                          (imageField, imageIndex) => (
                                            <div
                                              key={imageField.key}
                                              className={style.option_container}
                                            >
                                              <Form.Item
                                                label={`Image ${
                                                  imageIndex + 1
                                                }`}
                                                name={[imageField.name, "src"]}
                                              >
                                                <Input />
                                                {/* <Upload
                                                  showUploadList={true}
                                                  beforeUpload={(file) => {
                                                    setFile(file);
                                                    return false;
                                                  }}
                                                >
                                                  <Button
                                                    icon={<UploadOutlined />}
                                                  >
                                                    Tải lên hình ảnh
                                                  </Button> 
                                                </Upload>*/}
                                              </Form.Item>
                                              <Form.Item
                                                label="Thứ tự xếp"
                                                name={[
                                                  imageField.name,
                                                  "position",
                                                ]}
                                              >
                                                <Input />
                                              </Form.Item>
                                              <Button
                                                onClick={() =>
                                                  removeImage(imageField.name)
                                                }
                                              >
                                                Xóa hình ảnh
                                              </Button>
                                            </div>
                                          )
                                        )}
                                        <Button
                                          type="dashed"
                                          onClick={() => addImage()}
                                        >
                                          Thêm hình ảnh
                                        </Button>
                                      </>
                                    )}
                                  </Form.List>
                                </Form.Item>
                                <Button
                                  danger
                                  onClick={() => removeOption(optionField.name)}
                                >
                                  Xóa tùy chọn
                                </Button>
                              </div>
                            ))}
                            <Button type="dashed" onClick={() => addOption()}>
                              Thêm tùy chọn
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                    <Button danger onClick={() => remove(field.name)}>
                      Xóa biến thể
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()}>
                  Thêm biến thể
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      <Table rowKey={"_id"} dataSource={products} columns={columns} />
    </div>
  );
}
