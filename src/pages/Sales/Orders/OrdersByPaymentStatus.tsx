import { Button, DatePicker, Form, Select, Table, message, Modal } from "antd";
import numeral from "numeral";
import React from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import locale from "antd/lib/date-picker/locale/vi_VN";
import { OrderPaymentStatus } from "../../../meta/OrderPaymentStatus";
import { IOrders } from "../../../interfaces/IOrders";
function OrdersByPaymentStatus() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<IOrders[]>([]);
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
  // Orders
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "last_name",
      key: "last_name",
      render: (text: string) => {
        return <p>{text}</p>;
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
        return <p>{text}</p>;
      },
    },
  ];

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
        .post("/orders/query-order-payment_status", values)
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
        THỐNG KÊ ĐƠN HÀNG THEO TRẠNG THÁI THANH TOÁN
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
            label="Trạng thái thanh toán"
            name="payment_status"
            rules={[
              {
                required: true,
                message: "Hãy chọn trạng thái thanh thanh toán!",
              },
            ]}
          >
            <Select options={OrderPaymentStatus} />
          </Form.Item>
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
      <div style={{ margin: "10px 0" }}>
        <Button
          type="primary"
          onClick={showModal}
          disabled={orders.length === 0}
        >
          Xem thống kê
        </Button>
      </div>
      <Table rowKey="_id" dataSource={orders} columns={columns} />
      <Modal
        title="Thống kê"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <p>
            Tổng hóa đơn: <span>{orders.length}</span>
          </p>
          <p>
            Hóa đơn đã thanh toán: <span>{paidOrders.length}</span>
          </p>
          <p>
            Hóa đơn chưa thanh toán:{" "}
            <span>{orders.length - paidOrders.length}</span>
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
        </div>
      </Modal>
    </div>
  );
}

export default OrdersByPaymentStatus;
