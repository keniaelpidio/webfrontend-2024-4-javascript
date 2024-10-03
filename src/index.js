const readline = require('readline');

// Criar uma interface para leitura de entrada
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para calcular o valor por pessoa se todos pagarem da mesma forma
function calcularValorPorPessoa(mesas, metodoPagamento, opcaoDivisao) {
  let totalValor = 0;
  let totalPessoas = 0;

  mesas.forEach(mesa => {
    totalValor += mesa.valorTotal;
    totalPessoas += mesa.numPessoas;
  });

  const valorPorPessoa = totalValor / totalPessoas; // Valor sem desconto

  if (metodoPagamento === '1') { // PIX
    const valorPorPessoaPix = valorPorPessoa * 0.9; // 10% de desconto
    console.log(`Valor por pessoa (PIX): R$ ${valorPorPessoaPix.toFixed(2)}`);
  } else if (metodoPagamento === '2') { // Dinheiro
    const valorPorPessoaDinheiro = valorPorPessoa * 0.9; // 10% de desconto
    console.log(`Valor por pessoa (Dinheiro): R$ ${valorPorPessoaDinheiro.toFixed(2)}`);
  } else if (metodoPagamento === '3') { // Cartão
    console.log(`Valor por pessoa (Cartão): R$ ${valorPorPessoa.toFixed(2)}`);
  }

  perguntarNovoCalculo();
}

// Função principal
function calcularConta() {
  rl.question("Quantas mesas são? ", (numMesas) => {
    numMesas = parseInt(numMesas);
    const mesas = [];

    if (numMesas === 1) {
      // Perguntas para uma única mesa
      rl.question("Digite o número da mesa: ", (numeroMesa) => {
        rl.question(`Digite a quantidade de pessoas na mesa ${numeroMesa}: `, (numPessoas) => {
          rl.question(`Digite o valor da conta da mesa ${numeroMesa}: R$ `, (valorTotal) => {
            mesas.push({ numeroMesa, numPessoas: parseInt(numPessoas), valorTotal: parseFloat(valorTotal) });

            // Perguntar se todas as pessoas irão utilizar a mesma forma de pagamento
            rl.question("Todas as pessoas irão utilizar a mesma forma de pagamento? (s/n): ", (respostaPagamento) => {
              if (respostaPagamento.toLowerCase() === 's') {
                rl.question("Escolha o método de pagamento (1 para PIX, 2 para dinheiro, 3 para cartão): ", (metodoPagamento) => {
                  calcularValorPorPessoa(mesas, metodoPagamento, '1'); // Passar '1' como opção de divisão
                });
              } else {
                // Coletar quantidades de pessoas por método de pagamento
                coletarPagamentosPorMetodo(mesas);
              }
            });
          });
        });
      });
    } else {
      // Coletar informações de cada mesa
      function coletarMesas(mesaIndex) {
        if (mesaIndex < numMesas) {
          rl.question(`Digite o número da mesa ${mesaIndex + 1}: `, (numeroMesa) => {
            rl.question(`Digite a quantidade de pessoas na mesa ${numeroMesa}: `, (numPessoas) => {
              rl.question(`Digite o valor da conta da mesa ${numeroMesa}: R$ `, (valorTotal) => {
                mesas.push({ numeroMesa, numPessoas: parseInt(numPessoas), valorTotal: parseFloat(valorTotal) });
                coletarMesas(mesaIndex + 1); // Chamar a função para a próxima mesa
              });
            });
          });
        } else {
          // Perguntar se a conta será dividida pelo número total de pessoas ou pela quantidade de pessoas em cada mesa
          rl.question("A conta será dividida pelo número total de pessoas (1) ou pela quantidade de pessoas em cada mesa (2)? ", (opcaoDivisao) => {
            rl.question("Todas as pessoas irão utilizar a mesma forma de pagamento? (s/n): ", (respostaPagamento) => {
              if (respostaPagamento.toLowerCase() === 's') {
                rl.question("Escolha o método de pagamento (1 para PIX, 2 para dinheiro, 3 para cartão): ", (metodoPagamento) => {
                  calcularValorPorPessoa(mesas, metodoPagamento, opcaoDivisao);
                });
              } else {
                // Coletar quantidades de pessoas por método de pagamento
                coletarPagamentosPorMetodo(mesas);
              }
            });
          });
        }
      }

      coletarMesas(0); // Iniciar coleta das mesas
    }
  });
}

// Função para coletar quantidades de pessoas por método de pagamento
function coletarPagamentosPorMetodo(mesas) {
  mesas.forEach(mesa => {
    rl.question(`Para a mesa ${mesa.numeroMesa}, quantas pessoas pagarão via PIX? `, (pessoasPix) => {
      rl.question(`Quantas pessoas pagarão via dinheiro? `, (pessoasDinheiro) => {
        const totalPessoas = parseInt(pessoasPix) + parseInt(pessoasDinheiro);
        
        // Calcula quantas pessoas pagarão com cartão
        const pessoasCartao = mesa.numPessoas - totalPessoas;

        if (pessoasCartao < 0) {
          console.log("O total de pessoas informadas não pode exceder a quantidade na mesa. Tente novamente.");
          coletarPagamentosPorMetodo([mesa]); // Reiniciar coleta para esta mesa
          return;
        }

        calcularValoresIndividuais(mesa, pessoasPix, pessoasDinheiro, pessoasCartao);
        if (mesa.numeroMesa === mesas[mesas.length - 1].numeroMesa) {
          perguntarNovoCalculo(); // Perguntar se deseja fazer um novo cálculo
        }
      });
    });
  });
}

// Função para calcular valores individuais
function calcularValoresIndividuais(mesa, pessoasPix, pessoasDinheiro, pessoasCartao) {
  let valorTotal = mesa.valorTotal;

  const numPix = parseInt(pessoasPix);
  const numDinheiro = parseInt(pessoasDinheiro);
  const numCartao = pessoasCartao;

  // Cálculo do total de pessoas
  const totalPessoas = numPix + numDinheiro + numCartao;

  // Cálculo do valor por pessoa
  const valorPorPessoa = valorTotal / totalPessoas; // Valor sem desconto
  const valorPorPessoaPix = numPix > 0 ? (valorPorPessoa * 0.9) : 0; // 10% de desconto para PIX
  const valorPorPessoaDinheiro = numDinheiro > 0 ? (valorPorPessoa * 0.9) : 0; // 10% de desconto para dinheiro
  const valorPorPessoaCartao = numCartao > 0 ? valorPorPessoa : 0; // Sem desconto para cartão

  console.log(`\nMesa ${mesa.numeroMesa}:`);
  if (numPix > 0) {
    console.log(`- Pessoas pagando via PIX: ${numPix} | Valor por pessoa: R$ ${valorPorPessoaPix.toFixed(2)}`);
  }
  if (numDinheiro > 0) {
    console.log(`- Pessoas pagando via Dinheiro: ${numDinheiro} | Valor por pessoa: R$ ${valorPorPessoaDinheiro.toFixed(2)}`);
  }
  if (numCartao > 0) {
    console.log(`- Pessoas pagando via Cartão: ${numCartao} | Valor por pessoa: R$ ${valorPorPessoaCartao.toFixed(2)}`);
  }
}

// Função para perguntar se o usuário deseja fazer um novo cálculo
function perguntarNovoCalculo() {
  rl.question("\nDeseja fazer um novo cálculo? (s/n): ", (resposta) => {
    if (resposta.toLowerCase() === 's') {
      calcularConta(); // Iniciar um novo cálculo
    } else {
      rl.close(); // Fechar o programa
    }
  });
}

// Chamar a função principal
calcularConta();
