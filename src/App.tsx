import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import HeaderMenu from "./components/layout/HeaderMenu";
import SiderMenu from "./components/layout/SiderMenu";
import Categories from "./pages/Management/Categories";
import Products from "./pages/Management/Products";
import SubCategories from "./pages/Management/SubCategories";
import Suppliers from "./pages/Management/Suppliers";
import Customers from "./pages/Management/Customers";
import Employees from "./pages/Management/Employees";
import Accumulated from "./pages/Management/Accumulated";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import { useUser } from "./hooks/useUser";
import Orders from "./pages/Sales/Orders";
import numeral from "numeral";
import "numeral/locales/vi";
numeral.locale("vi");

const { Header, Content, Sider } = Layout;

function App() {
  const { users, initialize, refreshToken } = useUser((state) => state) as any;

  useEffect(() => {
    if (Object.keys(users).length !== 0) {
      // console.log("initialized");
      initialize();
      // Thiết lập interval để tự động làm mới token mỗi 10 phút
      const refreshInterval = setInterval(() => {
        // console.log("run refresh-token api");
        refreshToken();
      }, 10 * 60 * 1000);

      return () => {
        clearInterval(refreshInterval);
      };
    }
  }, [Object.keys(users).length]);
  return (
    <main>
      <BrowserRouter>
        <Layout>
          <Header className="header">
            {window.localStorage.getItem("refresh_token") ? (
              <HeaderMenu />
            ) : (
              <></>
            )}
          </Header>
          <Layout>
            <Sider theme="light" width={"20%"} style={{ minHeight: "100vh" }}>
              {window.localStorage.getItem("refresh_token") ? (
                <SiderMenu />
              ) : (
                <></>
              )}
            </Sider>
            <Layout
              style={{
                padding: "0 20px",
              }}
            >
              <Content
                style={{
                  padding: "10px 2px",
                  minHeight: 280,
                }}
              >
                <Routes>
                  {/* HOME */}
                  {window.localStorage.getItem("refresh_token") ? (
                    <Route path="/" element={<HomePage />} />
                  ) : (
                    <Route path="/" element={<Login />} />
                  )}

                  {/* HOME */}
                  <Route path="/home" element={<HomePage />} />
                  <Route
                    path="/management/categories"
                    element={<Categories />}
                  />
                  <Route path="/management/products" element={<Products />} />
                  <Route
                    path="/management/subCategories"
                    element={<SubCategories />}
                  />
                  <Route path="/management/suppliers" element={<Suppliers />} />
                  <Route path="/management/customers" element={<Customers />} />
                  <Route path="/management/employees" element={<Employees />} />
                  <Route
                    path="/management/accumulated"
                    element={<Accumulated />}
                  />
                  <Route path="/sales/orders" element={<Orders />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </BrowserRouter>
    </main>
  );
}

export default App;
