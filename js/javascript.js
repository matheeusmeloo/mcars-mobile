
// ================== AQUI COMEÇA AS INFORMAÇÕES DO MODAL ================
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }

    function closeModal($el) {
      $el.classList.remove('is-active');
    }

    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);

      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');

      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if(event.key === "Escape") {
        closeAllModals();
      }
    });

    inicializarHome();
    inicializarDetalhes();
    inicializarCarrinho();
  });
// =============== AQUI TERMINA O CÓDIGO DO MODAL ============


// ==================== FUNÇÃO AUXILIAR PARA CHAMAR A API ====================

function apiFetch(url, opcoes) {
  opcoes = opcoes || {};
  var cabecalhos = Object.assign({ 'Content-Type': 'application/json' }, opcoes.headers || {});

  return fetch(url, Object.assign({}, opcoes, { headers: cabecalhos }))
    .then(function (resposta) {
      return resposta.json().catch(function () { return {}; }).then(function (dados) {
        if (!resposta.ok) {
          throw new Error(dados.erro || 'Erro inesperado.');
        }
        return dados;
      });
    });
}

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ==================== FIM DA FUNÇÃO AUXILIAR ====================


// FUNÇÃO SIMPLES PARA MOSTRAR CARREGAMENTO FAKE AO CLICAR NOS BOTÕES
function loading() {
    var button = document.getElementById('btn-login');
    var email = document.getElementById('login-email').value.trim();
    var senha = document.getElementById('login-senha').value;

    button.classList.add('is-loading');

    apiFetch('./api/login.php', {
        method: 'POST',
        body: JSON.stringify({ email: email, senha: senha }),
    }).then(function () {
        window.location.href = "home.html";
    }).catch(function (erro) {
        button.classList.remove('is-loading');
        window.alert(erro.message);
    });
}
function loading_fb() {
  var button = document.getElementById('btn-login-facebook');
  button.classList.add('is-loading');
  // Tempo para voltar ao normal
  setTimeout(function() {
      button.classList.remove('is-loading');
      window.location.href = "home.html";
  }, 3000);
}

function loading_gg() {
  var button = document.getElementById('btn-login-google');
  button.classList.add('is-loading');
  // Tempo para voltar ao normal
  setTimeout(function() {
      button.classList.remove('is-loading');
      window.location.href = "home.html";
  }, 3000);
}

function loading_apple() {
  var button = document.getElementById('btn-login-apple');
  button.classList.add('is-loading');
  // Tempo para voltar ao normal
  setTimeout(function() {
      button.classList.remove('is-loading');
      window.location.href = "home.html";
  }, 3000);
}
function loading_cadastro() {
  var button = document.getElementById('btn-cad');
  var nome = document.getElementById('cadastro-nome').value.trim();
  var email = document.getElementById('cadastro-email').value.trim();
  var senha = document.getElementById('password').value;

  button.classList.add('is-loading');

  apiFetch('./api/cadastro.php', {
      method: 'POST',
      body: JSON.stringify({ nome: nome, email: email, senha: senha }),
  }).then(function () {
      window.location.href = "home.html";
  }).catch(function (erro) {
      button.classList.remove('is-loading');
      window.alert(erro.message);
  });
}
function carrinho() {
  var button = document.getElementById('btn-cart');
  button.classList.add('is-loading');

  apiFetch('./api/carrinho.php', {
      method: 'POST',
      body: JSON.stringify({ veiculo_id: window.veiculoAtualId }),
  }).then(function () {
      window.location.href = "cart_buy.html";
  }).catch(function (erro) {
      button.classList.remove('is-loading');
      if (erro.message === 'Não autenticado.') {
          window.location.href = "index.html";
          return;
      }
      window.alert(erro.message);
  });
}


// clicar no botão do olhinho para ver a senha digitada

function lookEye() {
   var passwordField = document.getElementById("password");
             var passwordFieldType = passwordField.getAttribute("type");

             if (passwordFieldType === "password") {
                 passwordField.setAttribute("type", "text");
                 let el = document.getElementById('elemento');
                  el.classList.remove('teste');
                  el.classList.add('testando');
             } else {
                 passwordField.setAttribute("type", "password");
             }
}

// ==================== FUNÇÃO VOLTAR ==================

function voltar(){
  history.go(-1)
}

// ==================== FIM DA FUNÇÃO VOLTAR ==================

// ================ FUNÇÃO ALERT ==========

function alertTemporario()
{
// alert("Função em criação!");
window.alert("Função em criação!");
}

// =============== FIM FUNÇÃO ALERT ===============


// ==================== TELA HOME: CARROSSEL DE DESTAQUES E RECOMENDAÇÕES ====================

function cardDestaqueHtml(veiculo, indice) {
  var corClasse = indice % 2 === 0 ? 'card_slide_black' : 'card_slide_white';
  var textoClasse = indice % 2 === 0 ? 'has-text-white' : 'has-text-dark';
  var capa = veiculo.capa || './assets/images/2020-porsche-718-spider.png';

  return '<li class="' + corClasse + ' box">' +
      '<a href="details_vehicle.html?id=' + veiculo.id + '">' +
        '<div class="fixed-grid has-2-cols">' +
          '<div class="grid">' +
            '<div class="cell is-col-span-2 has-text-centered"><img src="' + capa + '" alt="" draggable="false"></div>' +
            '<div class="cell"><p><strong class="' + textoClasse + '">' + veiculo.marca + ' ' + veiculo.modelo + '</strong></p></div>' +
            '<div class="cell is-row-span-2 ' + textoClasse + ' has-text-centered"><p><i class="fa-solid fa-location-dot ' + textoClasse + '"></i> ' + veiculo.localizacao + '</p></div>' +
            '<div class="cell ' + textoClasse + '"><p><i class="fa-solid fa-dollar-sign has-text-warning"></i> ' + formatarPreco(veiculo.preco) + '</p></div>' +
          '</div>' +
        '</div>' +
      '</a>' +
    '</li>';
}

function cardRecomendacaoHtml(veiculo) {
  var capa = veiculo.capa || './assets/images/carro-pg-recomendations.png';

  return '<a href="details_vehicle.html?id=' + veiculo.id + '" class="cell py-3 px-4 has-background-white-bis has-radius-normal box">' +
      '<div class="fixed-grid has-1-cols">' +
        '<div class="cell"><span><i class="fa-solid fa-star has-text-warning"></i> ' + (veiculo.avaliacao_media || 0) + '</span></div>' +
        '<div class="cell is-flex" style="overflow: hidden;"><figure style="margin-right: -200px;"><img style="width: 80%;" src="' + capa + '" alt="Carro modelo"></figure></div>' +
        '<div class="cell"><p><strong>' + veiculo.marca + ' ' + veiculo.modelo + '</strong></p></div>' +
        '<div class="cell"><p><i class="fa-solid fa-dollar-sign has-text-warning"></i> ' + formatarPreco(veiculo.preco) + '</p></div>' +
      '</div>' +
    '</a>';
}

function inicializarHome() {
  var carrossel = document.getElementById('carrossel-destaques');
  var grid = document.getElementById('grid-recomendacoes');
  if (!carrossel && !grid) {
    return;
  }

  function carregar(busca) {
    var url = './api/veiculos.php' + (busca ? ('?q=' + encodeURIComponent(busca)) : '');
    apiFetch(url).then(function (dados) {
      var veiculos = dados.veiculos || [];
      if (carrossel) {
        carrossel.innerHTML = veiculos.map(cardDestaqueHtml).join('');
      }
      if (grid) {
        grid.innerHTML = veiculos.length
          ? veiculos.map(cardRecomendacaoHtml).join('')
          : '<p class="has-text-centered has-text-grey">Nenhum veículo encontrado.</p>';
      }
    }).catch(function (erro) {
      window.alert(erro.message);
    });
  }

  carregar('');

  var campoBusca = document.getElementById('campo-busca');
  if (campoBusca) {
    campoBusca.addEventListener('keyup', function (evento) {
      if (evento.key === 'Enter') {
        carregar(campoBusca.value.trim());
      }
    });
  }
}

// ==================== TELA DE DETALHES DO VEÍCULO ====================

function inicializarDetalhes() {
  var elMarca = document.getElementById('detalhe-marca');
  if (!elMarca) {
    return;
  }

  var parametros = new URLSearchParams(window.location.search);
  var id = parametros.get('id');
  if (!id) {
    window.location.href = "home.html";
    return;
  }

  apiFetch('./api/veiculos.php?id=' + encodeURIComponent(id)).then(function (veiculo) {
    window.veiculoAtualId = veiculo.id;
    document.title = 'Detalhes ' + veiculo.marca + ' ' + veiculo.modelo;

    elMarca.textContent = veiculo.marca;
    document.getElementById('detalhe-modelo').textContent = veiculo.marca + ' ' + veiculo.modelo;
    document.getElementById('detalhe-modelo-preco').textContent = veiculo.marca + ' ' + veiculo.modelo;
    document.getElementById('detalhe-preco').textContent = formatarPreco(veiculo.preco);
    document.getElementById('detalhe-potencia').textContent = (veiculo.potencia_rpm || '-') + ' rpm';
    document.getElementById('detalhe-velocidade').textContent = (veiculo.velocidade_maxima_kmh || '-') + ' Km/h';
    document.getElementById('detalhe-aceleracao').textContent = (veiculo.aceleracao_0_100 || '-') + ' s';

    var imagem360 = (veiculo.imagens || []).find(function (img) { return img.tipo === '360'; });
    var visualizador = document.getElementById('visualizador-360');
    if (imagem360 && visualizador) {
      visualizador.setAttribute('data-folder', imagem360.url);
    }
  }).catch(function (erro) {
    window.alert(erro.message);
    window.location.href = "home.html";
  });
}

// ==================== TELA DO CARRINHO ====================

function cardCarrinhoHtml(item) {
  var capa = item.capa || './assets/images/2020-porsche-718-spider.png';

  return '<div class="box columns is-mobile is-vcentered">' +
      '<div class="column is-narrow"><img src="' + capa + '" alt="" style="width: 90px;"></div>' +
      '<div class="column">' +
        '<p><strong>' + item.marca + ' ' + item.modelo + '</strong></p>' +
        '<p class="has-text-grey-light"><i class="fa-solid fa-location-dot"></i> ' + item.localizacao + '</p>' +
        '<p><i class="fa-solid fa-dollar-sign has-text-warning"></i> ' + formatarPreco(item.preco) + '</p>' +
      '</div>' +
      '<div class="column is-narrow">' +
        '<button class="button is-ghost has-text-danger" onclick="removerDoCarrinho(' + item.id + ')"><i class="fa-solid fa-trash"></i></button>' +
      '</div>' +
    '</div>';
}

function inicializarCarrinho() {
  var lista = document.getElementById('lista-carrinho');
  if (!lista) {
    return;
  }

  function carregar() {
    apiFetch('./api/carrinho.php').then(function (dados) {
      var itens = dados.itens || [];
      lista.innerHTML = itens.length
        ? itens.map(cardCarrinhoHtml).join('')
        : '<p class="has-text-centered has-text-grey">Seu carrinho está vazio.</p>';
      document.getElementById('carrinho-total').textContent = formatarPreco(dados.total);
    }).catch(function (erro) {
      if (erro.message === 'Não autenticado.') {
        window.location.href = "index.html";
        return;
      }
      window.alert(erro.message);
    });
  }

  window.removerDoCarrinho = function (itemId) {
    apiFetch('./api/carrinho.php?id=' + itemId, { method: 'DELETE' }).then(carregar).catch(function (erro) {
      window.alert(erro.message);
    });
  };

  carregar();
}

function finalizarCompra() {
  var button = document.getElementById('btn-checkout');
  button.classList.add('is-loading');

  apiFetch('./api/checkout.php', { method: 'POST' }).then(function () {
    button.classList.remove('is-loading');
    window.alert('Compra realizada com sucesso!');
    window.location.href = "home.html";
  }).catch(function (erro) {
    button.classList.remove('is-loading');
    window.alert(erro.message);
  });
}
