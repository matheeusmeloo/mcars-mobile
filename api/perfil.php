<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['erro' => 'Método não permitido.'], 405);
}

$usuarioId = require_login();
$input = json_input();

$cpf = trim((string) ($input['cpf'] ?? ''));
$cep = trim((string) ($input['cep'] ?? ''));
$rua = trim((string) ($input['rua'] ?? ''));
$numero = trim((string) ($input['numero'] ?? ''));
$bairro = trim((string) ($input['bairro'] ?? ''));
$cidade = trim((string) ($input['cidade'] ?? ''));
$estado = trim((string) ($input['estado'] ?? ''));

if ($cpf !== '' && !cpf_valido($cpf)) {
    json_response(['erro' => 'CPF inválido.'], 422);
}

$cpfLimpo = $cpf !== '' ? preg_replace('/\D/', '', $cpf) : null;

$pdo = db();
$stmt = $pdo->prepare(
    'UPDATE usuarios SET
        cpf = :cpf,
        cep = :cep,
        rua = :rua,
        numero = :numero,
        bairro = :bairro,
        cidade = :cidade,
        estado = :estado,
        atualizado_em = datetime(\'now\')
     WHERE id = :id'
);
$stmt->execute([
    'cpf' => $cpfLimpo,
    'cep' => $cep !== '' ? $cep : null,
    'rua' => $rua !== '' ? $rua : null,
    'numero' => $numero !== '' ? $numero : null,
    'bairro' => $bairro !== '' ? $bairro : null,
    'cidade' => $cidade !== '' ? $cidade : null,
    'estado' => $estado !== '' ? $estado : null,
    'id' => $usuarioId,
]);

$stmt = $pdo->prepare(
    'SELECT id, nome, email, foto_perfil, cpf, cep, rua, numero, bairro, cidade, estado
     FROM usuarios WHERE id = :id'
);
$stmt->execute(['id' => $usuarioId]);

json_response(['usuario' => $stmt->fetch()]);
