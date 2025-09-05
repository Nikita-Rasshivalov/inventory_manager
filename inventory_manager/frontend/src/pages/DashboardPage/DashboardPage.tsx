import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useGuestInventories } from "../../hooks/useGuestInventories";
import LatestInventoriesTable from "./LatestInventoriesTable";
import TopInventoriesTable from "./TopInventoriesTable";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { latest, top, loading } = useGuestInventories(10);

  const handleClick = (id: number, title: string) => {
    navigate(`/inventory/${id}/items`, { state: { inventoryTitle: title } });
  };

  return (
    <>
      <Header />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <LatestInventoriesTable
          inventories={latest}
          loading={loading}
          onClick={handleClick}
        />
        <TopInventoriesTable
          inventories={top}
          loading={loading}
          onClick={handleClick}
        />
      </div>
    </>
  );
};

export default DashboardPage;
