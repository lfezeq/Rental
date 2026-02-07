import { useState } from "react";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";

const ADMIN_PASSWORD = "admin123";

export default function App() {
  const [panel, setPanel] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const loginAdmin = () => {
    if (password === ADMIN_PASSWORD) {
      setPanel("admin");
      setPassword("");
      setShowPassword(false);
    } else {
      alert("Niepoprawne hasło!");
    }
  };

  if (panel === "admin") return <AdminPanel setPanel={setPanel} setShowPassword={setShowPassword} />;
  if (panel === "user") return <UserPanel setPanel={setPanel} />;

  return (
    <div className="screen-select">
      {!showPassword ? (
        <>
          <h1>Wybierz panel</h1>
          <button onClick={() => setPanel("user")}>Użytkownik</button>
          <button onClick={() => setShowPassword(true)}>Admin</button>
        </>
      ) : (
        <>
          <h1>Hasło Admin</h1>
          <input type="password" placeholder="Wpisz hasło" value={password} autoFocus onChange={e => setPassword(e.target.value)} />
          <button onClick={loginAdmin}>Zaloguj</button>
          <button onClick={() => { setShowPassword(false); setPassword(""); }}>Wróć</button>
        </>
      )}
    </div>
  );
}
