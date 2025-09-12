import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { isNullOrEmpty } from "../../utils/validators";
import { toast } from "react-toastify";

interface Field {
  name: string;
  label: string;
  type?: string;
  initialValue?: string;
  initialBooleanValue?: boolean;
}

interface GenericModalProps {
  title: string;
  fields: Field[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string | boolean>) => Promise<void> | void;
}

const GenericModal: React.FC<GenericModalProps> = ({
  title,
  fields,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    const initialValues = Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.type === "checkbox"
          ? f.initialBooleanValue ?? false
          : f.initialValue ?? "",
      ])
    );
    setValues(initialValues);
  }, [fields]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    for (const f of fields) {
      if (f.type !== "checkbox" && isNullOrEmpty(values[f.name] as string)) {
        toast.error(`"${f.label}" cannot be empty`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {title}
                </DialogTitle>

                {fields.map((f) =>
                  f.type === "checkbox" ? (
                    <div key={f.name} className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id={f.name}
                        checked={values[f.name] as boolean}
                        onChange={(e) => handleChange(f.name, e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor={f.name}>{f.label}</label>
                    </div>
                  ) : (
                    <Input
                      key={f.name}
                      type={f.type || "text"}
                      placeholder={f.label}
                      value={values[f.name] as string}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      className="mb-3"
                    />
                  )
                )}

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GenericModal;
