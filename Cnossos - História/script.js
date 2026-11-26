
// LOCALIZA TODAS AS CAIXAS DE IMAGEM
const visualizadores = document.querySelectorAll(".imagens");


// PASSA POR CADA CAIXA
visualizadores.forEach((visualizador) => {

    // LOCALIZA A IMAGEM DENTRO DA CAIXA ATUAL
    const imagem = visualizador.querySelector(".imagemArrastavel");

    // VERIFICA SE EXISTE UMA IMAGEM NESSA CAIXA
    if (!imagem) return;


    // VARIÁVEIS DE CONTROLE

    let zoom = 1;
    let arrastando = false;

    let inicioX = 0;
    let inicioY = 0;

    // Lê as posições iniciais definidas no HTML
    let posX = Number(imagem.dataset.x) || 0;
    let posY = Number(imagem.dataset.y) || 0;

    // Guarda as posições iniciais
    const posicaoInicialX = posX;
    const posicaoInicialY = posY;


    // FUNÇÃO QUE ATUALIZA A IMAGEM

    function atualizarImagem() {

        // Verifica se a imagem terminou de carregar
        if (!imagem.naturalWidth) return;

        // Pega as dimensões originais da fotografia
        const larguraOriginal = imagem.naturalWidth;
        const alturaOriginal = imagem.naturalHeight;

        // Pega as dimensões da caixa atual
        const larguraCaixa = visualizador.clientWidth;
        const alturaCaixa = visualizador.clientHeight;

        // Calcula a escala necessária para preencher a caixa
        const escalaCover = Math.max(
            larguraCaixa / larguraOriginal,
            alturaCaixa / alturaOriginal
        );

        // Calcula as dimensões da imagem depois do cover
        const larguraImagem = larguraOriginal * escalaCover;
        const alturaImagem = alturaOriginal * escalaCover;

        // Define o tamanho da imagem no CSS
        imagem.style.width = `${larguraImagem}px`;
        imagem.style.height = `${alturaImagem}px`;

        // Calcula os limites do movimento considerando o zoom
        const limiteX = Math.max(
            0,
            (larguraImagem * zoom - larguraCaixa) / 2
        );

        const limiteY = Math.max(
            0,
            (alturaImagem * zoom - alturaCaixa) / 2
        );

        // Aplica a posição inicial sem permitir espaços vazios
        posX = Math.max(
            -limiteX,
            Math.min(posicaoInicialX, limiteX)
        );

        // Aplica a posição vertical inicial
        posY = Math.max(
        -limiteY,
        Math.min(posicaoInicialY, limiteY)
        );

        // Aplica centralização, deslocamento e zoom
        imagem.style.transform =
        `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${zoom})`;
    }


    // OBSERVA ALTERAÇÕES NO TAMANHO DA CAIXA

    const observador = new ResizeObserver(() => {

        // Recalcula a imagem quando a caixa muda de tamanho
        atualizarImagem();

    });

    observador.observe(visualizador);


    // EVENTO: QUANDO A IMAGEM TERMINAR DE CARREGAR

    imagem.addEventListener("load", atualizarImagem);

    // Verifica se a imagem já estava carregada
    if (imagem.complete && imagem.naturalWidth) {
        atualizarImagem();
    }


    // EVENTO: INICIA O ARRASTO

    visualizador.addEventListener("mousedown", (e) => {

        // Verifica se a imagem já terminou de carregar
        if (!imagem.complete || !imagem.naturalWidth) return;

        // Informa que o usuário começou a arrastar
        arrastando = true;

        // Guarda a distância entre o mouse e a posição atual
        inicioX = e.clientX - posX;
        inicioY = e.clientY - posY;

        // Altera o cursor
        visualizador.style.cursor = "grabbing";

    });


    // EVENTO: MOVIMENTA A IMAGEM

    document.addEventListener("mousemove", (e) => {

        // Verifica se o usuário está arrastando esta imagem
        if (!arrastando) return;

        // Calcula a nova posição horizontal e vertical
        let novaX = e.clientX - inicioX;
        let novaY = e.clientY - inicioY;

        // Pega as dimensões da caixa atual
        const larguraCaixa = visualizador.clientWidth;
        const alturaCaixa = visualizador.clientHeight;

        // Pega as dimensões originais da fotografia
        const larguraOriginal = imagem.naturalWidth;
        const alturaOriginal = imagem.naturalHeight;

        // Calcula a escala necessária para preencher a caixa
        const escalaCover = Math.max(
            larguraCaixa / larguraOriginal,
            alturaCaixa / alturaOriginal
        );

        // Calcula o tamanho da imagem considerando o zoom
        const larguraImagem = larguraOriginal * escalaCover * zoom;
        const alturaImagem = alturaOriginal * escalaCover * zoom;

        // Calcula até onde a imagem pode se movimentar
        const limiteX = Math.max(
            0,
            (larguraImagem - larguraCaixa) / 2
        );

        const limiteY = Math.max(
            0,
            (alturaImagem - alturaCaixa) / 2
        );

        // Impede que apareçam espaços vazios nas laterais
        posX = Math.max(-limiteX, Math.min(novaX, limiteX));

        // Impede que apareçam espaços vazios em cima e embaixo
        posY = Math.max(-limiteY, Math.min(novaY, limiteY));

        // Atualiza a imagem
        imagem.style.transform =
        `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${zoom})`;

    });


    // EVENTO: FINALIZA O ARRASTO

    document.addEventListener("mouseup", () => {

        // Informa que o usuário soltou o botão
        arrastando = false;

        // Retorna o cursor para a mão aberta
        visualizador.style.cursor = "grab";

    });


    // IMPEDE O ARRASTE NATIVO DO NAVEGADOR

    imagem.addEventListener("dragstart", (e) => {
        e.preventDefault();
    });

});


