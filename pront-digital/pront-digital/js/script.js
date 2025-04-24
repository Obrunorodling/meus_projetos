document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.app-nav button');
    const menuIcon = document.getElementById('menuIcon');
    const nav = document.getElementById('navegacao-prontuario');
    const sections = document.querySelectorAll('section');
    const microphoneButtons = document.querySelectorAll('.microphone-button');
    let recognition = null;
    let isRecording = false;
    let currentInputId = null; // Variável para rastrear o input ativo

    function mostrarTela(telaId) {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(telaId).classList.remove('hidden');
        navButtons.forEach(button => {
            button.classList.remove('ativo');
            if (button.getAttribute('data-tela') === telaId) {
                button.classList.add('ativo');
            }
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const telaId = this.getAttribute('data-tela');
            mostrarTela(telaId);
            if (window.innerWidth <= 320) {
                nav.classList.remove('open');
                menuIcon.classList.remove('open');
            }
        });
    });

    menuIcon.addEventListener('click', () => {
        nav.classList.toggle('open');
        menuIcon.classList.toggle('open');
    });

    mostrarTela('identificacao');

    window.salvarProntuario = function() {
        const dados = {};
        const formulario = document.getElementById('formulario-prontuario');
        const elementos = formulario.querySelectorAll('input, select, textarea');
        elementos.forEach(elemento => {
            if (elemento.id) {
                dados[elemento.id] = elemento.value;
            }
        });
        const dadosSalvosElement = document.getElementById('dados-salvos');
        dadosSalvosElement.textContent = JSON.stringify(dados, null, 2);
        document.getElementById('visualizacao-prontuario').classList.remove('hidden');
    };

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR'; // Define o idioma aqui, para não repetir

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const inputField = document.getElementById(currentInputId);
            if (inputField) {
                inputField.value = transcript;
            }
            stopRecording(); // Não precisa passar o botão aqui, pois rastreamos o estado globalmente
        };

        recognition.onspeechend = function() {
            stopRecording();
        };

        recognition.onerror = function(event) {
            console.error('Erro de reconhecimento de fala:', event.error);
            stopRecording();
            alert('Ocorreu um erro no reconhecimento de fala. Por favor, tente novamente.');
        };
    } else {
        console.warn('A API Web Speech não é suportada neste navegador.');
        microphoneButtons.forEach(button => {
            button.disabled = true;
            button.title = 'Reconhecimento de fala não suportado';
        });
    }

    function startRecording(button) {
        if (recognition && !isRecording) {
            currentInputId = button.getAttribute('data-input');
            recognition.start();
            isRecording = true;
            button.classList.add('recording');
            microphoneButtons.forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('recording'); // Garante que apenas um botão esteja "gravando" visualmente
                }
            });
        }
    }

    function stopRecording() {
        if (recognition && isRecording) {
            recognition.stop();
            isRecording = false;
            microphoneButtons.forEach(btn => {
                btn.classList.remove('recording');
            });
            currentInputId = null; // Limpa o input ativo
        }
    }

    microphoneButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!isRecording) {
                startRecording(this);
            } else if (this.classList.contains('recording')) {
                stopRecording();
            } else {
                stopRecording(); // Interrompe qualquer outra gravação antes de iniciar uma nova
                startRecording(this);
            }
        });
    });
});