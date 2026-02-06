import { useState, useEffect } from "react";
function UserPanel({ setPanel }) {
  const [equipment, setEquipment] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [rentingItem, setRentingItem] = useState(null);
  const [returnDate, setReturnDate] = useState("");

  const fetchEquipment = () => {
    const params = new URLSearchParams({ category, search });
    fetch(`http://localhost:3000/equipment?${params.toString()}`)
      .then(res => res.json())
      .then(setEquipment);
  };
  useEffect(fetchEquipment, [category, search]);
  const handleRentClick = (item) => {
    setRentingItem(item);
    setReturnDate("");
  };
  const handleConfirmRent = () => {
    if (!returnDate) return;
    fetch(`http://localhost:3000/rentals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        equipment_id: rentingItem.id,
        user_id: 1,
        rented_at: new Date().toISOString().split("T")[0],
        return_date: returnDate,
      }),
    }).then(() => {
      setRentingItem(null);
      fetchEquipment();
    });
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <div style={{ padding: 20 }}>
      <h1>Wypożyczalnia sprzętu</h1>
      <button onClick={() => setPanel(null)}>Wróć</button>
      <div>
        <input
          placeholder="Szukaj..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Wszystkie kategorie</option>
          <option value="Electronics">Electronics</option>
          <option value="Projectors">Projectors</option>
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
              <td style={{
                fontWeight: "bold",
                color: item.status === "available" ? "green" :
                       item.status === "rented" ? "red" : "orange"
              }}>{item.status}</td>
              <td>
                {item.status === "available" && (
                  <button onClick={() => handleRentClick(item)}>Wypożycz</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rentingItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Wypożycz: {rentingItem.name}</h2>
            <label>
              Data zwrotu:
              <input
                type="date"
                min={today}
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={handleConfirmRent} disabled={!returnDate}>
                Potwierdź
              </button>
              <button onClick={() => setRentingItem(null)}>
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default UserPanel;
