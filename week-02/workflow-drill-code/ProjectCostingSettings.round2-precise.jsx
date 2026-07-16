import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(60, "Company name must be 60 characters or fewer"),
  taxRate: z
    .coerce.number({ error: "Tax rate must be a number" })
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100"),
  defaultCurrency: z.enum(["PKR", "USD", "AED"], {
    error: "Select a valid currency",
  }),
});

function ProjectCostingSettings({ onSave }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      taxRate: "",
      defaultCurrency: "PKR",
    },
  });

  function onSubmit(data) {
    onSave ? onSave(data) : console.log("Saving settings", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Project Costing Settings</h2>

      <div>
        <label htmlFor="companyName">Company Name</label>
        <input
          id="companyName"
          {...register("companyName")}
          aria-invalid={!!errors.companyName}
          aria-describedby="companyName-error"
        />
        {errors.companyName && (
          <span id="companyName-error" role="alert">
            {errors.companyName.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="taxRate">Tax Rate (%)</label>
        <input
          id="taxRate"
          type="number"
          {...register("taxRate")}
          aria-invalid={!!errors.taxRate}
          aria-describedby="taxRate-error"
        />
        {errors.taxRate && (
          <span id="taxRate-error" role="alert">
            {errors.taxRate.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="defaultCurrency">Default Currency</label>
        <select
          id="defaultCurrency"
          {...register("defaultCurrency")}
          aria-invalid={!!errors.defaultCurrency}
          aria-describedby="defaultCurrency-error"
        >
          <option value="PKR">PKR</option>
          <option value="USD">USD</option>
          <option value="AED">AED</option>
        </select>
        {errors.defaultCurrency && (
          <span id="defaultCurrency-error" role="alert">
            {errors.defaultCurrency.message}
          </span>
        )}
      </div>

      <button type="submit">Save</button>
    </form>
  );
}

export default ProjectCostingSettings;
