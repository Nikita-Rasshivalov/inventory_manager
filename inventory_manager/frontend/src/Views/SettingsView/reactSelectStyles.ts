export const getReactSelectStyles = () => ({
  control: (base: any) => ({
    ...base,
    backgroundColor: "#f3f4f6",
    color: "#111827",
    borderColor: "#d1d5db",
    "&:hover": {
      borderColor: "#9ca3af",
    },
    boxShadow: "none",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#f3f4f6",
    color: "#111827",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#e5e7eb" : "#f3f4f6",
    color: "#111827",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#111827",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#3b82f6",
    color: "#fff",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#fff",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#fff",
    "&:hover": {
      backgroundColor: "#2563eb",
      color: "#fff",
    },
  }),
});
