import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "",
    status: "available",
    description: "",
    image_url: ""
  });
  const fetchEquipment = () => {
    fetch("http://localhost:3000/equipment")
      .then(res => res.json())
      .then(setEquipment)
      .catch(console.error);
  };

  useEffect(fetchEquipment, []);

  const handleEdit = (item) => {
    setFormData({ ...item });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = formData.id
      ? `http://localhost:3000/equipment/${formData.id}`
      : "http://localhost:3000/equipment";
    const method = formData.id ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => {
        fetchEquipment();
        setFormData({ id: null, name: "", category: "", status: "available", description: "", image_url: "" });
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    if (!id || !window.confirm("Na pewno usunąć?")) return;

    fetch(`http://localhost:3000/equipment/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Błąd przy usuwaniu");
        fetchEquipment();
      })
      .catch(console.error);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel Admina - Sprzęt</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nazwa"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          placeholder="Kategoria"
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          required
        />
        <select
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="available">Dostępny</option>
          <option value="rented">Wypożyczony</option>
          <option value="maintenance">Serwis</option>
        </select>
        <button type="submit">{formData.id ? "Zapisz" : "Dodaj"}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Kategoria</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td style={{
                color: item.status === "available" ? "green" :
                       item.status === "rented" ? "red" : "orange",
                fontWeight: "bold"
              }}>
                {item.status}
              </td>
              <td>
                <button id="edycja" onClick={() => handleEdit(item)}>Edytuj</button>
                <button id="usun" onClick={() => handleDelete(item.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;