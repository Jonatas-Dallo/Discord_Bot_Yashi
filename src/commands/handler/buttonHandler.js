export const buttonHandler = async (interaction) => {
    if (interaction.customId === 'appearance') {
        await interaction.reply({ content: 'Detalhes sobre a aparência do personagem...', ephemeral: true });
    } else if (interaction.customId === 'backstory') {
        await interaction.reply({ content: 'História do personagem...', ephemeral: true });
    } else if (interaction.customId === 'personality') {
        await interaction.reply({ content: 'Personalidade do personagem...', ephemeral: true });
    }
};

export default buttonHandler;