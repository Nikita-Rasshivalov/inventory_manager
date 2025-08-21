import Header from "../components/layout/Header";
import InventoryPage from "./InventoryPage/InventoryPage";

const DashboardPage = () => {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <InventoryPage />
      </main>
    </>
  );
};

export default DashboardPage;
