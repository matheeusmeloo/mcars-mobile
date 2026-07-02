<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

$id = current_user_id();
if ($id === null) {
    json_response(['autenticado' => false]);
}

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT id, nome, email, foto_perfil, cpf, cep, rua, numero, bairro, cidade, estado
     FROM usuarios WHERE id = :id'
);
$stmt->execute(['id' => $id]);
$usuario = $stmt->fetch();

if ($usuario === false) {
    json_response(['autenticado' => false]);
}

json_response(['autenticado' => true, 'usuario' => $usuario]);
