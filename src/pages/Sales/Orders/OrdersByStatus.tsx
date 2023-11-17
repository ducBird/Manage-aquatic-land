import { Button, DatePicker, Form, Select, Table, message, Modal } from "antd";
import numeral from "numeral";
import React, { useEffect } from "react";
import { axiosClient } from "../../../libraries/axiosClient";
import { OrderStatus } from "../../../meta/OrderStatus";
import locale from "antd/lib/date-picker/locale/vi_VN";
import { IOrders } from "../../../interfaces/IOrders";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
function OrdersByStatus() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<IOrders[]>([]);
  const [searchForm] = Form.useForm();
  const [oderValue, setOrderValue] = React.useState<string>("Tất cả đơn hàng");
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
  const datas = [
    {
      name: "Cá và hải sản",
      value: 30,
    },
    {
      name: "Gà",
      value: 10,
    },
    {
      name: "Heo",
      value: 20,
    },
    {
      name: "Rau củ quả",
      value: 40,
    },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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

  useEffect(() => {
    axiosClient.get("/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  const onFinish = (values: any) => {
    // Lọc ra các thuộc tính không xác định
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    const numKeys = Object.keys(filteredValues).length;
    setLoading(true);

    // lọc theo nhiều query
    if (numKeys > 1) {
      axiosClient
        .post("/orders/query-order-by-status", values)
        .then((response) => {
          message.success("Thành công");
          setOrders(response.data);
          setLoading(false);
        })
        .catch((err) => {
          message.error("Đã xảy ra lỗi, vui lòng kiểm tra lại!");
          setLoading(false);
        });
    }
    // lọc một query
    else {
      axiosClient
        .post("/orders/query-one", values)
        .then((response) => {
          message.success("Thành công");
          setOrders(response.data);
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
        THỐNG KÊ ĐƠN HÀNG THEO TRẠNG THÁI
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
            label="Trạng thái đơn hàng"
            name="status"
            rules={[
              {
                required: true,
                message: "Hãy chọn trạng thái đơn hàng!",
              },
            ]}
          >
            <Select
              options={OrderStatus}
              onChange={(value, option) => {
                setOrderValue(`Đơn hàng - ${option.label}`);
              }}
            />
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
      {/* <div>
        <div style={{ marginLeft: "30%" }}>
          <PieChart width={500} height={500}>
            <Pie
              data={datas}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={200}
              fill="#8884d8"
              labelLine={false}
            >
              {datas.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <h3 style={{ textAlign: "center" }}>Biểu đồ doanh thu</h3>
      </div> */}
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

export default OrdersByStatus;
