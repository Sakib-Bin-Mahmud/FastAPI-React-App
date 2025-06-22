import React, { useState, useEffect } from "react";
import api from "./api";

const App = () => {
  const [transactions, setTransaction] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchTransaction = async () => {
    const response = await api.get('/transactions');
    setTransaction(response.data);
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/transactions/${editingId}`, formData);
      setEditingId(null);
    } else {
      await api.post('/transactions/', formData);
    }
    fetchTransaction();
    setFormData({
      amount: '',
      category: '',
      description: '',
      is_income: false,
      date: ''
    });
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      is_income: transaction.is_income,
      date: transaction.date,
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    fetchTransaction();
  };

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-primary mb-4 shadow">
        <div className="container">
          <span className="navbar-brand mb-0 h1">The Finance App @ TechOptions</span>
        </div>
      </nav>

      <div className="container">
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white fw-bold">
            {editingId ? "Edit Transaction" : "Add New Transaction"}
          </div>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="amount" className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    name="amount"
                    onChange={handleInputChange}
                    value={formData.amount}
                    placeholder="e.g. 100.50"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="category" className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    onChange={handleInputChange}
                    value={formData.category}
                    placeholder="e.g. Groceries"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    onChange={handleInputChange}
                    value={formData.description}
                    placeholder="Optional description"
                  />
                </div>

                <div className="col-md-3 d-flex align-items-center">
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="is_income"
                      name="is_income"
                      onChange={handleInputChange}
                      checked={formData.is_income}
                    />
                    <label className="form-check-label" htmlFor="is_income">Income</label>
                  </div>
                </div>

                <div className="col-md-3">
                  <label htmlFor="date" className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    onChange={handleInputChange}
                    value={formData.date}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-success">
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-white fw-bold">Transaction History</div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Income?</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-3 text-muted">No transactions yet.</td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>${transaction.amount.toFixed(2)}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.is_income ? '✅' : '❌'}</td>
                        <td>{transaction.date}</td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => handleEdit(transaction)}>
                              Edit
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(transaction.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
