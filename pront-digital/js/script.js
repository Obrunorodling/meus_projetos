document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.app-nav button');
    const menuIcon = document.getElementById('menuIcon');
    const nav = document.getElementById('navegacao-prontuario');
    const sections = document.querySelectorAll('section');

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

    // Função de exemplo para salvar o prontuário (você precisará implementar a lógica real)
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
});