<?php
declare(strict_types=1);
require_once __DIR__ . '/../_bootstrap.php';

require_admin();
$pdo = db();
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'POST') {
    $veiculoId = (int) ($_POST['veiculo_id'] ?? 0);
    $tipo = (string) ($_POST['tipo'] ?? 'galeria');

    if (!in_array($tipo, ['capa', 'galeria'], true)) {
        json_response(['erro' => 'Tipo de imagem inválido.'], 422);
    }

    $veiculo = $pdo->prepare('SELECT id FROM veiculos WHERE id = :id');
    $veiculo->execute(['id' => $veiculoId]);
    if ($veiculo->fetch() === false) {
        json_response(['erro' => 'Veículo não encontrado.'], 404);
    }

    if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
        json_response(['erro' => 'Envie um arquivo de imagem válido.'], 422);
    }

    $arquivo = $_FILES['foto'];
    $tiposPermitidos = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $tipoDetectado = (string) mime_content_type($arquivo['tmp_name']);

    if (!isset($tiposPermitidos[$tipoDetectado])) {
        json_response(['erro' => 'Formato de imagem não suportado. Use JPG, PNG ou WEBP.'], 422);
    }

    if ($arquivo['size'] > 5 * 1024 * 1024) {
        json_response(['erro' => 'A imagem deve ter no máximo 5MB.'], 422);
    }

    $pastaVeiculo = __DIR__ . '/../../assets/uploads/veiculos/' . $veiculoId;
    if (!is_dir($pastaVeiculo)) {
        mkdir($pastaVeiculo, 0755, true);
    }

    if ($tipo === 'capa') {
        $capasAntigas = $pdo->prepare("SELECT id, url FROM veiculo_imagens WHERE veiculo_id = :id AND tipo = 'capa'");
        $capasAntigas->execute(['id' => $veiculoId]);
        foreach ($capasAntigas->fetchAll() as $capa) {
            $caminhoAntigo = __DIR__ . '/../../' . ltrim(str_replace('./', '', $capa['url']), '/');
            if (is_file($caminhoAntigo)) {
                @unlink($caminhoAntigo);
            }
        }
        $pdo->prepare("DELETE FROM veiculo_imagens WHERE veiculo_id = :id AND tipo = 'capa'")->execute(['id' => $veiculoId]);
    }

    $extensao = $tiposPermitidos[$tipoDetectado];
    $nomeArquivo = $tipo . '-' . time() . '-' . random_int(1000, 9999) . '.' . $extensao;
    $caminhoDestino = $pastaVeiculo . '/' . $nomeArquivo;

    if (!move_uploaded_file($arquivo['tmp_name'], $caminhoDestino)) {
        json_response(['erro' => 'Não foi possível salvar a imagem.'], 500);
    }

    $urlPublica = './assets/uploads/veiculos/' . $veiculoId . '/' . $nomeArquivo;

    $proximaOrdem = (int) $pdo->query(
        "SELECT COALESCE(MAX(ordem), -1) + 1 FROM veiculo_imagens WHERE veiculo_id = {$veiculoId} AND tipo = " . $pdo->quote($tipo)
    )->fetchColumn();

    $stmt = $pdo->prepare('INSERT INTO veiculo_imagens (veiculo_id, url, tipo, ordem) VALUES (:veiculo_id, :url, :tipo, :ordem)');
    $stmt->execute(['veiculo_id' => $veiculoId, 'url' => $urlPublica, 'tipo' => $tipo, 'ordem' => $proximaOrdem]);

    json_response(['id' => (int) $pdo->lastInsertId(), 'url' => $urlPublica, 'tipo' => $tipo], 201);
}

if ($metodo === 'DELETE') {
    $imagemId = (int) ($_GET['id'] ?? 0);
    if ($imagemId <= 0) {
        json_response(['erro' => 'Informe a imagem a remover.'], 422);
    }

    $stmt = $pdo->prepare('SELECT url FROM veiculo_imagens WHERE id = :id');
    $stmt->execute(['id' => $imagemId]);
    $imagem = $stmt->fetch();

    if ($imagem === false) {
        json_response(['erro' => 'Imagem não encontrada.'], 404);
    }

    $pdo->prepare('DELETE FROM veiculo_imagens WHERE id = :id')->execute(['id' => $imagemId]);

    if (str_starts_with($imagem['url'], './assets/uploads/')) {
        $caminho = __DIR__ . '/../../' . ltrim(str_replace('./', '', $imagem['url']), '/');
        if (is_file($caminho)) {
            @unlink($caminho);
        }
    }

    json_response(['ok' => true]);
}

json_response(['erro' => 'Método não permitido.'], 405);
