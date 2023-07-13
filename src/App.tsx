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
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import { useUser } from "./hooks/useUser";

const { Header, Content, Sider } = Layout;

function App() {
  const { initialize, refreshToken } = useUser();

  useEffect(() => {
    initialize();

    // Thiết lập interval để tự động làm mới token mỗi 10 phút
    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);
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
                    path="/management/sub-categories"
                    element={<SubCategories />}
                  />
                  <Route path="/management/suppliers" element={<Suppliers />} />
                  <Route path="/management/customers" element={<Customers />} />
                  <Route path="/management/employees" element={<Employees />} />
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
