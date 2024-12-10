import salvarDados from '../utils/salvarDados.js';

export const escolherPersonagem = async (interaction, personagens, personagensAtuais) => {
    const personagemEscolhido = interaction.options.getString('personagem');
    const listaPersonagens = personagens.get(interaction.user.id) || [];

    if (!interaction.replied) {  // Verifica se já foi respondida
        await interaction.deferReply();
    }

    if (!listaPersonagens.some((p) => p.nome === personagemEscolhido)) {
        await interaction.editReply({
            content: 'Personagem não encontrado. Por favor, tente novamente.',
            ephemeral: true,
        });
        return;
    }

    personagensAtuais.set(interaction.user.id, personagemEscolhido);
    salvarDados(personagens, personagensAtuais);

    await interaction.editReply({
        content: `O personagem atual selecionado é ${personagemEscolhido}.`,
        ephemeral: true,
    });
};

export default escolherPersonagem;
