require("dotenv").config({ path: "server/.env" });
const express = require("express");
const app = express();
const pg = require("pg");
const PORT = 3000;
const cors = require("cors");
const client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());
app.use(express.json());
app.use(require("morgan")("dev"));

app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});

// app.get("/", (req, res, next) => {
//   try {
//     res.send("Its working!!");
//   } catch (error) {
//     next(`something broke ${error}`);
//   }
// });

app.get("/flavors", async (req, res, next) => {
  try {
    const SQL = `
            SELECT * FROM flavors
        `;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    next(`something broke ${error}`);
  }
});

app.get("/flavors/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
        SELECT * FROM flavors WHERE id = $1
        `;
    const response = await client.query(SQL, [id]);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/flavors", async (req, res, next) => {
  try {
    const { name, is_favorite } = req.body;
    const SQL = `
    INSERT INTO flavors(name, is_favorite) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [name, is_favorite]);
    res.status(201).json(response.rows);
  } catch (error) {
    next(error);
  }
});

app.delete("/flavors/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
    DELETE FROM flavors WHERE id = $1
    `;
    await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.put("/flavors/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const SQL = `
    UPDATE flavors 
    SET name = $1 where id = $2
    RETURNING *
    `;
    const response = await client.query(SQL, [name, id]);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
  }
};

init();
