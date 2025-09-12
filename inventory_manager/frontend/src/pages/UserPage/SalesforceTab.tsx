import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import GenericModal from "../../components/layout/Modal";
import { useSalesforce } from "../../hooks/useSalesforce";
import { SalesforcePayload, User } from "../../models/models";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

interface SalesforceTabProps {
  user: User;
}

const SalesforceTab: React.FC<SalesforceTabProps> = ({ user }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({
    company: "",
    position: "",
    phone: "",
  });

  const { accountQuery, createMutation, updateMutation } = useSalesforce(
    user.id,
    user.salesforceAccountId,
    user.salesforceContactId
  );

  useEffect(() => {
    if (accountQuery.data?.account && accountQuery.data?.contact) {
      setFormValues({
        company: accountQuery.data.account.Name || "",
        position: accountQuery.data.contact.Title || "",
        phone: accountQuery.data.contact.Phone || "",
      });
    }
  }, [accountQuery.data]);

  const fields = [
    { name: "company", label: "Company", initialValue: formValues.company },
    { name: "position", label: "Position", initialValue: formValues.position },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      initialValue: formValues.phone,
    },
  ];

  const handleSubmit = async (values: Record<string, string | boolean>) => {
    const payload: SalesforcePayload & { userId: number } = {
      userId: user.id,
      company: String(values.company),
      position: String(values.position),
      phone: String(values.phone),
    };

    try {
      if (accountQuery.data?.account && accountQuery.data?.contact) {
        await updateMutation.mutateAsync(payload);
        toast.success("Salesforce account updated!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Salesforce account created!");
      }
      setModalOpen(false);
      accountQuery.refetch();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Error saving Salesforce account"
      );
    }
  };

  const isLoading = accountQuery.isLoading;

  if (isLoading) {
    return (
      <div className="p-4 max-w-lg mx-auto flex justify-center items-center h-40">
        <Loader />
      </div>
    );
  }

  const hasAccount = Boolean(
    accountQuery.data?.account && accountQuery.data?.contact
  );

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Salesforce Info
        </h2>

        {hasAccount ? (
          <div className="flex flex-col space-y-2">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Company:
              </span>{" "}
              <span className="text-gray-900 dark:text-gray-100">
                {formValues.company || "-"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Position:
              </span>{" "}
              <span className="text-gray-900 dark:text-gray-100">
                {formValues.position || "-"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Phone:
              </span>{" "}
              <span className="text-gray-900 dark:text-gray-100">
                {formValues.phone || "-"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            No Salesforce account linked. Click create to add one.
          </p>
        )}

        <Button
          onClick={() => setModalOpen(true)}
          className={`mt-4 w-full sm:w-auto px-6 py-2 rounded-lg transition-colors duration-200 ${
            hasAccount
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white"
              : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 text-white"
          }`}
        >
          {hasAccount ? "Edit Salesforce Account" : "Create Salesforce Account"}
        </Button>
      </div>

      <GenericModal
        title={
          hasAccount ? "Edit Salesforce Account" : "Create Salesforce Account"
        }
        fields={fields}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SalesforceTab;
