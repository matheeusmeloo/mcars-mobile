<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['erro' => 'Método não permitido.'], 405);
}

$input = json_input();
$nome = trim((string) ($input['nome'] ?? ''));
$email = trim((string) ($input['email'] ?? ''));
$senha = (string) ($input['senha'] ?? '');

if ($nome === '' || $email === '' || $senha === '') {
    json_response(['erro' => 'Preencha nome, email e senha.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['erro' => 'Email inválido.'], 422);
}
if (strlen($senha) < 6) {
    json_response(['erro' => 'A senha deve ter ao menos 6 caracteres.'], 422);
}

$pdo = db();

$existe = $pdo->prepare('SELECT id FROM usuarios WHERE email = :email');
$existe->execute(['email' => $email]);
if ($existe->fetch() !== false) {
    json_response(['erro' => 'Este email já está cadastrado.'], 409);
}

$hash = password_hash($senha, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (:nome, :email, :senha_hash)');
$stmt->execute(['nome' => $nome, 'email' => $email, 'senha_hash' => $hash]);

$usuarioId = (int) $pdo->lastInsertId();
$_SESSION['usuario_id'] = $usuarioId;

json_response(['id' => $usuarioId, 'nome' => $nome, 'email' => $email], 201);
