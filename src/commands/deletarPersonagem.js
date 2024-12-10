import salvarDados from '../utils/salvarDados.js';

export const deletarPersonagem = async (interaction, personagens, personagensAtuais) => {
    const personagemParaDeletar = interaction.options.getString('personagem');
    const listaPersonagens = personagens.get(interaction.user.id) || [];

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
        personagens.delete(interaction.user.id);
    } else {
        personagens.set(interaction.user.id, listaPersonagens);
    }

    if (personagensAtuais.get(interaction.user.id) === personagemParaDeletar) {
        personagensAtuais.delete(interaction.user.id);
    }

    salvarDados(personagens, personagensAtuais);
    await interaction.reply({
        content: `O personagem **${personagemParaDeletar}** foi deletado com sucesso.`,
        ephemeral: true,
    });
};

export default deletarPersonagem;