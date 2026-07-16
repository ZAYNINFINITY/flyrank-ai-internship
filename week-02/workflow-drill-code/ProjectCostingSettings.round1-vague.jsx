import { useState } from "react";

function ProjectCostingSettings() {
  const [companyName, setCompanyName] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [defaultCurrency, setDefaultCurrency] = useState("PKR");

  function handleSave() {
    console.log("Saving settings", companyName, taxRate, defaultCurrency);
    alert("Settings saved!");
  }

  return (
    <div>
      <h2>Project Costing Settings</h2>
      <div>
        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Tax Rate %"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Default Currency"
          value={defaultCurrency}
          onChange={(e) => setDefaultCurrency(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default ProjectCostingSettings;
