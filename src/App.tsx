import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Categories from "./pages/Management/Categories";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/management/categories" element={<Categories />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
