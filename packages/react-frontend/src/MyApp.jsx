import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form"

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const id = characters[index].id;

    const promise = fetch(`Http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });

    return promise
      .then((response) => {
        if (response.status === 204) {
          setCharacters(characters.filter((character, i) => i != index));
        } else {
          throw new Error ("Delete failed.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
    
    return promise
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("Creation failed.");
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  function updateList(person) {
    postUser(person)
      .then((newPerson) => setCharacters([...characters, newPerson]))
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;