import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { isNullOrEmpty } from "../../utils/validators";
import { toast } from "react-toastify";

interface Field {
  name: string;
  label: string;
  type?: string;
  initialValue?: string;
}

interface GenericModalProps {
  title: string;
  fields: Field[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}

const GenericModal: React.FC<GenericModalProps> = ({
  title,
  fields,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, f.initialValue || ""]))
  );

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    for (const f of fields) {
      if (isNullOrEmpty(values[f.name])) {
        toast.error(`"${f.label}" was not empty`);
        return;
      }
    }
    onSubmit(values);
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

                {fields.map((f) => (
                  <Input
                    key={f.name}
                    type={f.type || "text"}
                    placeholder={f.label}
                    value={values[f.name]}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    className="mb-3"
                  />
                ))}

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit
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
