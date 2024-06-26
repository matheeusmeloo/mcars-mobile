
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
  });
// =============== AQUI TERMINA O CÓDIGO DO MODAL ============


// FUNÇÃO SIMPLES PARA MOSTRAR CARREGAMENTO FAKE AO CLICAR NOS BOTÕES
function loading() {
    var button = document.getElementById('btn-login');
    button.classList.add('is-loading');
    // Tempo para voltar ao normal
    setTimeout(function() {
        button.classList.remove('is-loading');
        window.location.href = "http://pt.stackoverflow.com";
    }, 3000);
}
function loading_fb() {
  var button = document.getElementById('btn-login-facebook');
  button.classList.add('is-loading');
  // Tempo para voltar ao normal
  setTimeout(function() {
      button.classList.remove('is-loading');
      window.location.href = "http://pt.stackoverflow.com";
  }, 3000);
}

function loading_gg() {
  var button = document.getElementById('btn-login-google');
  button.classList.add('is-loading');
  // Tempo para voltar ao normal
  setTimeout(function() {
      button.classList.remove('is-loading');
      window.location.href = "http://pt.stackoverflow.com";
  }, 3000);
}

function loading_apple() {
  var button = document.getElementById('btn-login-apple');
  button.classList.add('is-loading');
  // Tempo para voltar ao normal
  setTimeout(function() {
      button.classList.remove('is-loading');
      window.location.href = "http://pt.stackoverflow.com";
  }, 3000);
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