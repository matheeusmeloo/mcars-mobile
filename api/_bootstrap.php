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
