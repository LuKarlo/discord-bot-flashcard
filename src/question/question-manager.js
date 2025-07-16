import fs from "fs";

function createJsonFileSynchronously(data, filename = "user-data.json") {
  const filePath = "./" + filename;

  try {
    const jsonData = JSON.stringify(data, null, 2); // null, 2 for pretty-printing
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log(`JSON file '${filename}' created successfully at ${filePath}`);
  } catch (error) {
    console.error(`Error creating JSON file synchronously: ${error.message}`);
  }
}

function checkArray(arr, t) {
  console.log(arr, t);
  if (arr.length == 0) return false;
  for (let index = 0; index < arr.length; index++) {
    const e = arr[index];
    if (e == t) {
      return true;
    }
  }
  return false;
}

function giveCard(data) {
  let already_responded = data.user_data[data.idUser]["responded"][data.mate];
  let num_question = Math.max(
    0,
    Math.round(Math.random() * data.splashCard[data.mate].length - 1)
  );

  while (checkArray(already_responded, num_question)) {
    num_question = Math.max(
      0,
      Math.round(Math.random() * data.splashCard[data.mate].length - 1)
    );
  }
  data.user_data[data.idUser]["responded"][data.mate].push(num_question);
  createJsonFileSynchronously(data.user_data);
  return data.splashCard[data.mate][num_question];
}

export default function ManagerQuestion(idUser, mate) {
  let user_data;
  let splashCard;
  try {
    let data = fs.readFileSync("user-data.json", "utf8");
    data = JSON.parse(data);
    user_data = data;

    let splashcard = fs.readFileSync("flashCard.json", "utf8");
    splashcard = JSON.parse(splashcard);
    splashCard = splashcard;
  } catch (error) {
    console.log(error);
  }

  if (user_data[idUser] && splashCard[mate]) {
    if (!user_data[idUser]["responded"][mate]) {
      user_data[idUser]["responded"][mate] = [];
    }
    if (
      user_data[idUser]["responded"][mate].length >= splashCard[mate].length
    ) {
      user_data[idUser]["responded"][mate] = [];
    }
    let data = {
      idUser: idUser,
      mate: mate,
      splashCard: splashCard,
      user_data: user_data,
    };
    return giveCard(data);
  } else if (!user_data[idUser] && splashCard[mate]) {
    user_data[idUser] = {
      responded: {},
    };
    user_data[idUser]["responded"][mate] = [];

    let data = {
      idUser: idUser,
      mate: mate,
      splashCard: splashCard,
      user_data: user_data,
    };
    return giveCard(data);
  } else if (!splashCard[mate]) {
    return { error: "Materia non trovata" };
  }
}
