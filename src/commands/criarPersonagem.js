import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ApplicationCommandOptionType } from 'discord.js';

export const criarPersonagem = async (interaction) => {
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
};

export default criarPersonagem;