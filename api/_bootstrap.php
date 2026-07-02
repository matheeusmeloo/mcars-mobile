<?php
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return $_POST;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function json_response(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function current_user_id(): ?int
{
    return $_SESSION['usuario_id'] ?? null;
}

function require_login(): int
{
    $id = current_user_id();
    if ($id === null) {
        json_response(['erro' => 'Não autenticado.'], 401);
    }
    return $id;
}

function cpf_valido(string $cpf): bool
{
    $cpf = preg_replace('/\D/', '', $cpf);

    if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf) === 1) {
        return false;
    }

    for ($posicao = 9; $posicao < 11; $posicao++) {
        $soma = 0;
        for ($indice = 0; $indice < $posicao; $indice++) {
            $soma += ((int) $cpf[$indice]) * (($posicao + 1) - $indice);
        }
        $digitoVerificador = ((10 * $soma) % 11) % 10;
        if ((int) $cpf[$posicao] !== $digitoVerificador) {
            return false;
        }
    }

    return true;
}
