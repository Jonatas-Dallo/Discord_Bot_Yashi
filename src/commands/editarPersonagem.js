import salvarDados from '../utils/salvarDados.js';  // Importe a função de salvar dados se necessário

export const editarPersonagem = async (interaction, personagens, personagensAtuais) => {
    // Identifica o campo que está sendo editado
    const modalIdToField = {
        'edit_name_modal': 'nome',
        'edit_age_modal': 'idade',
        'edit_race_modal': 'raca',
        'edit_gender_modal': 'genero',
        'edit_personality_modal': 'personalidade',
        'edit_history_model': 'historia',
        'edit_appearance_model': 'aparencia'
    };

    // Verifica se o ID do modal corresponde a algum campo de edição
    const campo = modalIdToField[interaction.customId];
    if (!campo) return;

    // Obtém o novo valor do campo
    const novoValor = interaction.fields.getTextInputValue(`new_${campo}`);
    const personagemNome = interaction.message.embeds[0].title;

    // Busca o personagem na lista
    const listaPersonagens = personagens.get(interaction.user.id) || [];
    const personagemIndex = listaPersonagens.findIndex((p) => p.nome === personagemNome);

    if (personagemIndex !== -1) {
        // Atualiza o campo do personagem
        listaPersonagens[personagemIndex][campo] = novoValor;
        personagens.set(interaction.user.id, listaPersonagens);
        salvarDados(personagens, personagensAtuais);
        await interaction.reply({ content: `${campo.charAt(0).toUpperCase() + campo.slice(1)} do personagem atualizado com sucesso!`, ephemeral: true });
    } else {
        await interaction.reply({ content: `Erro ao atualizar o ${campo}. Personagem não encontrado.`, ephemeral: true });
    }
};

export default editarPersonagem;
