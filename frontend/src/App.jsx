import { useState } from "react";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";

function App() {
  const [panel, setPanel] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pw, setPw] = useState("");
  const correctPw = "admin123";

  if (panel === "admin") return <AdminPanel setPanel={setPanel} setShowPassword={setShowPassword} />;
  if (panel === "user") return <UserPanel setPanel={setPanel} />;

  return (
    <div className="screen-select" style={{ textAlign: "center", marginTop: "50px" }}>
      {!showPassword ? (
        <>
          <h1>Wybierz panel</h1>
          <button
            onClick={() => setPanel("user")}
            style={{
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
              backgroundColor: "#646cff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Użytkownik
          </button>
          <button
            onClick={() => setShowPassword(true)}
            style={{
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
              backgroundColor: "#646cff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Admin
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (pw === correctPw) setPanel("admin");
            else alert("Niepoprawne hasło!");
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <h2 style={{ color: "#fff", textShadow: "1px 1px 5px rgba(0,0,0,0.5)" }}>
            Hasło Admin
          </h2>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Wpisz hasło"
            style={{
              padding: "10px",
              width: "200px",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              width: "200px",
              cursor: "pointer",
              backgroundColor: "#646cff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              transition: "background-color 0.3s",
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#5058e0")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#646cff")}
          >
            Zaloguj
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
