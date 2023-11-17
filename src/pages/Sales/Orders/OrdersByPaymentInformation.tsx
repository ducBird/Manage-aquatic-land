import { Button, DatePicker, Form, Select, Table, message, Modal } from "antd";
import numeral from "numeral";
import React from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import locale from "antd/lib/date-picker/locale/vi_VN";
import {
  OrderPaymentInformation,
  PaymentOption,
} from "../../../meta/OrderPaymentInformation";
import { IOrders } from "../../../interfaces/IOrders";
function OrdersByPaymentInformation() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<IOrders[]>([]);
  const [oderValue, setOrderValue] = React.useState<string>("Tất cả đơn hàng");
  const [searchForm] = Form.useForm();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const renderStatus = (result: any) => {
    return (
      <div>
        {result && result === "WAIT FOR CONFIRMATION"
          ? "Chờ xác nhận"
          : result === "WAITING FOR PICKUP"
          ? "Chờ lấy hàng"
          : result === "DELIVERING"
          ? "Đang giao"
          : result === "DELIVERED"
          ? "Đã giao"
          : result === "RECEIVED"
          ? "Đã nhận"
          : result === "CANCELLED"
          ? "Đã hủy"
          : result === "RETURNS"
          ? "Trả hàng"
          : result === "RETURNING"
          ? "Đang trả hàng"
          : result === "RETURNED"
          ? "Đã trả"
          : "Null"}
      </div>
    );
  };

  const renderPaymentStatus = (result: any) => {
    return (
      <div>
        {result && result === true
          ? "Đã thanh toán"
          : result === false
          ? "Chưa thanh toán"
          : "Null"}
      </div>
    );
  };
  // Sử dụng filter để lọc ra các hóa đơn đã thanh toán (payment_status === true)
  const paidOrders = orders.filter((order) => order?.payment_status === true);
  // Sử dụng filter để lọc ra các hóa đơn có (payment_information === vnpay)
  const paymentVnpay = orders.filter(
    (order) => order?.payment_information === "vnpay"
  );
  // Sử dụng filter để lọc ra các hóa đơn có (payment_information === paypal)
  const paymentPaypal = orders.filter(
    (order) => order?.payment_information === "paypal"
  );
  // Sử dụng filter để lọc ra các hóa đơn có (payment_information === paypal)
  const paymentCod = orders.filter(
    (order) => order?.payment_information === "CASH"
  );
  // Tính tổng từ các đơn hàng
  const total = orders.reduce(
    (total, order) => total + order?.total_money_order,
    0
  );
  //tổng thu
  const totalRevenue = paidOrders.reduce(
    (total, order) => total + order.total_money_order,
    0
  );
  // Orders
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (customer: any) => {
        return <p>{customer.full_name}</p>;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: number) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "payment_information",
      key: "payment_information",
    },
    {
      title: "trạng thái thanh toán",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (text: string) => {
        return renderPaymentStatus(text);
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        return renderStatus(text);
      },
    },
    {
      title: "Nhân viên",
      dataIndex: "employee",
      key: "employee",
      render: (text: string, record: any) => {
        return <strong>{record.employee?.full_name}</strong>;
      },
    },
    {
      title: "Ngày tạo hóa đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: any) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_money_order",
      key: "total_money_order",
      render: (text: number) => {
        return <p>{numeral(text).format("0,0").replace(/,/g, ".")} vnđ</p>;
      },
    },
  ];
  React.useEffect(() => {
    axiosClient.get("/orders").then((response) => {
      setOrders(response.data);
      console.log(response.data);
    });
  }, []);
  const onFinish = (values: any) => {
    console.log(values);
    // Lọc ra các thuộc tính không xác định
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    const numKeys = Object.keys(filteredValues).length;
    console.log(numKeys);
    setLoading(true);

    if (numKeys > 1) {
      axiosClient
        .post("/orders/query-order-by-payment_information", values)
        .then((response) => {
          message.success("Thành công");
          setOrders(response.data);
          console.log(response.data);
          setLoading(false);
        })
        .catch((err) => {
          message.error("Đã xảy ra lỗi, vui lòng kiểm tra lại!");
          setLoading(false);
        });
    } else {
      axiosClient
        .post("/orders/query-one", values)
        .then((response) => {
          message.success("Thành công");
          setOrders(response.data);
          console.log(response.data);
          setLoading(false);
        })
        .catch((err) => {
          message.error("Đã xảy ra lỗi, vui lòng kiểm tra lại!");
          setLoading(false);
        });
    }
  };

  const onFinishFailed = (errors: any) => {
    console.log("🐣", errors);
  };

  return (
    <div>
      <h1
        style={{ textAlign: "center", marginBottom: "50px", fontSize: "25px" }}
      >
        THỐNG KÊ ĐƠN HÀNG THEO HÌNH THỨC THANH TOÁN
      </h1>
      <div>
        <Form
          form={searchForm}
          name="search-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ status: "" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            label="Hình thức thanh toán"
            name="payment_information"
            rules={[
              {
                required: true,
                message: "Hãy chọn hình thức thanh toán!",
              },
            ]}
          >
            <Select
              options={OrderPaymentInformation}
              onChange={(value, option) => {
                setOrderValue(`Đơn hàng - ${option.label}`);
              }}
            />
          </Form.Item>
          {/* <Form.Item label="Hình thức thanh toán" name="payment_information">
            <Select options={OrderPaymentInformation} />
          </Form.Item>
          <Form.Item label="Trạng thái thanh toán" name="payment_status">
            <Select options={OrderPaymentStatus} />
          </Form.Item> */}
          <Form.Item label="Từ ngày" name="fromDate">
            <DatePicker format="YYYY-MM-DD" locale={locale} />
          </Form.Item>
          <Form.Item label="Đến ngày" name="toDate">
            <DatePicker format="YYYY-MM-DD" locale={locale} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Đang xử lý ..." : "Lọc thông tin"}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ margin: "10px 0", display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Button
            type="primary"
            onClick={showModal}
            disabled={orders.length === 0}
          >
            Xem thống kê
          </Button>
        </div>
        <div style={{ fontSize: "18px", fontWeight: 500 }}>
          <p>{oderValue}</p>
        </div>
      </div>
      <Table rowKey="_id" dataSource={orders} columns={columns} />
      <Modal open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div
          style={{
            fontSize: "30px",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Thống kê
        </div>
        <div
          style={{
            fontWeight: 500,
            fontSize: "18px",
          }}
        >
          <p>
            Tổng số hóa đơn:{" "}
            <span style={{ color: "green" }}>{orders.length}</span>
          </p>
          <p>
            Hóa đơn đã thanh toán:{" "}
            <span style={{ color: "green" }}>{paidOrders.length}</span>
          </p>
          <p>
            Hóa đơn chưa thanh toán:{" "}
            <span style={{ color: "red" }}>
              {orders.length - paidOrders.length}
            </span>
          </p>
          <p>
            Thanh toán vnpay: <span>{paymentVnpay.length}</span>
          </p>
          <p>
            Thanh toán paypal: <span>{paymentPaypal.length}</span>
          </p>
          <p>
            Thanh toán khi nhận hàng: <span>{paymentCod.length}</span>
          </p>
          <p>
            Tổng:{" "}
            <span style={{ color: "blue" }}>
              {numeral(total).format("0,0").replace(/,/g, ".")} vnđ
            </span>
          </p>
          <p>
            Tổng thu:{" "}
            <span style={{ color: "green" }}>
              {numeral(totalRevenue).format("0,0").replace(/,/g, ".")} vnđ
            </span>
          </p>
          <p>
            Tổng chi:{" "}
            <span style={{ color: "red" }}>
              {numeral(total - totalRevenue)
                .format("0,0")
                .replace(/,/g, ".")}{" "}
              vnđ
            </span>
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default OrdersByPaymentInformation;
