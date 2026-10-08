let movimentacoes = [];

let graficoGastos;
let graficoReceitasDespesas;
let graficoSaldo;
let graficoInvestimento;


// LOCAL STORAGE

function salvarMovimentacoes() {

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );
}


function carregarMovimentacoes() {

    const dados = localStorage.getItem("movimentacoes");

    if (dados) {
        movimentacoes = JSON.parse(dados);
    }
}


// ADICIONAR MOVIMENTAÇÃO

function adicionarMovimentacao() {

    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("categoria").value;

    if (!descricao || isNaN(valor) || !tipo || !categoria) {

        alert("Por favor, preencha todos os campos corretamente.");

        return;
    }


    const movimentacao = {
        descricao,
        valor,
        tipo,
        categoria
    };


    movimentacoes.push(movimentacao);

    salvarMovimentacoes();

    atualizarListaMovimentacoes();
    atualizarUltimasMovimentacoes();
    atualizarDashboard();
    criarGraficos();
}


// LISTA DE MOVIMENTAÇÕES

function atualizarListaMovimentacoes() {

    const lista = document.getElementById("listaMovimentacoes");

    if (!lista) {
        return;
    }


    lista.innerHTML = "";


    if (movimentacoes.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma movimentação cadastrada.</p>";

        return;
    }


    movimentacoes.forEach((mov, index) => {

        const item = document.createElement("div");

        const tipoTexto =
            mov.tipo === "receita"
                ? "↑ Receita"
                : "↓ Despesa";


        item.className =
            `movimentacao ${mov.tipo}`;


        item.innerHTML = `

            <h3 class="texto_centralizado">
                ${mov.descricao}
            </h3>

            <p class="valor_centralizado">
                R$ ${mov.valor.toFixed(2)}
            </p>

            <br>

            <p class="texto_centralizado">
                <strong>${tipoTexto}</strong>: ${mov.categoria}
            </p>

            <div class="buttons center">

                <button
                    class="btn limpar"
                    onclick="removerMovimentacao(${index})"
                >
                    Remover
                </button>

            </div>

        `;


        lista.appendChild(item);

    });
}


// REMOVER MOVIMENTAÇÃO

function removerMovimentacao(index) {

    movimentacoes.splice(index, 1);

    salvarMovimentacoes();

    atualizarListaMovimentacoes();
    atualizarUltimasMovimentacoes();
    atualizarDashboard();
    criarGraficos();
}


// LIMPAR TODAS AS MOVIMENTAÇÕES

function limparMovimentacoes() {

    movimentacoes = [];

    salvarMovimentacoes();

    atualizarListaMovimentacoes();
    atualizarUltimasMovimentacoes();
    atualizarDashboard();
    criarGraficos();
}


// DASHBOARD

function atualizarDashboard(dados = movimentacoes) {

    const printRenda =
        document.getElementById("print_renda");

    const printGastos =
        document.getElementById("print_gastos");

    const printSaldo =
        document.getElementById("print_saldo");

    const printInvestimento =
        document.getElementById("print_investimento");


    // Evita erro nas páginas que não possuem os cards
    if (
        !printRenda &&
        !printGastos &&
        !printSaldo &&
        !printInvestimento
    ) {
        return;
    }


    let renda = 0;
    let gastos = 0;


    dados.forEach(function(mov) {

        if (mov.tipo === "receita") {
            renda += mov.valor;
        }


        if (mov.tipo === "despesa") {
            gastos += mov.valor;
        }

    });


    const saldoRestante =
        renda - gastos;


    const investimento =
        saldoRestante / 2;


    if (printRenda) {

        printRenda.innerHTML =
            "R$ " + renda.toFixed(2);

    }


    if (printGastos) {

        printGastos.innerHTML =
            "R$ " + gastos.toFixed(2);

    }


    if (printSaldo) {

        printSaldo.innerHTML =
            "R$ " + saldoRestante.toFixed(2);

    }


    if (printInvestimento) {

        printInvestimento.innerHTML =
            "R$ " + investimento.toFixed(2);

    }

}


// ÚLTIMAS MOVIMENTAÇÕES

function atualizarUltimasMovimentacoes(
    dados = movimentacoes
) {

    const lista =
        document.getElementById("ultimasMovimentacoes");


    if (!lista) {
        return;
    }


    lista.innerHTML = "";


    const ultimas =
        dados.slice(-5).reverse();


    if (ultimas.length === 0) {

        lista.innerHTML =
            "<p>Nenhuma movimentação cadastrada.</p>";

        return;
    }


    ultimas.forEach((mov) => {

        const item =
            document.createElement("div");


        const tipoTexto =
            mov.tipo === "receita"
                ? "↑ Receita"
                : "↓ Despesa";


        item.className =
            `movimentacao ${mov.tipo}`;


        item.innerHTML = `

            <h3 class="texto_centralizado">
                ${mov.descricao}
            </h3>

            <p class="valor_centralizado">
                R$ ${mov.valor.toFixed(2)}
            </p>

            <p class="texto_centralizado">
                <strong>${tipoTexto}</strong>: ${mov.categoria}
            </p>

        `;


        lista.appendChild(item);

    });

}


// SIMULADOR DE INVESTIMENTO

function calcularInvestimento() {

    const valorInicial = parseFloat(
        document.getElementById("valorInicial").value
    );


    const aporteMensal = parseFloat(
        document.getElementById("aporteMensal").value
    );


    const taxaAnual = parseFloat(
        document.getElementById("taxaAnual").value
    );


    const anos = parseInt(
        document.getElementById("periodo").value
    );


    if (
        isNaN(valorInicial) ||
        isNaN(aporteMensal) ||
        isNaN(taxaAnual) ||
        isNaN(anos)
    ) {

        alert(
            "Preencha todos os campos corretamente."
        );

        return;
    }


    if (
        valorInicial < 0 ||
        aporteMensal < 0 ||
        taxaAnual < 0 ||
        anos <= 0
    ) {

        alert("Digite valores válidos.");

        return;
    }


    const taxaMensal =
        Math.pow(
            1 + taxaAnual / 100,
            1 / 12
        ) - 1;


    const meses =
        anos * 12;


    let saldo =
        valorInicial;


    let historico = [];

    historico.push(saldo);


    for (let i = 0; i < meses; i++) {

        saldo =
            saldo * (1 + taxaMensal);

        saldo += aporteMensal;

        historico.push(saldo);

    }


    const valorInvestido =
        valorInicial +
        (aporteMensal * meses);


    const rendimentos =
        saldo - valorInvestido;


    const valorInvestidoElemento =
        document.getElementById("valorInvestido");


    const rendimentosElemento =
        document.getElementById("rendimentos");


    const valorFinalElemento =
        document.getElementById("valorFinal");


    if (valorInvestidoElemento) {

        valorInvestidoElemento.textContent =
            formatarMoeda(valorInvestido);

    }


    if (rendimentosElemento) {

        rendimentosElemento.textContent =
            formatarMoeda(rendimentos);

    }


    if (valorFinalElemento) {

        valorFinalElemento.textContent =
            formatarMoeda(saldo);

    }


    let labels = [];


    for (let i = 0; i <= meses; i++) {

        labels.push("Mês " + i);

    }


    criarGraficoInvestimento(
        labels,
        historico
    );

}


// FORMATAÇÃO DE MOEDA

function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// GRÁFICO DO SIMULADOR

function criarGraficoInvestimento(
    labels,
    dados
) {

    const canvas =
        document.getElementById(
            "graficoInvestimento"
        );


    if (!canvas) {
        return;
    }


    if (graficoInvestimento) {

        graficoInvestimento.destroy();

    }


    graficoInvestimento =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label:
                        "Crescimento do investimento",

                    data: dados,

                    borderColor: "#22c55e",

                    backgroundColor:
                        "rgba(34,197,94,0.2)",

                    tension: 0.3,

                    fill: true

                }]

            },


            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: true

                    }

                },


                scales: {

                    y: {

                        ticks: {

                            callback: function(value) {

                                return (
                                    "R$ " +
                                    value.toLocaleString(
                                        "pt-BR"
                                    )
                                );

                            }

                        }

                    }

                }

            }

        });

}


// CRIAR OS 3 GRÁFICOS DO DASHBOARD

function criarGraficos(
    dados = movimentacoes
) {

    criarGraficoGastos(dados);

    criarGraficoReceitasDespesas(dados);

    criarGraficoSaldo(dados);

}


// GRÁFICO - DISTRIBUIÇÃO DE GASTOS

function criarGraficoGastos(
    dados = movimentacoes
) {

    const canvas =
        document.getElementById(
            "graficoGastos"
        );


    if (!canvas) {
        return;
    }


    const gastosPorCategoria = {};


    dados.forEach(function(mov) {

        if (mov.tipo === "despesa") {

            if (
                !gastosPorCategoria[mov.categoria]
            ) {

                gastosPorCategoria[mov.categoria] =
                    0;

            }


            gastosPorCategoria[mov.categoria] +=
                mov.valor;

        }

    });


    const categorias =
        Object.keys(
            gastosPorCategoria
        );


    const valores =
        Object.values(
            gastosPorCategoria
        );


    if (graficoGastos) {

        graficoGastos.destroy();

    }


    graficoGastos =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: categorias,

                datasets: [{

                    label: "Gastos",

                    data: valores

                }]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "right"

                    }

                }

            }

        });

}


// GRÁFICO - RECEITAS X DESPESAS

function criarGraficoReceitasDespesas(
    dados = movimentacoes
) {

    const canvas =
        document.getElementById(
            "graficoReceitasDespesas"
        );


    if (!canvas) {
        return;
    }


    let receitas = 0;
    let despesas = 0;


    dados.forEach(function(mov) {

        if (mov.tipo === "receita") {

            receitas += mov.valor;

        }


        if (mov.tipo === "despesa") {

            despesas += mov.valor;

        }

    });


    if (graficoReceitasDespesas) {

        graficoReceitasDespesas.destroy();

    }


    graficoReceitasDespesas =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: [
                    "Receitas",
                    "Despesas"
                ],

                datasets: [{

                    label: "Valor",

                    data: [
                        receitas,
                        despesas
                    ]

                }]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

}


// GRÁFICO - EVOLUÇÃO DO SALDO

function criarGraficoSaldo(
    dados = movimentacoes
) {

    const canvas =
        document.getElementById(
            "graficoSaldo"
        );


    if (!canvas) {
        return;
    }


    let saldo = 0;


    const saldos = [];
    const labels = [];


    dados.forEach(function(mov, index) {

        if (mov.tipo === "receita") {

            saldo += mov.valor;

        }


        if (mov.tipo === "despesa") {

            saldo -= mov.valor;

        }


        saldos.push(saldo);

        labels.push(
            "Mov. " + (index + 1)
        );

    });


    if (graficoSaldo) {

        graficoSaldo.destroy();

    }


    graficoSaldo =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Saldo",

                    data: saldos,

                    tension: 0.3,

                    fill: false

                }]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

}


// MENSAGEM DE ERRO

function mostrarErro(msg) {

    const resultado =
        document.getElementById(
            "resultado"
        );


    if (!resultado) {
        return;
    }


    resultado.innerHTML =
        "<br>" + msg;


    setTimeout(() => {

        resultado.textContent = "";

    }, 10000);

}


// FILTROS DO DASHBOARD

function aplicarFiltros() {

    const elementoCategoria =
        document.getElementById(
            "filtroCategoria"
        );


    const elementoTipo =
        document.getElementById(
            "filtroTipo"
        );


    if (
        !elementoCategoria ||
        !elementoTipo
    ) {
        return;
    }


    const categoria =
        elementoCategoria.value;


    const tipo =
        elementoTipo.value;


    const movimentacoesFiltradas =
        movimentacoes.filter(function(mov) {

            const categoriaValida =
                categoria === "todas" ||
                mov.categoria === categoria;


            const tipoValido =
                tipo === "todos" ||
                mov.tipo === tipo;


            return (
                categoriaValida &&
                tipoValido
            );

        });


    // Atualiza os cards
    atualizarDashboard(
        movimentacoesFiltradas
    );


    // Atualiza as últimas movimentações
    atualizarUltimasMovimentacoes(
        movimentacoesFiltradas
    );


    // Atualiza os três gráficos
    criarGraficos(
        movimentacoesFiltradas
    );

}

// Gráfico de Investimento

function resetarInvestimento() {

    localStorage.removeItem("investimento");

    document.getElementById("valorInicial").value = "";
    document.getElementById("aporteMensal").value = "";
    document.getElementById("taxaAnual").value = "";
    document.getElementById("periodo").value = "";

    document.getElementById("valorInvestido").textContent = "R$ 0";
    document.getElementById("rendimentos").textContent = "R$ 0";
    document.getElementById("valorFinal").textContent = "R$ 0";

    if (graficoInvestimento) {
        graficoInvestimento.destroy();
        graficoInvestimento = null;
    }
}


// CARREGAMENTO INICIAL

carregarMovimentacoes();

atualizarListaMovimentacoes();

atualizarDashboard();

atualizarUltimasMovimentacoes();

criarGraficos();



/* ========================================
   EXPORTAÇÃO DO DASHBOARD
======================================== */

/**
 * Prepara uma imagem do Dashboard.
 * O elemento #dashboard contém os indicadores,
 * gráficos e movimentações.
 */
async function capturarDashboard() {
    const dashboard = document.getElementById("dashboard");

    if (!dashboard) {
        throw new Error("Dashboard não encontrado.");
    }

    if (typeof html2canvas === "undefined") {
        throw new Error("A biblioteca html2canvas não foi carregada.");
    }

    await document.fonts.ready;

    // Cria uma cópia exclusiva para exportação.
    const relatorio = dashboard.cloneNode(true);

        /*
    * Copia os desenhos dos gráficos Chart.js
    * para os canvases da versão exportada.
    */

    const canvasesOriginais = dashboard.querySelectorAll("canvas");
    const canvasesCopiados = relatorio.querySelectorAll("canvas");

    canvasesOriginais.forEach((original, indice) => {
        const copia = canvasesCopiados[indice];

        if (!copia) return;

        // Preserva as dimensões originais do canvas.
        copia.width = original.width;
        copia.height = original.height;

        copia.style.width = original.style.width;
        copia.style.height = original.style.height;

        // Copia o gráfico sem deformar sua proporção.
        const contexto = copia.getContext("2d");

        if (contexto) {
            contexto.drawImage(
                original,
                0,
                0,
                original.width,
                original.height
            );
        }
    });

    // Remove filtros e últimas movimentações.
    relatorio.querySelectorAll(".form-section").forEach(secao => {
        secao.remove();
    });

    // Remove botões que possam estar dentro do Dashboard.
    relatorio.querySelectorAll(
        ".buttons, .export-actions, button"
    ).forEach(elemento => {
        elemento.remove();
    });

    // Cria a identidade visual do relatório.
    const cabecalho = document.createElement("div");
    cabecalho.className = "report-header";

    cabecalho.innerHTML = `
        <div class="report-brand">
            <span class="report-logo" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </span>

            <div>
                <h1>Finance<span>.</span></h1>
                <p>Relatório financeiro</p>
            </div>
        </div>

        <div class="report-date">
            <span>Gerado em</span>
            <strong>${new Date().toLocaleDateString("pt-BR")}</strong>
        </div>
    `;

    relatorio.prepend(cabecalho);

    // Moldura branca e espaçamento do relatório.
    const moldura = document.createElement("div");
    moldura.className = "report-frame";
    moldura.appendChild(relatorio);

    // Renderiza fora da tela, sem modificar o layout original.
    moldura.style.position = "fixed";
    moldura.style.left = "-100000px";
    moldura.style.top = "0";
    moldura.style.width = "1200px";
    moldura.style.padding = "0";
    moldura.style.background = "#f3f6fb";
    moldura.style.zIndex = "-1";

    document.body.appendChild(moldura);

    try {
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        return await html2canvas(moldura, {
            scale: 2,
            backgroundColor: "#f3f6fb",
            useCORS: true,
            logging: false,
            width: 1200,
            windowWidth: 1200
        });
    } finally {
        moldura.remove();
    }
}


/**
 * Exporta o Dashboard como PNG.
 */
async function exportarDashboard() {
    try {
        const canvas = await capturarDashboard();

        const link = document.createElement("a");

        link.download = "finance-dashboard.png";
        link.href = canvas.toDataURL("image/png");

        link.click();

    } catch (erro) {
        console.error("Erro ao exportar PNG:", erro);
        alert("Não foi possível exportar o PNG. Tente novamente.");
    }
}


/**
 * Exporta o Dashboard como PDF A4 horizontal.
 * Se o conteúdo for muito comprido, divide
 * a imagem em páginas automaticamente.
 */
async function exportarPDF() {
    try {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error("A biblioteca jsPDF não foi carregada.");
        }

        const canvas = await capturarDashboard();

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
            compress: true
        });

        const larguraPagina = 297;
        const alturaPagina = 210;
        const margem = 8;

        const larguraUtil = larguraPagina - margem * 2;
        const alturaUtil = alturaPagina - margem * 2;

        // Converte a largura útil do PDF em pixels.
        const escala = canvas.width / larguraUtil;

        // Altura máxima de imagem que cabe em cada página.
        const alturaFatia = Math.floor(alturaUtil * escala);

        let inicio = 0;
        let primeiraPagina = true;

        while (inicio < canvas.height) {
            const alturaAtual = Math.min(
                alturaFatia,
                canvas.height - inicio
            );

            const fatia = document.createElement("canvas");

            fatia.width = canvas.width;
            fatia.height = alturaAtual;

            const contexto = fatia.getContext("2d");

            if (!contexto) {
                throw new Error("Não foi possível processar a imagem.");
            }

            contexto.fillStyle = "#f5f8fc";
            contexto.fillRect(0, 0, fatia.width, fatia.height);

            contexto.drawImage(
                canvas,
                0, inicio,
                canvas.width, alturaAtual,
                0, 0,
                canvas.width, alturaAtual
            );

            if (!primeiraPagina) {
                pdf.addPage("a4", "landscape");
            }

            const imagem = fatia.toDataURL("image/jpeg", 0.92);

            const alturaImagem = alturaAtual / escala;

            pdf.addImage(
                imagem,
                "JPEG",
                margem,
                margem,
                larguraUtil,
                alturaImagem,
                undefined,
                "FAST"
            );

            inicio += alturaAtual;
            primeiraPagina = false;
        }

        pdf.save("finance-relatorio.pdf");

    } catch (erro) {
        console.error("Erro ao exportar PDF:", erro);
        alert("Não foi possível exportar o PDF. Tente novamente.");
    }
}
