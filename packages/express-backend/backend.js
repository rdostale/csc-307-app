import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Goodbye World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  const promise = userService.getUsers(name, job);

  return promise
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  const promise = userService.findUserById(id);

  return promise
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Resource not found");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const promise = userService.addUser(userToAdd);

  return promise
    .then((response) => {
      res.status(201).send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Bad request");
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const promise = userService.deleteUserById(id);

  return promise
    .then((response) => {
      res.status(204).send();
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Resource not found");
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});