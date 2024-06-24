<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css">
    <link rel="icon" type="image/x-icon" href="./assets/icons/favicon-mcars.svg">
    <link rel="stylesheet" href="./css/style.css">
  </head>
  <body>
      <div class="column" style="padding-top: 3em;">
          <div class="container box is-fluid">
              <div class="field">
                  <p class="control has-icons-left has-icons-right">
                    <label class="label">Login</label>
                    <input class="input is-white" type="email">
                        <span class="icon is-small is-left is-white">
                          <i class="fas fa-envelope"></i>
                        </span>
                        <span class="icon is-small is-right">
                          <i class="fas fa-check"></i>
                        </span>
                  </p>
              </div>
              <br>
            <div class="field">
                  <p class="control has-icons-left">
                  <label class="label">Senha</label>
                    <input class="input is-white" type="password">
                    <span class="icon is-small is-left">
                      <i class="fas fa-lock"></i>
                    </span>
                  </p>
            </div>
            <div class="field">
              <p class="control">
                <button class="button is-white is-large is-fullwidth">
                  Login
                </button>
              </p>
            </div>
            <div>
              <br>
              <p>Ou continue com</p>
              <br>
              <br>
              <div class="fixed-grid has-3-cols ">
                <div class="grid is-centered">
                    <div class="cell">
                        <button class="button is-white is-outlined">
                          <img class="image is-32x32" src="./assets/logos/logo-google-login.png" alt="">
                        </button>
                    </div>
                    <div class="cell">
                        <button class="button is-white is-outlined">
                          <img class="image is-32x32" src="./assets/logos/logo-facebook-login.svg" alt="">
                        </button>
                    </div>
                    <div class="cell">
                        <button class="button is-white is-outlined">
                          <img class="image is-32x32" src="./assets/logos/logo-apple-login.png" alt="">
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
      </div>
  </body>
</html>