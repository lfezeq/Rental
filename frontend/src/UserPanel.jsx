import { useState, useEffect } from "react";

function UserPanel({ setPanel }) {
  const [equipment, setEquipment] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [rentingItem, setRentingItem] = useState(null);
  const [returnDate, setReturnDate] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchEquipment = () => {
    const params = new URLSearchParams({ category, search });
    fetch(`http://localhost:3000/equipment?${params.toString()}`).then(res => res.json()).then(setEquipment);
  };

  useEffect(fetchEquipment, [category, search]);

  const handleRentClick = item => { setRentingItem(item); setReturnDate(""); };
  const handleConfirmRent = () => {
    if (!returnDate) return;
    fetch(`http://localhost:3000/rentals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipment_id: rentingItem.id, user_id: 1, rented_at: new Date().toISOString().split("T")[0], return_date: returnDate }),
    }).then(() => { setRentingItem(null); fetchEquipment(); });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ padding: 20 }}>
      <h1>Wypożyczalnia sprzętu</h1>
      <button onClick={() => setPanel(null)}>Wróć</button>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <input placeholder="Szukaj..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Wszystkie kategorie</option>
          <option value="Electronics">Elektronika</option>
          <option value="Projectors">Projektory</option>
          <option value="Accessories">Akcesoria</option>
        </select>
      </div>

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
              <td style={{ fontWeight: "bold", color: item.status === "available" ? "green" : item.status === "rented" ? "red" : "orange" }}>
                {item.status === "available" ? "Dostępny" : item.status === "rented" ? "Wypożyczony" : "Serwis"}
              </td>
              <td>
                {item.status === "available" && <button onClick={() => handleRentClick(item)}>Wypożycz</button>}
                <button onClick={() => setSelectedItem(item)}>Opis</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rentingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Wypożycz: {rentingItem.name}</h2>
            <label>Data zwrotu: <input type="date" min={today} value={returnDate} onChange={e => setReturnDate(e.target.value)} /></label>
            <div className="modal-buttons" style={{ marginTop: 10 }}>
              <button onClick={handleConfirmRent} disabled={!returnDate}>Potwierdź</button>
              <button onClick={() => setRentingItem(null)}>Anuluj</button>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.description || "Brak opisu"}</p>
            <button onClick={() => setSelectedItem(null)}>Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPanel;
