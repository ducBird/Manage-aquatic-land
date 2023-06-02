import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import HeaderMenu from "./components/layout/HeaderMenu";
import SiderMenu from "./components/layout/SiderMenu";
import Categories from "./pages/Management/Categories";
import Products from "./pages/Management/Products";
import SubCategories from "./pages/Management/SubCategories";
import Suppliers from "./pages/Management/Suppliers";

const { Header, Content, Sider } = Layout;

function App() {
  return (
    <main>
      <BrowserRouter>
        <Layout>
          <Header className="header">
            <HeaderMenu />
          </Header>
          <Layout>
            <Sider theme="light" width={"20%"} style={{ minHeight: "100vh" }}>
              <SiderMenu />
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