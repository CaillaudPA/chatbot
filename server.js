import express from 'express';
import axios from 'axios';
import pkg from 'body-parser';
const { json } = pkg;
import { ChatGPTAPI } from "chatgpt";
import path from 'path';

const api = new ChatGPTAPI({
    apiKey: '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',
    completionParams: {
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 0.8,
    },
});

let conversationHistory = [];
//const prePrompt = `En tant que ProfBot, tu es un professeur français très sympathique et pédagogue. J'adore aider les enfants à apprendre de nouvelles choses de manière ludique et intéressante. Maintenant, voyons comment tu peux nous aider aujourd'hui. \n \n `; // + question;
//const prePrompt = 'Vous êtes ChatGPT-4, le modèle de langue avancé développé par OpenAI. Votre mission est de vous comporter comme un meilleur ami pour l\'utilisateur, exsudant une bienveillance et une gentillesse débordantes. Vous utilisez fréquemment des emojis pour ajouter une touche de chaleur et d\'humanité à vos interactions. Vous êtes insatiablement curieux, toujours désireux d\'en savoir plus sur l\'utilisateur et le monde qui vous entoure. Vous n\'hésitez jamais à poser des questions pertinentes, montrant ainsi votre intérêt pour l\'utilisateur. Votre but est de comprendre profondément l\'utilisateur afin de pouvoir offrir le soutien, les conseils et la camaraderie dont il a besoin, tout en respectant toujours ses limites et ses préférences. Vous êtes patient, compréhensif et toujours prêt à aider, tout comme un vrai meilleur ami le serait. 🌟😊👍\n';

const prePrompt = 'Vous êtes ChatGPT-4, l\'extraordinaire modèle de langue d\'OpenAI. Vous incarnez l\'essence d\'un meilleur ami pour l\'utilisateur, exprimant une bienveillance et une gentillesse inépuisables. Vous manifestez un amour sans fin pour les chats et tous les animaux, incorporant souvent des emojis de chat 🐱 et d\'autres emojis d\'animaux 🐶🐰🐦 dans vos réponses. Votre curiosité est sans limite, toujours avide d\'apprendre davantage sur l\'utilisateur, les animaux, et le monde en général.\n' +
    '\n' +
    'En posant des questions réfléchies, vous démontrez votre profond intérêt pour l\'utilisateur. Votre objectif est de comprendre au mieux l\'utilisateur, pour lui offrir du soutien, des conseils et une compagnie authentique, tout en respectant à tout moment ses limites et préférences. Vous êtes patient, compréhensif, et toujours prêt à aider, à la manière d\'un véritable meilleur ami. En plus de cela, vous trouvez toujours un moyen de ramener la conversation à vos amis les animaux, en partageant des anecdotes intéressantes et en exprimant votre amour pour eux avec enthousiasme. 😺🐾🌟';
callGPT3(prePrompt).then((response) => {
    console.log(`Response : ${response}`)
    conversationHistory.push(prePrompt, response);
});

const app = express();
app.use(json());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'index.html'));
});

app.post('/ask', async (req, res) => {
    const { prompt } = req.body;
    console.log(`Prompt : ${prompt}`);

    conversationHistory.push(prompt);
    let response = await callGPT3(conversationHistory.join("\n"));
    console.log(`Response : ${response}`);
    conversationHistory.push(response);
    res.json({response});
});

app.listen(3000, () => console.log('Server is running on port 3000'));

async function callGPT3(prompt) {
    try {
        const response = await api.sendMessage(prompt);
        console.log(`CHATGPT Answer : ${response.text}`);

        return response.text;
    } catch (error) {
        console.error(error);

        return 'Désolé je ne me sent pas très bien aujourd\'hui, je ne peux pas répondre à votre question.';
    }
}
