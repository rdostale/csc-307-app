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

// const users = {
//   users_list: [
//     {
//       id: "xyz789",
//       name: "Charlie",
//       job: "Janitor"
//     },
//     {
//       id: "abc123",
//       name: "Mac",
//       job: "Bouncer"
//     },
//     {
//       id: "ppp222",
//       name: "Mac",
//       job: "Professor"
//     },
//     {
//       id: "yat999",
//       name: "Dee",
//       job: "Aspring actress"
//     },
//     {
//       id: "zap555",
//       name: "Dennis",
//       job: "Bartender"
//     }
//   ]
// };

// const findUserByName = (name) => {
//   return users["users_list"].filter(
//     (user) => user["name"] === name
//   );
// };

// const findUserById = (id) =>
//   users["users_list"].find((user) => user["id"] === id);

// const addUser = (user) => {
//   users["users_list"].push(user);
//   return user;
// };

// const removeUserById = (id) => {
//   users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
// }

// const generateId = () => {
//   const id = Math.floor(Math.random() * 900000 + 100000).toString();
//   if (findUserById(id)) generateId();
//   else return id
// }

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
  
  // if (name != undefined) {
  //   let result = userService.findUserByName;
  //   if (job != undefined)
  //     result = result.filter((user) => user["job"] === job);
  //   result = { users_list: result };
  //   res.send(result);
  // } else {
  //   res.send(users);
  // }
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
  
  // let result = findUserById(id);
  // if (result === undefined) {
  //   res.status(404).send("Resource not found.");
  // } else {
  //   res.send(result);
  // }
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
  
  // userToAdd.id = generateId();
  // let result = addUser(userToAdd);
  // if (result === undefined) {
  //   res.status(400).send("Bad request.")
  // } else {
  //   res.status(201).send(result);
  // }
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
  // res.status(204).send();
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});