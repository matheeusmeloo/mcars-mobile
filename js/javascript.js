
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
    inicializarPerfil();
    inicializarAdminVeiculos();
    inicializarAdminVeiculoForm();
  });
// =============== AQUI TERMINA O CÓDIGO DO MODAL ============


// ==================== FUNÇÃO AUXILIAR PARA CHAMAR A API ====================

function apiFetch(url, opcoes) {
  opcoes = opcoes || {};
  var ehFormData = opcoes.body instanceof FormData;
  var cabecalhos = Object.assign(ehFormData ? {} : { 'Content-Type': 'application/json' }, opcoes.headers || {});

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


// ==================== AVISOS FLUTUANTES (TOASTS) ====================

var ICONES_AVISO = {
  sucesso: 'ph-check-circle',
  erro: 'ph-warning-circle',
  info: 'ph-info',
};

function mostrarAviso(mensagem, tipo) {
  tipo = ICONES_AVISO[tipo] ? tipo : 'info';

  var container = document.getElementById('aviso-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'aviso-container';
    container.className = 'aviso-container';
    document.body.appendChild(container);
  }

  var balao = document.createElement('div');
  balao.className = 'aviso-balao aviso-' + tipo;

  var icone = document.createElement('span');
  icone.className = 'aviso-icone icon';
  icone.innerHTML = '<i class="ph-fill ' + ICONES_AVISO[tipo] + '"></i>';

  var texto = document.createElement('span');
  texto.className = 'aviso-texto';
  texto.textContent = mensagem;

  var fechar = document.createElement('span');
  fechar.className = 'aviso-fechar';
  fechar.innerHTML = '<i class="ph ph-x"></i>';

  function remover() {
    balao.classList.add('aviso-saida');
    setTimeout(function () { balao.remove(); }, 250);
  }

  fechar.addEventListener('click', remover);

  balao.appendChild(icone);
  balao.appendChild(texto);
  balao.appendChild(fechar);
  container.appendChild(balao);

  setTimeout(remover, 4000);
}

// ==================== FIM DOS AVISOS FLUTUANTES ====================


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
        mostrarAviso(erro.message, 'erro');
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
      mostrarAviso(erro.message, 'erro');
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
      mostrarAviso(erro.message, 'erro');
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
mostrarAviso("Função em criação!", 'info');
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
            '<div class="cell is-row-span-2 ' + textoClasse + ' has-text-centered"><p><i class="ph ph-map-pin ' + textoClasse + '"></i> ' + veiculo.localizacao + '</p></div>' +
            '<div class="cell ' + textoClasse + '"><p><i class="ph-fill ph-currency-dollar has-text-warning"></i> ' + formatarPreco(veiculo.preco) + '</p></div>' +
          '</div>' +
        '</div>' +
      '</a>' +
    '</li>';
}

function cardRecomendacaoHtml(veiculo) {
  var capa = veiculo.capa || './assets/images/carro-pg-recomendations.png';

  return '<a href="details_vehicle.html?id=' + veiculo.id + '" class="cell py-3 px-4 has-background-white-bis has-radius-normal box">' +
      '<div class="fixed-grid has-1-cols">' +
        '<div class="cell"><span><i class="ph-fill ph-star has-text-warning"></i> ' + (veiculo.avaliacao_media || 0) + '</span></div>' +
        '<div class="cell is-flex" style="overflow: hidden;"><figure style="margin-right: -200px;"><img style="width: 80%;" src="' + capa + '" alt="Carro modelo"></figure></div>' +
        '<div class="cell"><p><strong>' + veiculo.marca + ' ' + veiculo.modelo + '</strong></p></div>' +
        '<div class="cell"><p><i class="ph-fill ph-currency-dollar has-text-warning"></i> ' + formatarPreco(veiculo.preco) + '</p></div>' +
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
      mostrarAviso(erro.message, 'erro');
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
    mostrarAviso(erro.message, 'erro');
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
        '<p class="has-text-grey-light"><i class="ph ph-map-pin"></i> ' + item.localizacao + '</p>' +
        '<p><i class="ph-fill ph-currency-dollar has-text-warning"></i> ' + formatarPreco(item.preco) + '</p>' +
      '</div>' +
      '<div class="column is-narrow">' +
        '<button class="button is-ghost has-text-danger" onclick="removerDoCarrinho(' + item.id + ')"><i class="ph ph-trash"></i></button>' +
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
      mostrarAviso(erro.message, 'erro');
    });
  }

  window.removerDoCarrinho = function (itemId) {
    apiFetch('./api/carrinho.php?id=' + itemId, { method: 'DELETE' }).then(carregar).catch(function (erro) {
      mostrarAviso(erro.message, 'erro');
    });
  };

  carregar();
}

function finalizarCompra() {
  var button = document.getElementById('btn-checkout');
  button.classList.add('is-loading');

  apiFetch('./api/checkout.php', { method: 'POST' }).then(function () {
    button.classList.remove('is-loading');
    mostrarAviso('Compra realizada com sucesso!', 'sucesso');
    window.location.href = "home.html";
  }).catch(function (erro) {
    button.classList.remove('is-loading');
    mostrarAviso(erro.message, 'erro');
  });
}

// ==================== TELA DE PERFIL ====================

function formatarCpf(valor) {
  return valor.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatarCep(valor) {
  return valor.replace(/\D/g, '').slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function preencherPerfil(usuario) {
  document.getElementById('perfil-saudacao').textContent = 'Olá, ' + usuario.nome + '! 👋';
  document.getElementById('perfil-nome').value = usuario.nome;
  document.getElementById('perfil-email').value = usuario.email;
  document.getElementById('perfil-cpf').value = usuario.cpf ? formatarCpf(usuario.cpf) : '';
  document.getElementById('perfil-cep').value = usuario.cep || '';
  document.getElementById('perfil-rua').value = usuario.rua || '';
  document.getElementById('perfil-numero').value = usuario.numero || '';
  document.getElementById('perfil-bairro').value = usuario.bairro || '';
  document.getElementById('perfil-cidade').value = usuario.cidade || '';
  document.getElementById('perfil-estado').value = usuario.estado || '';

  var imagem = document.getElementById('perfil-foto-img');
  var icone = document.getElementById('perfil-foto-icone');
  if (usuario.foto_perfil) {
    imagem.src = usuario.foto_perfil + '?t=' + Date.now();
    imagem.style.display = 'inline-block';
    icone.style.display = 'none';
  } else {
    imagem.style.display = 'none';
    icone.style.display = 'inline-block';
  }

  document.getElementById('campo-link-admin').style.display = usuario.tipo === 'admin' ? 'block' : 'none';
}

function inicializarPerfil() {
  var campoNome = document.getElementById('perfil-nome');
  if (!campoNome) {
    return;
  }

  apiFetch('./api/sessao.php').then(function (dados) {
    if (!dados.autenticado) {
      window.location.href = "index.html";
      return;
    }
    preencherPerfil(dados.usuario);
  }).catch(function () {
    window.location.href = "index.html";
  });

  document.getElementById('perfil-cpf').addEventListener('input', function (evento) {
    evento.target.value = formatarCpf(evento.target.value);
  });
  document.getElementById('perfil-cep').addEventListener('input', function (evento) {
    evento.target.value = formatarCep(evento.target.value);
  });
}

function salvarPerfil() {
  var button = document.getElementById('btn-salvar-perfil');
  button.classList.add('is-loading');

  apiFetch('./api/perfil.php', {
    method: 'POST',
    body: JSON.stringify({
      cpf: document.getElementById('perfil-cpf').value,
      cep: document.getElementById('perfil-cep').value,
      rua: document.getElementById('perfil-rua').value,
      numero: document.getElementById('perfil-numero').value,
      bairro: document.getElementById('perfil-bairro').value,
      cidade: document.getElementById('perfil-cidade').value,
      estado: document.getElementById('perfil-estado').value,
    }),
  }).then(function (dados) {
    button.classList.remove('is-loading');
    preencherPerfil(dados.usuario);
    mostrarAviso('Dados salvos com sucesso!', 'sucesso');
  }).catch(function (erro) {
    button.classList.remove('is-loading');
    mostrarAviso(erro.message, 'erro');
  });
}

function enviarFoto(arquivo) {
  if (!arquivo) {
    return;
  }

  var dadosFormulario = new FormData();
  dadosFormulario.append('foto', arquivo);

  apiFetch('./api/foto_perfil.php', {
    method: 'POST',
    body: dadosFormulario,
  }).then(function (dados) {
    var imagem = document.getElementById('perfil-foto-img');
    var icone = document.getElementById('perfil-foto-icone');
    imagem.src = dados.foto_perfil + '?t=' + Date.now();
    imagem.style.display = 'inline-block';
    icone.style.display = 'none';
  }).catch(function (erro) {
    mostrarAviso(erro.message, 'erro');
  });
}

function sair() {
  var button = document.getElementById('btn-sair');
  button.classList.add('is-loading');

  apiFetch('./api/logout.php').then(function () {
    window.location.href = "index.html";
  }).catch(function (erro) {
    button.classList.remove('is-loading');
    mostrarAviso(erro.message, 'erro');
  });
}

// ==================== ADMIN: ACESSO RESTRITO ====================

function verificarAcessoAdmin(aoAutorizar) {
  apiFetch('../api/sessao.php').then(function (dados) {
    if (!dados.autenticado) {
      window.location.href = "../index.html";
      return;
    }
    if (dados.usuario.tipo !== 'admin') {
      mostrarAviso('Acesso restrito a administradores.', 'erro');
      window.location.href = "../home.html";
      return;
    }
    aoAutorizar(dados.usuario);
  }).catch(function () {
    window.location.href = "../index.html";
  });
}

// ==================== ADMIN: LISTAGEM DE VEÍCULOS ====================

var RUBRICA_STATUS = { disponivel: 'Disponível', reservado: 'Reservado', vendido: 'Vendido' };
var RUBRICA_STATUS_COR = { disponivel: 'is-success', reservado: 'is-warning', vendido: 'is-danger' };

function linhaTabelaVeiculo(veiculo) {
  var capa = veiculo.capa || './assets/images/2020-porsche-718-spider.png';
  return '<tr>' +
      '<td><img src="../' + capa.replace(/^\.\//, '') + '" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px;"></td>' +
      '<td>' + veiculo.marca + ' ' + veiculo.modelo + '<br><span class="has-text-grey-light is-size-7">' + veiculo.ano_fabricacao + '</span></td>' +
      '<td>R$ ' + formatarPreco(veiculo.preco) + '</td>' +
      '<td>' + veiculo.localizacao + '</td>' +
      '<td><span class="tag ' + (RUBRICA_STATUS_COR[veiculo.status] || '') + '">' + (RUBRICA_STATUS[veiculo.status] || veiculo.status) + '</span></td>' +
      '<td class="has-text-right">' +
        '<a href="veiculo_form.html?id=' + veiculo.id + '" class="button is-small is-ghost"><i class="ph ph-pencil-simple"></i></a>' +
        '<button onclick="excluirVeiculo(' + veiculo.id + ')" class="button is-small is-ghost has-text-danger"><i class="ph ph-trash"></i></button>' +
      '</td>' +
    '</tr>';
}

function carregarTabelaVeiculos() {
  var container = document.getElementById('tabela-container');
  apiFetch('../api/admin/veiculos.php').then(function (dados) {
    var veiculos = dados.veiculos || [];
    if (veiculos.length === 0) {
      container.innerHTML = '<p class="has-text-centered has-text-grey">Nenhum veículo cadastrado ainda.</p>';
      return;
    }
    container.innerHTML = '<table class="table is-fullwidth is-hoverable">' +
        '<thead><tr><th>Foto</th><th>Veículo</th><th>Preço</th><th>Localização</th><th>Status</th><th></th></tr></thead>' +
        '<tbody>' + veiculos.map(linhaTabelaVeiculo).join('') + '</tbody>' +
      '</table>';
  }).catch(function (erro) {
    container.innerHTML = '<p class="has-text-centered has-text-danger">' + erro.message + '</p>';
  });
}

function inicializarAdminVeiculos() {
  if (!document.getElementById('tabela-container')) {
    return;
  }
  verificarAcessoAdmin(function () {
    carregarTabelaVeiculos();
  });
}

function excluirVeiculo(id) {
  if (!window.confirm('Tem certeza que deseja excluir este veículo?')) {
    return;
  }
  apiFetch('../api/admin/veiculos.php?id=' + id, { method: 'DELETE' }).then(function () {
    carregarTabelaVeiculos();
  }).catch(function (erro) {
    mostrarAviso(erro.message, 'erro');
  });
}

// ==================== ADMIN: FORMULÁRIO DE VEÍCULO ====================

function veiculoIdDaUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

function renderizarFotosVeiculo(imagens) {
  var capa = imagens.filter(function (img) { return img.tipo === 'capa'; })[0];
  var galeria = imagens.filter(function (img) { return img.tipo === 'galeria'; });

  document.getElementById('capa-preview').innerHTML = capa
    ? '<div style="position: relative; display: inline-block;">' +
        '<img src="../' + capa.url.replace(/^\.\//, '') + '" style="width: 120px; height: 90px; object-fit: cover; border-radius: 8px;">' +
        '<button onclick="removerImagemVeiculo(' + capa.id + ')" class="button is-small is-danger" style="position: absolute; top: -8px; right: -8px; border-radius: 50%; width: 1.8em; height: 1.8em; padding: 0;"><i class="ph ph-x"></i></button>' +
      '</div>'
    : '<p class="has-text-grey">Nenhuma foto de capa ainda.</p>';

  document.getElementById('galeria-preview').innerHTML = galeria.map(function (img) {
    return '<div class="column is-narrow" style="position: relative;">' +
        '<img src="../' + img.url.replace(/^\.\//, '') + '" style="width: 100px; height: 80px; object-fit: cover; border-radius: 8px;">' +
        '<button onclick="removerImagemVeiculo(' + img.id + ')" class="button is-small is-danger" style="position: absolute; top: -8px; right: -8px; border-radius: 50%; width: 1.8em; height: 1.8em; padding: 0;"><i class="ph ph-x"></i></button>' +
      '</div>';
  }).join('');
}

function preencherFormularioVeiculo(veiculo) {
  document.getElementById('titulo-formulario').textContent = veiculo.marca + ' ' + veiculo.modelo;
  document.getElementById('campo-marca').value = veiculo.marca;
  document.getElementById('campo-modelo').value = veiculo.modelo;
  document.getElementById('campo-ano').value = veiculo.ano_fabricacao;
  document.getElementById('campo-preco').value = veiculo.preco;
  document.getElementById('campo-localizacao').value = veiculo.localizacao;
  document.getElementById('campo-status').value = veiculo.status;
  document.getElementById('campo-potencia').value = veiculo.potencia_rpm || '';
  document.getElementById('campo-velocidade').value = veiculo.velocidade_maxima_kmh || '';
  document.getElementById('campo-aceleracao').value = veiculo.aceleracao_0_100 || '';
  document.getElementById('campo-cor').value = veiculo.cor || '';
  document.getElementById('campo-quilometragem').value = veiculo.quilometragem || '';
  document.getElementById('campo-combustivel').value = veiculo.combustivel || '';
  document.getElementById('campo-cambio').value = veiculo.cambio || '';
  document.getElementById('campo-descricao').value = veiculo.descricao || '';

  document.getElementById('secao-fotos').style.display = 'block';
  document.getElementById('aviso-fotos').style.display = 'none';
  renderizarFotosVeiculo(veiculo.imagens || []);
}

function inicializarAdminVeiculoForm() {
  if (!document.getElementById('campo-marca')) {
    return;
  }

  verificarAcessoAdmin(function () {
    var id = veiculoIdDaUrl();
    if (!id) {
      return;
    }
    apiFetch('../api/admin/veiculos.php?id=' + id).then(function (veiculo) {
      preencherFormularioVeiculo(veiculo);
    }).catch(function (erro) {
      mostrarAviso(erro.message, 'erro');
      window.location.href = "veiculos.html";
    });
  });
}

function dadosFormularioVeiculo() {
  return {
    marca: document.getElementById('campo-marca').value.trim(),
    modelo: document.getElementById('campo-modelo').value.trim(),
    ano_fabricacao: document.getElementById('campo-ano').value,
    preco: document.getElementById('campo-preco').value,
    localizacao: document.getElementById('campo-localizacao').value.trim(),
    status: document.getElementById('campo-status').value,
    potencia_rpm: document.getElementById('campo-potencia').value,
    velocidade_maxima_kmh: document.getElementById('campo-velocidade').value,
    aceleracao_0_100: document.getElementById('campo-aceleracao').value,
    cor: document.getElementById('campo-cor').value.trim(),
    quilometragem: document.getElementById('campo-quilometragem').value,
    combustivel: document.getElementById('campo-combustivel').value,
    cambio: document.getElementById('campo-cambio').value,
    descricao: document.getElementById('campo-descricao').value.trim(),
  };
}

function salvarVeiculo() {
  var button = document.getElementById('btn-salvar-veiculo');
  var id = veiculoIdDaUrl();
  button.classList.add('is-loading');

  apiFetch('../api/admin/veiculos.php' + (id ? ('?id=' + id) : ''), {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(dadosFormularioVeiculo()),
  }).then(function (dados) {
    button.classList.remove('is-loading');
    if (!id) {
      window.location.href = "veiculo_form.html?id=" + dados.id;
      return;
    }
    mostrarAviso('Veículo atualizado com sucesso!', 'sucesso');
  }).catch(function (erro) {
    button.classList.remove('is-loading');
    mostrarAviso(erro.message, 'erro');
  });
}

function enviarImagemVeiculo(arquivo, tipo) {
  if (!arquivo) {
    return;
  }
  var id = veiculoIdDaUrl();
  var dadosFormulario = new FormData();
  dadosFormulario.append('foto', arquivo);
  dadosFormulario.append('veiculo_id', id);
  dadosFormulario.append('tipo', tipo);

  apiFetch('../api/admin/veiculo_imagens.php', {
    method: 'POST',
    body: dadosFormulario,
  }).then(function () {
    return apiFetch('../api/admin/veiculos.php?id=' + id);
  }).then(function (veiculo) {
    renderizarFotosVeiculo(veiculo.imagens || []);
  }).catch(function (erro) {
    mostrarAviso(erro.message, 'erro');
  });
}

function removerImagemVeiculo(imagemId) {
  if (!window.confirm('Remover esta foto?')) {
    return;
  }
  var id = veiculoIdDaUrl();

  apiFetch('../api/admin/veiculo_imagens.php?id=' + imagemId, { method: 'DELETE' }).then(function () {
    return apiFetch('../api/admin/veiculos.php?id=' + id);
  }).then(function (veiculo) {
    renderizarFotosVeiculo(veiculo.imagens || []);
  }).catch(function (erro) {
    mostrarAviso(erro.message, 'erro');
  });
}
