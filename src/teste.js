require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ApplicationCommandOptionType } = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const fs = require('fs');

// Caminho do arquivo JSON onde os dados serão armazenados
const path = './personagens.json';

// Base de dados para armazenar os personagens
const personagens = new Map(); // { userId: [{ nome, URL, aparencia, personalidade, historia }] }
const personagensAtuais = new Map(); // { userId: personagemAtual }

// Função para salvar os dados no arquivo JSON
function salvarDados() {
    const data = {
        personagens: Array.from(personagens.entries()),
        personagensAtuais: Object.fromEntries(personagensAtuais.entries()),
    };

    try {
        fs.writeFileSync('database.json', JSON.stringify(data, null, 4));
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
}

// Função para carregar os dados do arquivo JSON
function carregarDados() {
    try {
        const rawData = fs.readFileSync('database.json');
        if (rawData.length === 0) {
            return; // Arquivo vazio, não carregar nada
        }
        const data = JSON.parse(rawData);

        // Certifique-se de que os dados têm os formatos esperados
        if (Array.isArray(data.personagens)) {
            data.personagens.forEach(([key, value]) => personagens.set(key, value));
        }
        if (data.personagensAtuais && typeof data.personagensAtuais === 'object') {
            Object.entries(data.personagensAtuais).forEach(([key, value]) => personagensAtuais.set(key, value));
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Inicialização do bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Evento de inicialização
client.once('ready', () => {
    carregarDados(); // Carregar dados ao iniciar o bot
    console.log(`Bot online como ${client.user.tag}`);
});

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
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
})();

// Interação com o comando /criar-personagem
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, user } = interaction;

    if (commandName === 'criar-personagem') {
        try {
            await interaction.showModal({
                customId: 'personagem_formulario',
                title: 'Criação de Personagem',
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                customId: 'nome',
                                label: 'Nome do Personagem',
                                style: 1,
                                placeholder: 'Insira o nome do seu personagem',
                                required: true,
                            },
                        ],
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                customId: 'URL',
                                label: 'Imagem URL',
                                style: 1,
                                placeholder: 'Ex.: https://www.image.com/image.jpg',
                                required: true,
                            },
                        ],
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                customId: 'aparencia',
                                label: 'Aparência',
                                style: 2,
                                placeholder: 'Insira, descritivamente, a aparência do seu personagem',
                                required: false,
                            },
                        ],
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                customId: 'personalidade',
                                label: 'Personalidade',
                                style: 2,
                                placeholder: 'Insira, descritivamente, a personalidade do seu personagem',
                                required: false,
                            },
                        ],
                    },
                    {
                        type: 1,
                        components: [
                            {
                                type: 4,
                                customId: 'historia',
                                label: 'História',
                                style: 2,
                                placeholder: 'Insira, descritiva e resumidamente, a história do seu personagem',
                                required: false,
                            },
                        ],
                    },
                ],
            });
        } catch (error) {
            console.error('Erro ao exibir o criar-personagem:', error);
        }
    }

    if (commandName === 'escolher-personagem-atual') {
        const personagemEscolhido = interaction.options.getString('personagem');
        const listaPersonagens = personagens.get(user.id) || [];

        if (!listaPersonagens.some((p) => p.nome === personagemEscolhido)) {
            await interaction.reply({
                content: 'Personagem não encontrado. Por favor, tente novamente.',
                ephemeral: true,
            });
            return;
        }

        personagensAtuais.set(user.id, personagemEscolhido);
        salvarDados(); // Salva os dados ao escolher o personagem atual
        await interaction.reply({
            content: `O personagem atual selecionado é ${personagemEscolhido}.`,
            ephemeral: true,
        });
    }

    if (commandName === 'deletar-personagem') {
        const personagemParaDeletar = interaction.options.getString('personagem');
        const listaPersonagens = personagens.get(user.id) || [];

        const personagemIndex = listaPersonagens.findIndex((p) => p.nome === personagemParaDeletar);
        if (personagemIndex === -1) {
            await interaction.reply({
                content: 'Personagem não encontrado. Por favor, tente novamente.',
                ephemeral: true,
            });
            return;
        }

        listaPersonagens.splice(personagemIndex, 1);

        if (listaPersonagens.length === 0) {
            personagens.delete(user.id);
        } else {
            personagens.set(user.id, listaPersonagens);
        }

        if (personagensAtuais.get(user.id) === personagemParaDeletar) {
            personagensAtuais.delete(user.id);
        }

        salvarDados();
        await interaction.reply({
            content: `O personagem **${personagemParaDeletar}** foi deletado com sucesso.`,
            ephemeral: true,
        });
    }

    if (commandName === 'mostrar-perfil-personagem') {
        const personagemNome = interaction.options.getString('personagem');
        const listaPersonagens = personagens.get(interaction.user.id) || [];
        const personagem = listaPersonagens.find((p) => p.nome === personagemNome);

        if (!personagem) {
            await interaction.reply({
                content: 'Personagem não encontrado.',
                ephemeral: true
            });
            return;
        }

        // Criação do Embed
        const embed = new EmbedBuilder()
            .setTitle(personagem.nome)
            .setThumbnail(personagem.URL)
            .addFields(
                { name: 'Nome', value: personagem.nome || 'Não definido', inline: true },
                { name: 'Idade', value: personagem.idade || 'Não definido', inline: true },
                { name: 'Imagem URL', value: personagem.URL || 'Não definido', inline: true },
                { name: 'Aniversário', value: personagem.aniversario || 'Não definido', inline: true },
                { name: 'Raça', value: personagem.raca || 'Não definido', inline: true },
                { name: 'Gênero', value: personagem.genero || 'Não definido', inline: true },
                { name: 'Pronomes', value: personagem.pronomes || 'Não definido', inline: true },
                { name: 'Título', value: personagem.titulo || 'Não definido', inline: true },
                { name: 'Cor do Embed', value: personagem.corEmbed || 'Não definido', inline: true },
                { name: 'Criado em', value: personagem.criadoEm || 'Não definido', inline: true },
                { name: 'Última Postagem em', value: personagem.ultimaPostagem || 'Não definido', inline: true },
                { name: 'ID do Autor', value: personagem.autorId || 'Não definido', inline: true }
            );

        // Botões interativos
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('appearance')
                .setLabel('Aparência')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('backstory')
                .setLabel('História')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('personality')
                .setLabel('Personalidade')
                .setStyle(ButtonStyle.Success)
        );

        // Dropdown para edição
        const editMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('edit_character')
                .setPlaceholder(`Editar ${personagem.nome}`)
                .addOptions([
                    { label: 'Editar Nome', value: 'edit_name' },
                    { label: 'Editar Idade', value: 'edit_age' },
                    { label: 'Editar Raça', value: 'edit_race' },
                    { label: 'Editar Gênero', value: 'edit_gender' },
                    { label: 'Editar Personalidade', value: 'edit_personality' }
                ])
        );

        // Resposta da interação
        await interaction.reply({
            embeds: [embed],
            components: [row, editMenu],
            ephemeral: true
        });
    }
});

// Salvando respostas do criar-personagem
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'personagem_formulario') {
        const nome = interaction.fields.getTextInputValue('nome');
        const URL = interaction.fields.getTextInputValue('URL');
        const aparencia = interaction.fields.getTextInputValue('aparencia');
        const personalidade = interaction.fields.getTextInputValue('personalidade');
        const historia = interaction.fields.getTextInputValue('historia');

        if (!personagens.has(interaction.user.id)) {
            personagens.set(interaction.user.id, []);
        }
        personagens.get(interaction.user.id).push({
            nome,
            URL,
            aparencia,
            personalidade,
            historia,
        });

        salvarDados();
        await interaction.reply({
            content: 'Personagem criado com sucesso.',
            ephemeral: true,
        });
    }
});

// Implementação do Autocomplete
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const { commandName, user } = interaction;

    const listaPersonagens = personagens.get(user.id) || [];
    const sugestões = listaPersonagens.map((p) => ({ name: p.nome, value: p.nome }));

    await interaction.respond(sugestões.slice(0, 25));
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

// Eventos de botão
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'appearance') {
        await interaction.reply({ content: 'Detalhes sobre a aparência do personagem...', ephemeral: true });
    } else if (interaction.customId === 'backstory') {
        await interaction.reply({ content: 'História do personagem...', ephemeral: true });
    } else if (interaction.customId === 'personality') {
        await interaction.reply({ content: 'Personalidade do personagem...', ephemeral: true });
    }
});

// Eventos de dropdown
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    const selectedValue = interaction.values[0];

    // Aqui você pode implementar a lógica para cada opção do dropdown
    if (selectedValue === 'edit_name') {
        // Exibe um modal para editar o nome do personagem
        await interaction.showModal({
            customId: 'edit_name_modal',
            title: 'Editar Nome',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            customId: 'novo_nome',
                            label: 'Novo Nome',
                            style: 1,
                            placeholder: 'Insira o novo nome do personagem',
                            required: true,
                        },
                    ],
                },
            ],
        });
    } else if (selectedValue === 'edit_age') {
        // Exibe um modal para editar a idade do personagem
        await interaction.showModal({
            customId: 'edit_age_modal',
            title: 'Editar Idade',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            customId: 'nova_idade',
                            label: 'Nova Idade',
                            style: 1,
                            placeholder: 'Insira a nova idade do personagem',
                            required: true,
                        },
                    ],
                },
            ],
        });
    } else if (selectedValue === 'edit_race') {
        // Exibe um modal para editar a raça do personagem
        await interaction.showModal({
            customId: 'edit_race_modal',
            title: 'Editar Raça',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            customId: 'nova_raca',
                            label: 'Nova Raça',
                            style: 1,
                            placeholder: 'Insira a nova raça do personagem',
                            required: true,
                        },
                    ],
                },
            ],
        });
    } else if (selectedValue === 'edit_gender') {
        // Exibe um modal para editar o gênero do personagem
        await interaction.showModal({
            customId: 'edit_gender_modal',
            title: 'Editar Gênero',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            customId: 'novo_genero',
                            label: 'Novo Gênero',
                            style: 1,
                            placeholder: 'Insira o novo gênero do personagem',
                            required: true,
                        },
                    ],
                },
            ],
        });
    } else if (selectedValue === 'edit_personality') {
        // Exibe um modal para editar a personalidade do personagem
        await interaction.showModal({
            customId: 'edit_personality_modal',
            title: 'Editar Personalidade',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            customId: 'nova_personalidade',
                            label: 'Nova Personalidade',
                            style: 2,
                            placeholder: 'Insira a nova personalidade do personagem',
                            required: true,
                        },
                    ],
                },
            ],
        });
    }
});

// Handler para editar o nome do personagem
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'edit_name_modal') {
        const novoNome = interaction.fields.getTextInputValue('novo_nome');
        const personagemNome = interaction.message.embeds[0].title;

        // Busca o personagem na lista
        const listaPersonagens = personagens.get(interaction.user.id) || [];
        const personagemIndex = listaPersonagens.findIndex((p) => p.nome === personagemNome);

        if (personagemIndex !== -1) {
            listaPersonagens[personagemIndex].nome = novoNome;
            personagens.set(interaction.user.id, listaPersonagens);
            salvarDados();
            await interaction.reply({ content: 'Nome do personagem atualizado com sucesso!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Erro ao atualizar o nome do personagem.', ephemeral: true });
        }
    }
});

// Handler para editar a idade do personagem
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'edit_age_modal') {
        const novaIdade = interaction.fields.getTextInputValue('nova_idade');
        const personagemNome = interaction.message.embeds[0].title;

        // Busca o personagem na lista
        const listaPersonagens = personagens.get(interaction.user.id) || [];
        const personagemIndex = listaPersonagens.findIndex((p) => p.nome === personagemNome);

        if (personagemIndex !== -1) {
            listaPersonagens[personagemIndex].idade = novaIdade;
            personagens.set(interaction.user.id, listaPersonagens);
            salvarDados();
            await interaction.reply({ content: 'Idade do personagem atualizada com sucesso!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Erro ao atualizar a idade do personagem.', ephemeral: true });
        }
    }
});

// Handler para editar a raça do personagem
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'edit_race_modal') {
        const novaRaca = interaction.fields.getTextInputValue('nova_raca');
        const personagemNome = interaction.message.embeds[0].title;

        // Busca o personagem na lista
        const listaPersonagens = personagens.get(interaction.user.id) || [];
        const personagemIndex = listaPersonagens.findIndex((p) => p.nome === personagemNome);

        if (personagemIndex !== -1) {
            listaPersonagens[personagemIndex].raca = novaRaca;
            personagens.set(interaction.user.id, listaPersonagens);
            salvarDados();
            await interaction.reply({ content: 'Raça do personagem atualizada com sucesso!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Erro ao atualizar a raça do personagem.', ephemeral: true });
        }
    }
});

// Handler para editar o gênero do personagem
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'edit_gender_modal') {
        const novoGenero = interaction.fields.getTextInputValue('novo_genero');
        const personagemNome = interaction.message.embeds[0].title;

        // Busca o personagem na lista
        const listaPersonagens = personagens.get(interaction.user.id) || [];
        const personagemIndex = listaPersonagens.findIndex((p) => p.nome === personagemNome);

        if (personagemIndex !== -1) {
            listaPersonagens[personagemIndex].genero = novoGenero;
            personagens.set(interaction.user.id, listaPersonagens);
            salvarDados();
            await interaction.reply({ content: 'Gênero do personagem atualizado com sucesso!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Erro ao atualizar o gênero do personagem.', ephemeral: true });
        }
    }
});

// Handler para editar a personalidade do personagem
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'edit_personality_modal') {
        const novaPersonalidade = interaction.fields.getTextInputValue('nova_personalidade');
        const personagemNome = interaction.message.embeds[0].title;

        // Busca o personagem na lista
        const listaPersonagens = personagens.get(interaction.user.id) || [];
        const personagemIndex = listaPersonagens.findIndex((p) => p.nome === personagemNome);

        if (personagemIndex !== -1) {
            listaPersonagens[personagemIndex].personalidade = novaPersonalidade;
            personagens.set(interaction.user.id, listaPersonagens);
            salvarDados();
            await interaction.reply({ content: 'Personalidade do personagem atualizada com sucesso!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Erro ao atualizar a personalidade do personagem.', ephemeral: true });
        }
    }
});

// Logando o bot
client.login(TOKEN);