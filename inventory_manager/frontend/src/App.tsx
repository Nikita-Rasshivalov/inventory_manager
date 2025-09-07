import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthProvider";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import PrivateRoute from "./components/common/PrivateRoute";
import AuthSuccess from "./pages/AuthPage/AuthSuccess";
import { ToastContainer } from "react-toastify";
import InventoryItemPage from "./pages/InventoryItemPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ItemDetailsPage from "./pages/ItemDetailsPage/ItemDetailsPage";
import UserProfilePage from "./pages/UserPage/UserProfilePage";
import SearchPage from "./pages/SearchPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/search" element={<SearchPage />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />
            <Route
              path="/inventory/:inventoryId/items"
              element={<InventoryItemPage />}
            />
            <Route
              path="/inventory/:inventoryId/items/:itemId"
              element={<ItemDetailsPage />}
            />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<UserProfilePage />} />
            </Route>

            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
