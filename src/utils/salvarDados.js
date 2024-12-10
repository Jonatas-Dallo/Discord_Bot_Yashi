import fs from 'fs';

export default function salvarDados(personagens, personagensAtuais) {
    // Função para salvar os dados no arquivo JSON
    const data = {
        personagens: Array.from(personagens.entries()),
        personagensAtuais: Object.fromEntries(personagensAtuais.entries()),
    };

    try {
        fs.writeFileSync('database/database.json', JSON.stringify(data, null, 4));
        console.log('Dados salvos!');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        console.log('Dados salvos!');
    }
}