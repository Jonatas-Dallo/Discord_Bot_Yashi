import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';

export const mostrarPerfil = async (interaction, personagens) => {
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

    const embed = new EmbedBuilder()
        .setTitle(personagem.nome)
        .addFields(
            { name: 'Nome', value: personagem.nome || 'Não definido', inline: true },
            { name: 'Idade', value: personagem.idade || 'Não definido', inline: true }
            // Adicione mais campos conforme necessário
        );

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

    const editMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('edit_character')
            .setPlaceholder(`Editar ${personagem.nome}`)
            .addOptions([
                { label: 'Editar Nome', value: 'edit_name' },
                { label: 'Editar Idade', value: 'edit_age' },
                { label: 'Editar Raça', value: 'edit_race' },
                { label: 'Editar Genero', value: 'edit_gender' },
                { label: 'Editar Personalidade', value: 'edit_personality' },
                { label: 'Editar Historia', value: 'edit_history' },
                { label: 'Editar Aparência', value: 'edit_appearance' }
            ])
    );

    const thumbnailUrl = personagem.URL; // URL do personagem

    function isValidUrl(url) {
        try {
            new URL(url); // Tenta criar um objeto URL a partir da string
            return true;
        } catch (e) {
            return false; // Se ocorrer um erro, a URL não é válida
        }
    }

    // Verificação da URL para garantir que seja válida
    if (thumbnailUrl && isValidUrl(thumbnailUrl)) {
        embed.setThumbnail(thumbnailUrl);
    } else {
        embed.setThumbnail('https://i.ytimg.com/vi/q4JQz2z2-mc/maxresdefault.jpg'); // yashi mude aqui pra imagem padrão caso n coloquem url
    }

    await interaction.reply({
        embeds: [embed],
        components: [row, editMenu],
        ephemeral: true
    });
};

export default mostrarPerfil;
