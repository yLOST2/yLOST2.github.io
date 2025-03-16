(function() {
    // Variável de controle
    let isConsoleOpen = false;

    // Função para detectar se o console está aberto
    const detectConsole = () => {
        const devtools = /./;
        devtools.toString = function() {
            // Quando o console for aberto, isso será chamado
            if (!isConsoleOpen) {
                isConsoleOpen = true;
                pausePage();
            }
        };
        console.log(devtools);
    };

    // Função para pausar a página (desabilitar interações)
    const pausePage = () => {
        document.body.style.pointerEvents = 'none'; // Desabilita interações
        document.body.style.overflow = 'hidden'; // Desabilita o scroll
        alert('Console de desenvolvedor detectado! A página foi pausada.');
    };

    // Função para retomar a interação com a página
    const resumePage = () => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
    };

    // Detecta se o console foi aberto ao carregar a página
    detectConsole();

    // Detecção contínua (a cada 500ms)
    setInterval(detectConsole, 500);

    // Bloqueio de teclas para abrir o console
    const blockedKeys = [
        'F12', 'I', 'U', 'S', // teclas comuns
        'F1', 'F2', 'F3', 'F4', // F1 a F4
        'Escape', // Escape
        'Shift', // Shift + outros
        'Ctrl' // Ctrl + outros
    ];

    document.addEventListener('keydown', function(e) {
        // Bloqueia as teclas de desenvolvedor
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||  // CTRL + SHIFT + I
            (e.ctrlKey && e.key === 'U') ||  // CTRL + U
            (e.ctrlKey && e.key === 'S') ||  // CTRL + S
            e.key === 'Escape' ||  // Escape
            e.key === 'F1' ||  // F1
            e.key === 'F2' ||  // F2
            e.key === 'F3' ||  // F3
            e.key === 'F4'  // F4
        ) {
            e.preventDefault();  // Bloqueia a tecla
        }
    });
})();
