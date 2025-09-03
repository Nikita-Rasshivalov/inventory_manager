import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/common/PrivateRoute";
import AuthSuccess from "./pages/AuthPage/AuthSuccess";
import { ToastContainer } from "react-toastify";
import InventoryItemPage from "./pages/InventoryItemPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ItemDetailsPage from "./pages/ItemDetailsPage/ItemDetailsPage";
import UserProfilePage from "./pages/UserPage/UserProfilePage";
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
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/success" element={<AuthSuccess />} />
          <Route path="/users/:userId" element={<UserProfilePage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route
              path="/inventory/:inventoryId/items"
              element={<InventoryItemPage />}
            />
          </Route>
          <Route
            path="/inventory/:inventoryId/items/:itemId"
            element={<ItemDetailsPage />}
          />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
