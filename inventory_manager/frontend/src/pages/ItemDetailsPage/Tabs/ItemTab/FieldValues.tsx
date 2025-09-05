import React from "react";
import { ItemFieldValue } from "../../../../models/models";

interface FieldValuesProps {
  fieldValues?: ItemFieldValue[];
}

const FieldValues: React.FC<FieldValuesProps> = ({ fieldValues }) => {
  if (!fieldValues || fieldValues.length === 0) return null;

  const visibleFields = fieldValues
    .filter((fv) => fv.showInTable)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (visibleFields.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex-1 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Field Values
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
        {visibleFields.map((fv: ItemFieldValue) => (
          <div
            key={fv.id}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded flex flex-col gap-1 transition-colors duration-300"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {fv.field?.name ?? fv.name ?? "Unnamed Field"}
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {fv.field?.type === "boolean" ? (
                fv.value === "true" || fv.value === true ? (
                  "Yes"
                ) : (
                  "No"
                )
              ) : fv.field?.type === "file" && fv.value ? (
                <a
                  href={fv.value as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-blue-400 underline"
                >
                  Open file
                </a>
              ) : fv.value !== null && fv.value !== undefined ? (
                String(fv.value)
              ) : (
                "-"
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldValues;
