<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

$usuarioId = require_login();
$pdo = db();
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $stmt = $pdo->prepare(
        "SELECT ci.id, v.id AS veiculo_id, v.marca, v.modelo, v.preco, v.localizacao,
                (SELECT url FROM veiculo_imagens WHERE veiculo_id = v.id AND tipo = 'capa' ORDER BY ordem LIMIT 1) AS capa
         FROM carrinho_itens ci
         JOIN veiculos v ON v.id = ci.veiculo_id
         WHERE ci.usuario_id = :usuario_id
         ORDER BY ci.adicionado_em DESC"
    );
    $stmt->execute(['usuario_id' => $usuarioId]);
    $itens = $stmt->fetchAll();
    $total = array_sum(array_column($itens, 'preco'));

    json_response(['itens' => $itens, 'total' => $total]);
}

if ($metodo === 'POST') {
    $input = json_input();
    $veiculoId = (int) ($input['veiculo_id'] ?? 0);

    if ($veiculoId <= 0) {
        json_response(['erro' => 'Informe um veículo válido.'], 422);
    }

    $existeVeiculo = $pdo->prepare('SELECT id FROM veiculos WHERE id = :id');
    $existeVeiculo->execute(['id' => $veiculoId]);
    if ($existeVeiculo->fetch() === false) {
        json_response(['erro' => 'Veículo não encontrado.'], 404);
    }

    $stmt = $pdo->prepare('INSERT OR IGNORE INTO carrinho_itens (usuario_id, veiculo_id) VALUES (:usuario_id, :veiculo_id)');
    $stmt->execute(['usuario_id' => $usuarioId, 'veiculo_id' => $veiculoId]);

    json_response(['ok' => true], 201);
}

if ($metodo === 'DELETE') {
    $itemId = (int) ($_GET['id'] ?? 0);
    if ($itemId <= 0) {
        json_response(['erro' => 'Informe o item a remover.'], 422);
    }

    $stmt = $pdo->prepare('DELETE FROM carrinho_itens WHERE id = :id AND usuario_id = :usuario_id');
    $stmt->execute(['id' => $itemId, 'usuario_id' => $usuarioId]);

    json_response(['ok' => true]);
}

json_response(['erro' => 'Método não permitido.'], 405);
