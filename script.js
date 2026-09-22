let movimentacoes = [];

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

    atualizarListaMovimentacoes();
    salvarMovimentacoes();
    atualizarDashboard();
}

function atualizarListaMovimentacoes() {

    const lista = document.getElementById("listaMovimentacoes");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    if (movimentacoes.length === 0) {
        lista.innerHTML = "<p>Nenhuma movimentação cadastrada.</p>";
        return;
    }

    movimentacoes.forEach((mov, index) => {

        const item = document.createElement("div");

        item.className = "movimentacao";

        const tipoTexto =
    mov.tipo === "receita" ? "↑ Receita" : "↓ Despesa";

    item.className = `movimentacao ${mov.tipo}`;

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

function removerMovimentacao(index) {
    movimentacoes.splice(index, 1);
    salvarMovimentacoes();
    atualizarListaMovimentacoes();
    atualizarDashboard();
}

function limparMovimentacoes() {
    movimentacoes = [];
    salvarMovimentacoes();
    atualizarListaMovimentacoes();
    atualizarDashboard();
}

function atualizarDashboard() {

    let renda = 0;
    let gastos = 0;

    movimentacoes.forEach(function(mov) {

        if (mov.tipo === "receita") {
            renda += mov.valor;
        }

        if (mov.tipo === "despesa") {
            gastos += mov.valor;
        }

    });

    const saldoRestante = renda - gastos;
    const investimento = saldoRestante / 2;


    const printRenda = document.getElementById("print_renda");
    const printGastos = document.getElementById("print_gastos");
    const printSaldo = document.getElementById("print_saldo");
    const printInvestimento = document.getElementById("print_investimento");


    if (printRenda) {
        printRenda.innerHTML = "R$ " + renda.toFixed(2);
    }

    if (printGastos) {
        printGastos.innerHTML = "R$ " + gastos.toFixed(2);
    }

    if (printSaldo) {
        printSaldo.innerHTML = "R$ " + saldoRestante.toFixed(2);
    }

    if (printInvestimento) {
        printInvestimento.innerHTML = "R$ " + investimento.toFixed(2);
    }
}

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
        alert("Preencha todos os campos corretamente.");
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
        Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;


    const meses = anos * 12;


    let saldo = valorInicial;


    let historico = [];

    historico.push(saldo);


    for (let i = 0; i < meses; i++) {

        saldo = saldo * (1 + taxaMensal);

        saldo += aporteMensal;

        historico.push(saldo);
    }


    const valorInvestido =
        valorInicial + (aporteMensal * meses);


    const rendimentos =
        saldo - valorInvestido;


    document.getElementById("valorInvestido").textContent =
        formatarMoeda(valorInvestido);

    document.getElementById("rendimentos").textContent =
        formatarMoeda(rendimentos);

    document.getElementById("valorFinal").textContent =
        formatarMoeda(saldo);


    let labels = [];

    for (let i = 0; i <= meses; i++) {
        labels.push("Mês " + i);
    }


    criarGrafico(labels, historico);
}


function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function criarGrafico(labels, dados) {

  const ctx = document.getElementById("graficoInvestimento");

  new Chart(ctx, {

    type: "line",

    data: {

      labels: labels,

      datasets: [{
        label: "Crescimento do investimento",
        data: dados,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
        fill: true
      }]

    },

    options: { responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {

        y: {

          ticks: {

            callback: function(value) {
              return "R$ " + value.toLocaleString("pt-BR");
            }

          }

        }

      }

    }
    

  });

}

function mostrarErro(msg) {
    const resultado = document.getElementById("resultado");

    resultado.innerHTML = "<br>" + msg;

    setTimeout(() => {
        resultado.textContent = "";
    }, 10000); // desaparece em 10 segundos
}

carregarMovimentacoes();

atualizarListaMovimentacoes();

atualizarDashboard();