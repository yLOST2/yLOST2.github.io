(function () {
  const TIMEOUT_MS = 2000;
  let isBot = false;

  if (sessionStorage.getItem('botChecked') === 'true') return;
  sessionStorage.setItem('botChecked', 'true');

  if (navigator.webdriver) {
    isBot = true;
    console.warn('[AVISO] Headless detectado: navigator.webdriver = true');
  }

  if (!navigator.plugins || navigator.plugins.length === 0) {
    isBot = true;
    console.warn('[AVISO] Nenhum plugin encontrado');
  }

  if (!navigator.languages || navigator.languages.length === 0) {
    isBot = true;
    console.warn('[AVISO] navigator.languages vazio');
  }

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillText('🕵️‍♂️', 2, 10);
    const data = canvas.toDataURL();
    if (!data || data.length < 50) {
      isBot = true;
      console.warn('[AVISO] Canvas inválido ou bloqueado');
    }
  } catch {
    isBot = true;
    console.warn('[AVISO] Canvas falhou');
  }

  try {
    if (window.top !== window.self) {
      isBot = true;
      console.warn('[AVISO] Página em iframe suspeito');
    }
  } catch {
    isBot = true;
    console.warn('[AVISO] Erro ao acessar top-level window');
  }

  setTimeout(() => {
    if (isBot) {
      alert('⚠️ POSSÍVEL BOT DETECTADO! Se for um erro, contate-nos.');
      window.location.href = 'back:about';
    }
  }, TIMEOUT_MS);
})();
