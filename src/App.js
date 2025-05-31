import React, { useEffect, useState } from "react";

function App() {
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api")
      .then((res) => res.json())
      .then((data) => setFecha(data.fecha))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Sistema del MP</h1>
      <p>Fecha desde API: {fecha}</p>
    </div>
  );
}

export default App;
