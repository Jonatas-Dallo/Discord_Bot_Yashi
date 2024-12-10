import fs from 'fs';

export default function carregarDados(personagens, personagensAtuais) {
    // Função para carregar os dados do arquivo JSON
    try {
        const rawData = fs.readFileSync('database/database.json');
        if (rawData.length === 0) {
            return; // Arquivo vazio, não carregar nada
        }
        const data = JSON.parse(rawData);

        // Certifique-se de que os dados têm os formatos esperados
        if (Array.isArray(data.personagens)) {
            data.personagens.forEach(([key, value]) => personagens.set(key, value));
        }
        if (data.personagensAtuais && typeof data.personagensAtuais === 'object') {
            Object.entries(data.personagensAtuais).forEach(([key, value]) => personagensAtuais.set(key, value));
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}