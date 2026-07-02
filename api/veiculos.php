<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['erro' => 'Método não permitido.'], 405);
}

$pdo = db();
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

if ($id !== null) {
    $stmt = $pdo->prepare('SELECT * FROM veiculos WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $veiculo = $stmt->fetch();

    if ($veiculo === false) {
        json_response(['erro' => 'Veículo não encontrado.'], 404);
    }

    $imagens = $pdo->prepare('SELECT url, tipo, ordem FROM veiculo_imagens WHERE veiculo_id = :id ORDER BY ordem');
    $imagens->execute(['id' => $id]);
    $veiculo['imagens'] = $imagens->fetchAll();

    json_response($veiculo);
}

$busca = trim((string) ($_GET['q'] ?? ''));
$sql = "SELECT v.*, (SELECT url FROM veiculo_imagens WHERE veiculo_id = v.id AND tipo = 'capa' ORDER BY ordem LIMIT 1) AS capa
        FROM veiculos v";

if ($busca !== '') {
    $stmt = $pdo->prepare($sql . ' WHERE v.marca LIKE :busca OR v.modelo LIKE :busca OR v.localizacao LIKE :busca ORDER BY v.criado_em DESC');
    $stmt->execute(['busca' => '%' . $busca . '%']);
} else {
    $stmt = $pdo->query($sql . ' ORDER BY v.criado_em DESC');
}

json_response(['veiculos' => $stmt->fetchAll()]);
