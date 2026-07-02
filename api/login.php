<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['erro' => 'Método não permitido.'], 405);
}

$input = json_input();
$email = trim((string) ($input['email'] ?? ''));
$senha = (string) ($input['senha'] ?? '');

if ($email === '' || $senha === '') {
    json_response(['erro' => 'Informe email e senha.'], 422);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = :email');
$stmt->execute(['email' => $email]);
$usuario = $stmt->fetch();

if ($usuario === false || $usuario['senha_hash'] === null || !password_verify($senha, $usuario['senha_hash'])) {
    json_response(['erro' => 'Email ou senha inválidos.'], 401);
}

$_SESSION['usuario_id'] = (int) $usuario['id'];

json_response(['id' => (int) $usuario['id'], 'nome' => $usuario['nome'], 'email' => $usuario['email']]);
