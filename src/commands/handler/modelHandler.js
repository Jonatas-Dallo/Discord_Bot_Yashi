import salvarDados from '../../utils/salvarDados.js';

export const modalHandler = async (interaction, personagens, personagensAtuais) => {
    if (interaction.customId === 'personagem_formulario') {
        const nome = interaction.fields.getTextInputValue('nome');
        const URL = interaction.fields.getTextInputValue('URL');
        const aparencia = interaction.fields.getTextInputValue('aparencia');
        const personalidade = interaction.fields.getTextInputValue('personalidade');
        const historia = interaction.fields.getTextInputValue('historia');

        if (!personagens.has(interaction.user.id)) {
            personagens.set(interaction.user.id, []);
        }
        personagens.get(interaction.user.id).push({ nome, URL, aparencia, personalidade, historia });

        salvarDados(personagens, personagensAtuais);
        await interaction.reply({ content: 'Personagem criado com sucesso.', ephemeral: true });
    }
};

export default modalHandler;