import React, { useEffect } from "react";
import { Input, Button, Divider, Form, Checkbox, message } from "antd";
import { axiosClient } from "../../libraries/axiosClient";
import { useUser } from "../../hooks/useUser";
import { IEmployees } from "../../interfaces/Employees";

export default function Login() {
  const { addUser } = useUser((state) => state);

  const onFinish = (values: IEmployees) => {
    axiosClient
      .post("/employees/login", values)
      .then((response) => {
        addUser(response.data);
        window.localStorage.setItem(
          "refresh_token",
          response.data.refresh_token
        );
        window.localStorage.setItem("access_token", response.data.access_token);
        message.success(response.data.msg);
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <h1 className="text-center text-2xl">AQUATIC LAND</h1>
      <Divider />
      <Form
        name="login-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ email: "", password: "", remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không thể để trống" },
            { type: "email", message: "Đây không phải là một email" },
          ]}
        >
          <Input placeholder="Nhập email của bạn" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password không thể để trống" },
            {
              min: 5,
              max: 50,
              message: "Độ dài mật khẩu từ 5-50 kí tự",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu của bạn" />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Nhớ mật khẩu</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ minWidth: 120 }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
