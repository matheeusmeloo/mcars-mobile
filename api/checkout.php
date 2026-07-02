<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['erro' => 'Método não permitido.'], 405);
}

$usuarioId = require_login();
$pdo = db();

$itens = $pdo->prepare(
    'SELECT ci.id AS item_id, v.id AS veiculo_id, v.preco
     FROM carrinho_itens ci
     JOIN veiculos v ON v.id = ci.veiculo_id
     WHERE ci.usuario_id = :usuario_id'
);
$itens->execute(['usuario_id' => $usuarioId]);
$itensCarrinho = $itens->fetchAll();

if ($itensCarrinho === []) {
    json_response(['erro' => 'Carrinho vazio.'], 422);
}

$pdo->beginTransaction();
try {
    $inserirPedido = $pdo->prepare(
        'INSERT INTO pedidos (usuario_id, veiculo_id, valor_total) VALUES (:usuario_id, :veiculo_id, :valor_total)'
    );
    $removerItem = $pdo->prepare('DELETE FROM carrinho_itens WHERE id = :id');
    $atualizarVeiculo = $pdo->prepare("UPDATE veiculos SET status = 'reservado' WHERE id = :id");

    $pedidoIds = [];
    foreach ($itensCarrinho as $item) {
        $inserirPedido->execute([
            'usuario_id' => $usuarioId,
            'veiculo_id' => $item['veiculo_id'],
            'valor_total' => $item['preco'],
        ]);
        $pedidoIds[] = (int) $pdo->lastInsertId();
        $removerItem->execute(['id' => $item['item_id']]);
        $atualizarVeiculo->execute(['id' => $item['veiculo_id']]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    json_response(['erro' => 'Não foi possível concluir a compra.'], 500);
}

json_response(['ok' => true, 'pedidos' => $pedidoIds], 201);
