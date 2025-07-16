import dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from "discord.js";
import { commands } from "./comands.js"; // Assicurati che il percorso sia corretto

export default async function registerCommands() {
    try {
        console.log("Preparazione per la registrazione dei comandi...");
        console.log(process.env.DISCORD_TOKEN);
        const rest = new REST().setToken(process.env.DISCORD_TOKEN);

        // Prepara i comandi estraendo solo la proprietà 'data' e convertendola in JSON
        const commandsToRegister = commands.map(command => command.data.toJSON());

        console.log("Comandi da registrare:", commandsToRegister); // Puoi loggare per vedere il formato

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commandsToRegister } // Invia i dati JSON corretti
        );

        console.log("Comandi registrati con successo!");
        return true;
    } catch (e) {
        console.error("Errore durante la registrazione dei comandi:", e);
        return false;
    }
};

const prova = async () => {
    await registerCommands();
};

prova();