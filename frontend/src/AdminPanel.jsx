import { useEffect, useState } from "react";

function AdminPanel({ setPanel, setShowPassword }) {
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "Electronics",
    status: "available",
  });
  const [filterCategory, setFilterCategory] = useState("");
  const [search, setSearch] = useState("");

  const fetchEquipment = () => {
    const params = new URLSearchParams({ category: filterCategory, search });
    fetch(`http://localhost:3000/equipment?${params.toString()}`)
      .then(res => res.json())
      .then(setEquipment);
  };

  useEffect(fetchEquipment, [filterCategory, search]);

  const handleEdit = (item) => setFormData(item);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = formData.id
      ? `http://localhost:3000/equipment/${formData.id}`
      : "http://localhost:3000/equipment";
    fetch(url, {
      method: formData.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      setFormData({ id: null, name: "", category: "Electronics", status: "available" });
      fetchEquipment();
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Na pewno usunąć?")) return;
    fetch(`http://localhost:3000/equipment/${id}`, { method: "DELETE" })
      .then(() => fetchEquipment());
  };

  const statusClass = (status) => {
    switch (status) {
      case "available": return "status-available";
      case "rented": return "status-rented";
      case "maintenance": return "status-maintenance";
      default: return "";
    }
  };

  const buttonStyle = {
    padding: "8px 16px",
    margin: "0 5px 5px 0",
    backgroundColor: "#646cff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const buttonHover = (e) => (e.currentTarget.style.backgroundColor = "#5058e0");
  const buttonOut = (e) => (e.currentTarget.style.backgroundColor = "#646cff");

  return (
    <div style={{ padding: 20 }}>
      <h1>Panel Admina</h1>
      <button
        onClick={() => {
          setPanel(null);
          setShowPassword(false); 
        }}
        style={buttonStyle}
        onMouseOver={buttonHover}
        onMouseOut={buttonOut}
      >
        Wróć
      </button>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Szukaj..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginRight: 10, padding: "5px" }}
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="">Wszystkie kategorie</option>
          <option value="Electronics">Electronics</option>
          <option value="Projectors">Projectors</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          placeholder="Nazwa"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ padding: "5px" }}
        />
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          style={{ padding: "5px" }}
        >
          <option value="Electronics">Electronics</option>
          <option value="Projectors">Projectors</option>
          <option value="Accessories">Accessories</option>
        </select>
        <select
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          style={{ padding: "5px" }}
        >
          <option value="available">Dostępny</option>
          <option value="rented">Wypożyczony</option>
          <option value="maintenance">Serwis</option>
        </select>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={buttonHover}
          onMouseOut={buttonOut}
        >
          {formData.id ? "Aktualizuj" : "Dodaj"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Kategoria</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td className={statusClass(item.status)}>{item.status}</td>
              <td>
                <button
                  onClick={() => handleEdit(item)}
                  style={buttonStyle}
                  onMouseOver={buttonHover}
                  onMouseOut={buttonOut}
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={buttonStyle}
                  onMouseOver={buttonHover}
                  onMouseOut={buttonOut}
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
