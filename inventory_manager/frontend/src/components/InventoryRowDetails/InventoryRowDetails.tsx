import React from "react";

interface InventoryRowDetailsProps {
  colSpan: number;
  children?: React.ReactNode;
}

export const InventoryRowDetails: React.FC<InventoryRowDetailsProps> = ({
  colSpan,
  children,
}) => (
  <tr className="bg-gray-50">
    <td colSpan={colSpan}>
      <div className="p-4 border-l-4 border-blue-500 ml-4">
        {children || (
          <p className="text-gray-600 italic">Details (placeholder)</p>
        )}
      </div>
    </td>
  </tr>
);
