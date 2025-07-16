import { SlashCommandBuilder } from 'discord.js';
import MateQuiz from "../flashCard.json" with {type: "json"}; // Keep this import

// Generate the choices once when the file loads
const quizChoices = Object.keys(MateQuiz).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), // Display name
    value: key // Actual value sent to your bot
}));

export const commands = [
    {
        data: new SlashCommandBuilder()
            .setName('aaa')
            .setDescription('Il mio primo comando slash!'),
        async execute(interaction) {
            await interaction.reply({ content: 'Funziono!', ephemeral: true });
        },
    },
    {
        data: new SlashCommandBuilder()
            .setName("quiz")
            .setDescription("Inserisci il nome della materia delle domande")
            .addStringOption(option => 
                option.setName("materia") // Ensure this is lowercase and valid
                    .setDescription("scrivi il nome di una materia")
                    .setRequired(true)
                    // REMOVE setAutocomplete(true) if you want to use setChoices
                    // .setAutocomplete(true) 
                    .setChoices(
                        // Pass the array of choices directly
                        quizChoices 
                    )
            ),
    },
    {
        data: new SlashCommandBuilder()
                .setName("answer")
                .setDescription("Scrive la risposta alla domanda")
    }
];