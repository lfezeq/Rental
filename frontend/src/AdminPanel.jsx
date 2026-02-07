import { useEffect, useState } from "react";

function AdminPanel({ setPanel, setShowPassword }) {
  const [equipment, setEquipment] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const emptyForm = { id: null, name: "", category: "Electronics", status: "available", description: "" };
  const [formData, setFormData] = useState(emptyForm);

  const statusClass = { available: "status-available", rented: "status-rented", maintenance: "status-maintenance" };
  const categories = ["Electronics", "Projectors", "Accessories"];
  const statuses = ["available", "rented", "maintenance"];
  const statusLabels = { available: "Dostępny", rented: "Wypożyczony", maintenance: "Serwis" };

  const fetchEquipment = () => {
    const params = new URLSearchParams({ category: filterCategory, search });
    fetch(`http://localhost:3000/equipment?${params}`)
      .then(res => res.json())
      .then(setEquipment);
  };

  useEffect(fetchEquipment, [filterCategory, search]);

  const handleSubmit = e => {
    e.preventDefault();
    const url = formData.id ? `http://localhost:3000/equipment/${formData.id}` : "http://localhost:3000/equipment";
    fetch(url, {
      method: formData.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    }).then(() => {
      setFormData(emptyForm);
      setFormVisible(false);
      fetchEquipment();
    });
  };

  const handleDelete = id => {
    if (window.confirm("Na pewno usunąć sprzęt?")) {
      fetch(`http://localhost:3000/equipment/${id}`, { method: "DELETE" })
        .then(fetchEquipment);
    }
  };

  const fetchHistory = async equipmentId => {
    const allRentals = await (await fetch(`http://localhost:3000/rentals`)).json();
    const filtered = allRentals.filter(r => r.equipment_id === equipmentId);
    setHistoryData(filtered);
    setHistoryItem(equipment.find(e => e.id === equipmentId));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Panel Administracyjny</h1>
      <button onClick={() => { setPanel(null); setShowPassword(false); }}>Wróć</button>

      <div style={{ marginTop: 15, marginBottom: 10 }}>
        <input placeholder="Szukaj..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">Wszystkie kategorie</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button onClick={() => setFormVisible(!formVisible)}>
          Dodaj sprzęt ({formVisible ? "Ukryj" : "Pokaż"})
        </button>
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
          <input
            placeholder="Nazwa"
            value={formData.name}
            required
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
            {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
          <textarea
            className="admin-textarea"
            placeholder="Opis sprzętu"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <button type="submit">{formData.id ? "Aktualizuj" : "Dodaj"}</button>
          <button type="button" onClick={() => setFormVisible(false)}>Anuluj</button>
        </form>
      )}

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
              <td className={statusClass[item.status]}>{statusLabels[item.status]}</td>
              <td>
                <button onClick={() => { setFormData(item); setFormVisible(true); }}>Edytuj</button>
                <button onClick={() => setSelectedItem(item)}>Opis</button>
                <button onClick={() => fetchHistory(item.id)}>Historia</button>
                <button onClick={() => handleDelete(item.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.description || "Brak opisu"}</p>
            <button onClick={() => setSelectedItem(null)}>Zamknij</button>
          </div>
        </div>
      )}

      {historyItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Historia: {historyItem.name}</h2>

            {historyData.length === 0 ? (
              <p>Brak historii wypożyczeń</p>
            ) : (
              <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Aktualny status</th>
                    <th>Ostatnie wypożyczenie</th>
                    <th>Liczba wypożyczeń</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{statusLabels[historyItem.status] || "-"}</td>
                    <td>{historyData[historyData.length - 1]?.rented_at || "-"}</td>
                    <td>{historyData.length}</td>
                  </tr>
                </tbody>
              </table>
            )}

            <button onClick={() => setHistoryItem(null)}>Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
