const aba_noticias = document.getElementsByClassName("noticias")[0];
const aba_home = document.getElementsByClassName("home")[0];

const btn_home = document.getElementById("btn_home");
const btn_noticias = document.getElementById("btn_noticias");

btn_home.addEventListener('click', () => {
    aba_home.style.display = "flex";
    aba_noticias.style.display = "none";
});

btn_noticias.addEventListener('click', () => {
    aba_home.style.display = "none";
    aba_noticias.style.display = "flex";
    carregarNoticias();
});

// Função que busca e exibe as notícias
async function carregarNoticias() {
  try {
    const response = await fetch('https://77vcxw-3000.csb.app/noticias');
    console.log(response.data)
    if (!response.ok) throw new Error('Erro ao buscar notícias');
    const noticias = await response.json();

    // Limpa o conteúdo anterior
    aba_noticias.innerHTML = '';

    // Cria e adiciona um card para cada notícia
    Object.keys(noticias).forEach(key => {
      const noticia = noticias[key];

      const card = document.createElement('div');
      card.className = 'noticiaCard';

      const texto = document.createElement('div');
      texto.className = 'noticiaTexto';

      const titulo = document.createElement('h3');
      titulo.textContent = `Notícia ${key}`;

      const resumo = document.createElement('p');
      resumo.textContent = noticia.resumo;

      const fonte = document.createElement('a');
      fonte.href = noticia.fontes;
      fonte.target = '_blank';
      fonte.textContent = 'Fonte';

      texto.appendChild(titulo);
      texto.appendChild(resumo);
      texto.appendChild(fonte);

      const img = document.createElement('img');
      img.className = 'noticiaImagem';
      img.src = noticia.img;
      img.alt = `Imagem da notícia ${key}`;

      card.appendChild(texto);
      card.appendChild(img);

      aba_noticias.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar notícias:', error);
    aba_noticias.innerHTML = '<p>Erro ao carregar notícias.</p>';
  }
}

// Carrega as notícias se já estiver na aba de notícias ao abrir a página
if (aba_noticias.style.display !== 'none') {
  carregarNoticias();
}
