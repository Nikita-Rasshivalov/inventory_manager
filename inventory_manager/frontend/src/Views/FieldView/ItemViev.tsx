import React from "react";
import { Item } from "../../models/models";

interface ItemInfoTabProps {
  item: Item;
}

const ItemView: React.FC<ItemInfoTabProps> = ({ item }) => {
  return (
    <div className="space-y-2">
      <div>
        <strong>ID:</strong> {item.id}
      </div>
      <div>
        <strong>Version:</strong> {item.version}
      </div>
      <div>
        <strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}
      </div>
      <div>
        <strong>Updated At:</strong> {new Date(item.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default ItemView;
