import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { supplyService } from "../services/mockData";

function EditSupplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    condition: "good",
    assignedTo: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSupplyDetails();
  }, [id]);

  const loadSupplyDetails = async () => {
    try {
      const supplyId = parseInt(id, 10);
      const result = await supplyService.getById(supplyId);
      if (result) {
        setFormData({
          name: result.name,
          condition: result.condition,
          assignedTo: result.assignedTo || "",
          notes: result.notes || "",
        });
      } else {
        setError("Supply not found");
      }
    } catch (err) {
      setError("Failed to load supply details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const supplyId = parseInt(id, 10);
      await supplyService.update(supplyId, formData);
      navigate(`/supply/${id}`, { state: { message: "Supply updated successfully!" } });
    } catch (err) {
      setError("Failed to update supply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading supply details...</div>
      </DashboardLayout>
    );
  }

  if (error && !formData.name) {
    return (
      <DashboardLayout>
        <div className="error-message">{error}</div>
        <button className="btn-secondary" onClick={() => navigate("/supply")}>
          Back to Supplies
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-content">
        <div className="page-header">
          <h1>Edit Supply</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Equipment Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="good">Good</option>
                <option value="needs maintenance">Needs Maintenance</option>
                <option value="needs replacement">Needs Replacement</option>
                <option value="broken">Broken</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-control"
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate(`/supply/${id}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditSupplyPage; 