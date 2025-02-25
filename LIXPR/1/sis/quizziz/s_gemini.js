// Função delay para aguardar um tempo específico (em milissegundos)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Variáveis para armazenar a última pergunta e opções encontradas
let PerguntaJaEncontrada = "";
let OpcoesJaEncontradas = [];
let dizerAvissoDeErro = true;

async function main() {
    let Pergunta = await encontrarPergunta(); // Use await para aguardar a resolução da Promise
    let RespostasE = await encontrarOpcoes(); // Use await para aguardar a resolução da Promise

    if (Pergunta !== null) {
        // Verifica se a pergunta mudou
        if (Pergunta !== PerguntaJaEncontrada) {
            console.log("Nova pergunta encontrada:", Pergunta);
            PerguntaJaEncontrada = Pergunta; // Atualiza a última pergunta encontrada
            dizerAvissoDeErro = true;

            if (RespostasE.length > 0) {
                console.log("Opções de resposta:");
                RespostasE.forEach(opcao => console.log(opcao));
                await obterRespostaIA(Pergunta, RespostasE);  // Aguardar a resposta antes de continuar
            }
        } else {
            if (dizerAvissoDeErro === true) {
                console.log("ERRO: MesmaPergunta");
                dizerAvissoDeErro = false;
            }
        }
    } else {
		alert("ERRO: Pergunta Não Encontrada!");
	}
}

async function obterRespostaIA(pergunta, opcoes) {
    let prompt = `
    Leia a seguinte pergunta e selecione a alternativa correta entre as opções dadas:

    **Pergunta:** ${pergunta}

    **Opções:**
    ${opcoes.map((opcao, index) => `${String.fromCharCode(65 + index)}) ${opcao}`).join("\n")}

    **IMPORTANTE:**  
    - Responda apenas com uma das opções fornecidas (A, B, C, etc.). 
    - O **formato da resposta deve seguir rigorosamente o seguinte modelo** (NÃO ESCREVA MAIS NADA, APENAS ISSO):  

      Resposta: X.  

    Onde **X** é a letra correspondente à resposta correta.
    `;

    try {
        // Aguardar antes de fazer a requisição
        await delay(7000);

        const apiKey = "AIzaSyBNmPecFvMENSk8_-Z_30YzBUUi7yL-h_U"; // Substitua com sua chave de API do Gemini

        // A requisição para o Gemini
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            alert('Erro: Aconteceu algum erro com a I.A!');
            if (response.status === 429) {
                console.log('Erro 429: Tentando novamente após 20 segundos...');
                await delay(20000);  // Espera 20 segundos antes de tentar novamente
                return obterRespostaIA(pergunta, opcoes);  // Reenvia a requisição
            }
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('Resposta inesperada da API: ' + JSON.stringify(data));
        }

        // Extrair o texto da resposta
        const respostaTexto = data.candidates[0].content.parts[0].text.trim();
        const respostaMatch = respostaTexto.match(/Resposta: ([A-Z])\./);

        if (!respostaMatch) {
            throw new Error("Formato de resposta inesperado da IA.");
        }

        const respostaLetra = respostaMatch[1]; // Exemplo: "A"
        console.log("Resposta da IA:", respostaLetra);

        destacarResposta(respostaLetra);  // Destaca a resposta correta na interface

    } catch (error) {
        console.error('Erro ao obter análise da IA:', error);
    }
}


function destacarResposta(letra) {
    let botoes = document.querySelectorAll(".options-grid button");

    botoes.forEach((botao, index) => {
        let textoOpcaoEl = botao.querySelector(".resizeable");

        if (!textoOpcaoEl) return; // Evita erro caso o elemento não exista

        let textoOpcao = textoOpcaoEl.innerText.trim();
        let letraOpcao = String.fromCharCode(65 + index); // Converte índice (0=A, 1=B, etc.)

        if (letraOpcao === letra) {
            // Estilo para a opção correta
            botao.style.backgroundColor = "lightgreen"; // Cor de fundo
            botao.style.border = "3px solid green"; // Borda mais espessa
            botao.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.5)"; // Adiciona sombra verde
            botao.style.transform = "scale(1.05)"; // Levemente aumenta o botão
            botao.style.transition = "all 0.3s ease"; // Transição suave
        } else {
            // Reseta o estilo para as outras opções
            botao.style.backgroundColor = "";
            botao.style.border = "";
            botao.style.boxShadow = "";
            botao.style.transform = "";
        }
    });
}


function encontrarPergunta() {
    // Tentar localizar o contêiner da pergunta usando um seletor mais flexível
    let perguntaEl = document.querySelector(".question-text-color, .resizeable-text"); // Ajuste o seletor conforme necessário

    if (perguntaEl) {
        let textoPergunta = '';

        // Selecionar todos os elementos de texto dentro do contêiner
        let elementosTexto = perguntaEl.querySelectorAll("p, div"); // Pegando todos os parágrafos e divs dentro do contêiner

        // Concatenar o texto de todos os elementos encontrados
        elementosTexto.forEach(elemento => {
            let texto = elemento.innerText.trim();
            if (texto && !textoPergunta.includes(texto)) { // Evita adicionar texto repetido
                textoPergunta += texto + " "; // Adiciona um espaço entre as partes
            }
        });

        // Remove espaços extras antes de retornar
        return textoPergunta.trim() || null;
    }

    return null; // Retorna null se não encontrar pergunta
}




function encontrarOpcoes() {
    let opcoesEl = document.querySelectorAll(".options-grid button"); // Seleciona todas as opções
    let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]; // Lista para rotular as respostas
    let opcoes = [];

    opcoesEl.forEach((opcao, index) => {
        let textoOpcaoEl = opcao.querySelector(".resizeable");
        if (textoOpcaoEl) {
            let textoOpcao = textoOpcaoEl.innerText.trim();
            if (textoOpcao) {
                opcoes.push(`${letras[index]}) ${textoOpcao}`);
            }
        }
    });

    return opcoes;
}

// Executa a função a cada 2 segundos
async function mainLoop() {
    await main();

}

mainLoop();
