// script.js

document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.app-nav button');
    const sections = document.querySelectorAll('main section, #visualizacao-prontuario');
    const menuIcon = document.getElementById('menuIcon');
    const appNav = document.getElementById('navegacao-prontuario');
    const nextButtons = document.querySelectorAll('.next-button');
    const editarProntuarioButton = document.getElementById('editar-prontuario');
    const formProntuario = document.getElementById('formulario-prontuario');
    const dadosSalvosPre = document.getElementById('dados-salvos');
    const microphoneButtons = document.querySelectorAll('.microphone-button');

    // Elementos da nova seção de recuperação
    const cpfRecuperacaoInput = document.getElementById('cpf-recuperacao');
    const buscarProntuarioButton = document.getElementById('buscar-prontuario');
    const dadosPacienteRecuperadosPre = document.getElementById('dados-paciente-recuperados');

    // Variável para armazenar o prontuário atual em edição (se houver)
    let prontuarioAtual = {};

    // Função para mostrar a seção correta e atualizar o botão de navegação
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');

        navButtons.forEach(button => {
            button.classList.remove('ativo');
            if (button.dataset.tela === sectionId) {
                button.classList.add('ativo');
            }
        });
        // Esconder o formulário se estiver na visualização ou recuperação
        if (sectionId === 'visualizacao-prontuario' || sectionId === 'recuperacao') {
            formProntuario.classList.add('hidden-form');
        } else {
            formProntuario.classList.remove('hidden-form');
        }
    }

    // Lógica para navegação entre as seções
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.tela;
            showSection(targetSection);
        });
    });

    // Lógica para botões "Avançar"
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextSectionId = button.dataset.next;
            showSection(nextSectionId);
        });
    });

    // Lógica para o menu hamburguer
    menuIcon.addEventListener('click', () => {
        appNav.classList.toggle('active');
    });

    // Lógica para botões de microfone (Speech Recognition)
    microphoneButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetInputId = button.dataset.input;
            const targetInput = document.getElementById(targetInputId);

            if ('webkitSpeechRecognition' in window) {
                const recognition = new webkitSpeechRecognition();
                recognition.lang = 'pt-BR';
                recognition.continuous = false;
                recognition.interimResults = false;

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (targetInput.tagName === 'SELECT') {
                        // Para select, tente encontrar a opção correspondente
                        const options = Array.from(targetInput.options).map(opt => opt.value.toLowerCase());
                        const matchedOption = options.find(option => transcript.toLowerCase().includes(option));
                        if (matchedOption) {
                            targetInput.value = matchedOption;
                        } else {
                            alert('Opção de sexo não reconhecida. Por favor, selecione manualmente.');
                        }
                    } else {
                        targetInput.value = transcript;
                    }
                };

                recognition.onerror = (event) => {
                    console.error('Erro no reconhecimento de fala:', event.error);
                    alert('Erro no reconhecimento de fala. Tente novamente.');
                };

                recognition.start();
            } else {
                alert('Seu navegador não suporta a API de Reconhecimento de Fala. Por favor, use um navegador como Google Chrome.');
            }
        });
    });

    // Função para salvar o prontuário
    window.salvarProntuario = () => {
        const prontuario = {
            identificacao: {
                nome: document.getElementById('nome').value,
                dataNascimento: document.getElementById('data-nascimento').value,
                sexo: document.getElementById('sexo').value,
                cpf: document.getElementById('cpf').value,
                telefone: document.getElementById('telefone').value
            },
            historico: {
                queixaPrincipal: document.getElementById('queixa-principal').value,
                historiaDoencaAtual: document.getElementById('historia-doenca-atual').value,
                historicoMedicoPregressa: document.getElementById('historico-medico-pregressa').value,
                historicoFamiliar: document.getElementById('historico-familiar').value,
                medicamentosEmUso: document.getElementById('medicamentos-em-uso').value,
                alergias: document.getElementById('alergias').value
            },
            exameFisico: {
                pressaoArterial: document.getElementById('pressao-arterial').value,
                frequenciaCardiaca: document.getElementById('frequencia-cardiaca').value,
                temperatura: document.getElementById('temperatura').value,
                observacoesExameFisico: document.getElementById('observacoes-exame-fisico').value
            },
            diagnostico: {
                hipotesesDiagnosticas: document.getElementById('hipoteses-diagnosticas').value,
                diagnosticoDefinitivo: document.getElementById('diagnostico-definitivo').value
            },
            tratamento: {
                prescricao: document.getElementById('prescricao').value,
                orientacoes: document.getElementById('orientacoes').value
            }
        };

        // Salva o prontuário no localStorage usando o CPF como chave (para simulação)
        const cpfPaciente = prontuario.identificacao.cpf;
        if (cpfPaciente) {
            localStorage.setItem(`prontuario_${cpfPaciente}`, JSON.stringify(prontuario));
            alert('Prontuário salvo com sucesso!');
            dadosSalvosPre.textContent = JSON.stringify(prontuario, null, 2);
            showSection('visualizacao-prontuario');
        } else {
            alert('Por favor, preencha o CPF do paciente para salvar o prontuário.');
        }
    };

    // Função para editar o prontuário (volta para a primeira tela de identificação)
    editarProntuarioButton.addEventListener('click', () => {
        showSection('identificacao');
    });

    // Lógica para buscar prontuário por CPF
    buscarProntuarioButton.addEventListener('click', () => {
        const cpfParaBuscar = cpfRecuperacaoInput.value.trim();
        if (cpfParaBuscar) {
            const prontuarioSalvo = localStorage.getItem(`prontuario_${cpfParaBuscar}`);
            if (prontuarioSalvo) {
                const dados = JSON.parse(prontuarioSalvo);
                dadosPacienteRecuperadosPre.textContent = JSON.stringify(dados, null, 2);
                // Opcional: preencher o formulário com os dados recuperados para edição
                // fillFormWithData(dados); // Você pode criar esta função
            } else {
                dadosPacienteRecuperadosPre.textContent = 'Nenhum prontuário encontrado para este CPF.';
            }
        } else {
            dadosPacienteRecuperadosPre.textContent = 'Por favor, digite um CPF para buscar.';
        }
    });

    // Inicializa a primeira seção
    showSection('identificacao');
});