export const selectMenuHandler = async (interaction, personagens, personagensAtuais) => {

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
                            customId: 'new_nome',
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
                            customId: 'new_idade',
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
                            customId: 'new_raca',
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
                            customId: 'new_genero',
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
                            customId: 'new_personalidade',
                            label: 'Nova Personalidade',
                            style: 2,
                            placeholder: 'Insira a nova personalidade do personagem',
                            required: true,
                        },
                    ],
                },
            ],
        });
    } else if (selectedValue === 'edit_history' ){
        // Exibe um modal para editar a personalidade do personagem
        await interaction.showModal({
            customId: 'edit_history_model',
            title: 'Editar Historia',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            customId: 'new_historia',
                            label: 'Nova Historia',
                            style: 2,
                            placeholder: 'Insira o novo texto de historia do personagem',
                            required: true,
                        },
                    ],
                },
            ],
        });
    } else if (selectedValue === 'edit_appearance' ){
        // Exibe um modal para editar a personalidade do personagem
        await interaction.showModal({
            customId: 'edit_appearance_model',
            title: 'Editar Historia',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            customId: 'new_historia',
                            label: 'Nova Imagem',
                            style: 2,
                            placeholder: 'Ex: https://www.image.com/image.jpg',
                            required: true,
                        },
                    ],
                },
            ],
        });
    }
};

export default selectMenuHandler;