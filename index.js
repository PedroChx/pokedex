const express = require("express");
const db = require("./config/database.js");
const app = express();

const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/pokemon", async (req, res, next) => {
  const pokemon = await db.query("SELECT * FROM POKEMON;");
  res.json(pokemon);
});

app.post("/pokemon", (req, res, next) => {
  console.log(req.body);
  res.send("Informacion guardada! (de a mentis)");
});

app.post("/user", async (req, res) => {
  // const name = req.body.name;
  // const last_name= req.body.last_name;
  // const mail = req.body.mail;
  // const phone_number = req.body.phone_number;
  // const password = req.body.password;

  const { name, last_name, mail, phone_number, password } = req.body;

  // const query = `INSERT INTO users (name, last_name, mail, phone_number, password) VALUES ('${name}', '${last_name}', '${mail}', '${phone_number}', '${password}');`;

  let query = `INSERT INTO users (name, last_name, mail, phone_number, password)`;

  query += `VALUES ('${name}', '${last_name}', '${mail}', '${phone_number}', '${password}');`;

  const rows = await db.query(query);

  console.log(rows);
  res.json(rows);
});

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Utiliza parámetros para evitar inyecciones SQL
    let query = 'SELECT * FROM users WHERE name = ?';
    const rows = await db.query(query, [name]);

    if (rows.length === 0) {
      res.status(401).json({ message: "Usuario no encontrado" });
    } else {
      const user = rows[0];
      if (user.password === password) {
        res.json({ message: "Inicio de sesión exitoso" });
      } else {
        res.status(401).json({ message: "Contraseña incorrecta" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});
