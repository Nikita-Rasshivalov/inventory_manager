import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/common/PrivateRoute";
import AuthSuccess from "./pages/AuthSuccess";
import AuthPage from "./pages/AuthPage";
import InventoryPage from "./pages/InventoryPage/InventoryPage";
import { ToastContainer } from "react-toastify";
import InventoryItemPage from "./pages/InventoryItemPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/success" element={<AuthSuccess />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route
              path="/inventory/:inventoryId/items"
              element={<InventoryItemPage />}
            />
          </Route>
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
