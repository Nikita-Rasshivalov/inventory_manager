import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useGuestInventories } from "../../hooks/useGuestInventories";
import LatestInventoriesTable from "./LatestInventoriesTable";
import TopInventoriesTable from "./TopInventoriesTable";
import TagCloud from "./TagCloud";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { latest, top, loading } = useGuestInventories(10);

  const handleClick = (id: number, title: string) => {
    navigate(`/inventory/${id}/items`, { state: { inventoryTitle: title } });
  };

  return (
    <>
      <div className="flex flex-col dark:bg-gray-500 min-h-screen">
        <Header />
        <div className="flex-1  flex flex-col gap-6 px-4 pb-12 sm:pb-0">
          <TagCloud />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LatestInventoriesTable
              inventories={latest ?? []}
              loading={loading}
              onClick={handleClick}
            />
            <TopInventoriesTable
              inventories={top ?? []}
              loading={loading}
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
