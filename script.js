let movimentacoes = [];

let graficoGastos;
let graficoReceitasDespesas;
let graficoSaldo;
let graficoInvestimento;


// ======================================================
// LOCAL STORAGE
// ======================================================

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


// ======================================================
// ADICIONAR MOVIMENTAÇÃO
// ======================================================

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


// ======================================================
// LISTA DE MOVIMENTAÇÕES
// ======================================================

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


// ======================================================
// REMOVER MOVIMENTAÇÃO
// ======================================================

function removerMovimentacao(index) {

    movimentacoes.splice(index, 1);

    salvarMovimentacoes();

    atualizarListaMovimentacoes();
    atualizarUltimasMovimentacoes();
    atualizarDashboard();
    criarGraficos();
}


// ======================================================
// LIMPAR TODAS AS MOVIMENTAÇÕES
// ======================================================

function limparMovimentacoes() {

    movimentacoes = [];

    salvarMovimentacoes();

    atualizarListaMovimentacoes();
    atualizarUltimasMovimentacoes();
    atualizarDashboard();
    criarGraficos();
}


// ======================================================
// DASHBOARD
// ======================================================

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


// ======================================================
// ÚLTIMAS MOVIMENTAÇÕES
// ======================================================

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


// ======================================================
// SIMULADOR DE INVESTIMENTO
// ======================================================

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


// ======================================================
// FORMATAÇÃO DE MOEDA
// ======================================================

function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ======================================================
// GRÁFICO DO SIMULADOR
// ======================================================

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


// ======================================================
// CRIAR OS 3 GRÁFICOS DO DASHBOARD
// ======================================================

function criarGraficos(
    dados = movimentacoes
) {

    criarGraficoGastos(dados);

    criarGraficoReceitasDespesas(dados);

    criarGraficoSaldo(dados);

}


// ======================================================
// GRÁFICO - DISTRIBUIÇÃO DE GASTOS
// ======================================================

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


// ======================================================
// GRÁFICO - RECEITAS X DESPESAS
// ======================================================

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


// ======================================================
// GRÁFICO - EVOLUÇÃO DO SALDO
// ======================================================

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


// ======================================================
// MENSAGEM DE ERRO
// ======================================================

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


// ======================================================
// FILTROS DO DASHBOARD
// ======================================================

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


// ======================================================
// CARREGAMENTO INICIAL
// ======================================================

carregarMovimentacoes();

atualizarListaMovimentacoes();

atualizarDashboard();

atualizarUltimasMovimentacoes();

criarGraficos();