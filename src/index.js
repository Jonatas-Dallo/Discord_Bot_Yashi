// Funções do discord
import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ApplicationCommandOptionType } from 'discord.js';

// Funções do bot
import criarPersonagem from "./commands/criarPersonagem.js";
import deletarPersonagem from "./commands/deletarPersonagem.js";
import escolherPersonagem from "./commands/escolherPersonagem.js";
import mostrarPerfil from "./commands/mostrarPerfil.js";
import editarPersonagem from "./commands/editarPersonagem.js";
import autocomplete from "./commands/autocomplete.js";
import buttonHandler from "./commands/handler/buttonHandler.js"
import modalHandler from "./commands/handler/modelHandler.js"
import selectMenuHandler from "./commands/handler/selectMenuHandler.js"

// Função pra lidar com os Dados
import carregarDados from "./utils/carregarDados.js";

// Import pra pegar o Token do bot pelo .env
import dotenv from 'dotenv';
dotenv.config();

const { TOKEN, CLIENT_ID } = process.env;

////////////////////////// Parte de login do bot /////////////////////////////////

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    carregarDados(personagens, personagensAtuais); // Carregar dados ao iniciar o bot
    console.log(`Bot online como ${client.user.tag}`);
});

client.login(TOKEN);

////////////////////////// Registro de Comandos //////////////////////////////////

// Comandos de barra
const commands = [
    {
        name: 'criar-personagem',
        description: 'Cria um personagem.',
    },
    {
        name: 'escolher-personagem-atual',
        description: 'Escolhe o personagem a ser utilizado.',
        options: [
            {
                name: 'personagem',
                type: ApplicationCommandOptionType.String,
                description: 'Nome do personagem para usar.',
                required: true,
                autocomplete: true,
            },
        ],
    },
    {
        name: 'deletar-personagem',
        description: 'Deleta um personagem.',
        options: [
            {
                name: 'personagem',
                type: ApplicationCommandOptionType.String,
                description: 'O personagem a ser deletado.',
                required: true,
                autocomplete: true,
            },
        ],
    },
    {
        name: 'mostrar-perfil-personagem',
        description: 'Exibe o perfil do personagem.',
        options: [
            {
                name: 'personagem',
                type: ApplicationCommandOptionType.String,
                description: 'Nome do personagem para exibir.',
                required: true,
                autocomplete: true,
            },
        ],
    },
];

// Registro de comandos
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Registrando comandos...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
})();

//////////////////////////////////////////////////////////////////////////////////

// "Banco de dados"
const personagens = new Map(); 
const personagensAtuais = new Map(); 


// Aqui passa por um IF verificando o comando usado, então chama a função que faz o comportamento especifico do bot
client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        // Verifica se a interação já foi respondida para não chamar múltiplos comandos
        if (interaction.replied || interaction.deferred) return;

        if (interaction.isCommand()) {
            // Verifica o comando que foi chamado
            if (interaction.commandName === 'criar-personagem') {
                await criarPersonagem(interaction);
            } else if (interaction.commandName === 'escolher-personagem-atual') {
                await escolherPersonagem(interaction, personagens, personagensAtuais);
            } else if (interaction.commandName === 'deletar-personagem') {
                await deletarPersonagem(interaction, personagens, personagensAtuais);
            } else if (interaction.commandName === 'mostrar-perfil-personagem') {
                await mostrarPerfil(interaction, personagens);
            }
        }
    } else if (interaction.isAutocomplete()) {
        await autocomplete(interaction, personagens, personagensAtuais);
    } else if (interaction.isModalSubmit()) {
        await modalHandler(interaction, personagens, personagensAtuais);
        await editarPersonagem(interaction, personagens, personagensAtuais)
    } else if (interaction.isButton()) {
        await buttonHandler(interaction);
    } else if (interaction.isStringSelectMenu()) {
        await selectMenuHandler(interaction, personagens, personagensAtuais);
    }
});

// Transformar mensagens em embeds
client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content.startsWith('//')) return;

    const personagemAtual = personagensAtuais.get(message.author.id);
    if (!personagemAtual) return;

    const listaPersonagens = personagens.get(message.author.id) || [];
    const personagem = listaPersonagens.find((p) => p.nome === personagemAtual);
    if (!personagem) return;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
        })
        .setTitle(personagem.nome)
        .setDescription(message.content)
        .setThumbnail(personagem.URL);

    await message.delete();
    await message.channel.send({ embeds: [embed] });
});