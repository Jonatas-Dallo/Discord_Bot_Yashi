export const autocomplete = async (interaction, personagens, personagensAtuais) => {
    if (!interaction.isAutocomplete()) return;

    const { commandName, user } = interaction;

    const listaPersonagens = personagens.get(user.id) || [];
    const sugestões = listaPersonagens.map((p) => ({ name: p.nome, value: p.nome }));

    await interaction.respond(sugestões.slice(0, 25));
};

export default autocomplete;