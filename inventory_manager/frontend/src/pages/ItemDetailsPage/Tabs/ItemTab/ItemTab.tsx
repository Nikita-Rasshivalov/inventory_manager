import React from "react";

import ItemInfo from "./ItemInfo";
import FieldValues from "./FieldValues";
import { Item } from "../../../../models/models";

interface ItemTabProps {
  item: Item;
  canEditFields: boolean;
}

const ItemTab: React.FC<ItemTabProps> = ({ item, canEditFields }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <ItemInfo item={item} canEditFields={canEditFields} />
      <FieldValues fieldValues={item.fieldValues} />
    </div>
  );
};

export default ItemTab;
