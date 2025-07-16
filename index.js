import { commands } from "./src/comands.js";
import ManagerQuestion from "./src/question/question-manager.js";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits, ActivityType } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Accesso alle informazioni del server
    GatewayIntentBits.GuildMessages, // Ricezione di messaggi nei server
    GatewayIntentBits.MessageContent, // Legge messaggi
    GatewayIntentBits.GuildMembers, // Accesso alle informazioni sui membri (necessario per vocale e info utente)
    GatewayIntentBits.GuildPresences, // Accesso agli stati di presenza (utile per vocale)
    GatewayIntentBits.GuildVoiceStates, // Necessario per gestione vocale
  ],
});

let users = {};

// evento: bot online
client.once("ready", () => {
  console.log(`Bot loggato come ${client.user.tag}!`);
  client.user.setActivity("He's watching pornhub", {
    type: ActivityType.Custom,
  });
});

client.on("messageCreate", async (message) => {
  // content -> contenuto messaggio
  /* 
    
    channelId: '709906423496179752',
    guildId: '709107682472230974',
    id: '1394305158019678229',
    createdTimestamp: 1752498654609,
    author: User {
        id: '874300125529407529',
        bot: false,
        system: false,
        username: 'mirko8331',
        globalName: 'Mirko#8331',
    },
    */

  if (message.author.bot) return;

  const channel = client.channels.cache.get(message.channelId);
  if (message.content == "dio porco") {
    channel.send("hai ragione capo");
  } else if (message.content == "fake news") {
    channel.send("a sort");
  }
});

function createJsonFileSynchronously(data, filename = "data.json") {
  const filePath = "./" + filename;

  try {
    const jsonData = JSON.stringify(data, null, 2); // null, 2 for pretty-printing
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log(`JSON file '${filename}' created successfully at ${filePath}`);
  } catch (error) {
    console.error(`Error creating JSON file synchronously: ${error.message}`);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    //console.log(interaction);
    if (interaction.commandName == "quiz") {
      let data = ManagerQuestion(
        interaction.user.globalName,
        interaction.options.getString("materia")
      );

      let name = interaction.user.globalName;
      let Jdata;
      try {
        Jdata = fs.readFileSync("./data.json", "utf8");
        Jdata = JSON.parse(Jdata);
        console.log(Jdata);
      } catch (error) {
        console.log(error);
      }
      let data_write = Jdata;

      data_write[name] = {
        user: interaction.user.globalName,
        last_mate: interaction.options.getString("materia"),
        answer: data.answer,
      };

      createJsonFileSynchronously(data_write);
      interaction.reply({ content: data.question, ephemeral: true });
    }

    if (interaction.commandName == "answer") {
      let Jdata;
      try {
        Jdata = fs.readFileSync("./data.json", "utf8");
        Jdata = JSON.parse(Jdata);
        console.log(Jdata);
      } catch (error) {
        console.log(error);
      }
      if (Jdata[interaction.user.globalName] != "") {
        let data = Jdata[interaction.user.globalName];
        interaction.reply({ content: data.answer, ephemeral: true });
        Jdata[interaction.user.globalName] = "";
        createJsonFileSynchronously(Jdata);
      } else {
        interaction.reply("nessuna domanda inviata");
      }
    }
  }
});

/*

 user: User {
      id: '874300125529407529',
      bot: false,
      system: false,
      flags: [UserFlagsBitField],
      username: 'mirko8331',
      globalName: 'Mirko#8331',
      discriminator: '0',
      avatar: 'eaff81bbc1b5515166780549c8bd056e',
      banner: undefined,
      accentColor: undefined,
      avatarDecoration: null,
      avatarDecorationData: null


      {
      
        user
        last-mat
        index

      }
*/
client.login(process.env.DISCORD_TOKEN);
