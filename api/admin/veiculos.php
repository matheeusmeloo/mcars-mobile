<?php
declare(strict_types=1);
require_once __DIR__ . '/../_bootstrap.php';

$adminId = require_admin();
$pdo = db();
$metodo = $_SERVER['REQUEST_METHOD'];

function dados_veiculo_do_input(array $input): array
{
    $combustiveisValidos = ['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido'];
    $cambiosValidos = ['manual', 'automatico'];
    $statusValidos = ['disponivel', 'reservado', 'vendido'];

    $combustivel = trim((string) ($input['combustivel'] ?? ''));
    $cambio = trim((string) ($input['cambio'] ?? ''));
    $status = trim((string) ($input['status'] ?? 'disponivel'));

    return [
        'marca' => trim((string) ($input['marca'] ?? '')),
        'modelo' => trim((string) ($input['modelo'] ?? '')),
        'ano_fabricacao' => (int) ($input['ano_fabricacao'] ?? 0),
        'preco' => (float) ($input['preco'] ?? 0),
        'localizacao' => trim((string) ($input['localizacao'] ?? '')),
        'potencia_rpm' => isset($input['potencia_rpm']) && $input['potencia_rpm'] !== '' ? (int) $input['potencia_rpm'] : null,
        'velocidade_maxima_kmh' => isset($input['velocidade_maxima_kmh']) && $input['velocidade_maxima_kmh'] !== '' ? (int) $input['velocidade_maxima_kmh'] : null,
        'aceleracao_0_100' => isset($input['aceleracao_0_100']) && $input['aceleracao_0_100'] !== '' ? (float) $input['aceleracao_0_100'] : null,
        'cor' => trim((string) ($input['cor'] ?? '')) ?: null,
        'quilometragem' => isset($input['quilometragem']) && $input['quilometragem'] !== '' ? (int) $input['quilometragem'] : null,
        'combustivel' => in_array($combustivel, $combustiveisValidos, true) ? $combustivel : null,
        'cambio' => in_array($cambio, $cambiosValidos, true) ? $cambio : null,
        'descricao' => trim((string) ($input['descricao'] ?? '')) ?: null,
        'status' => in_array($status, $statusValidos, true) ? $status : 'disponivel',
    ];
}

function erros_validacao_veiculo(array $dados): array
{
    $erros = [];
    if ($dados['marca'] === '') {
        $erros[] = 'Marca é obrigatória.';
    }
    if ($dados['modelo'] === '') {
        $erros[] = 'Modelo é obrigatório.';
    }
    if ($dados['ano_fabricacao'] < 1900) {
        $erros[] = 'Ano de fabricação inválido.';
    }
    if ($dados['preco'] <= 0) {
        $erros[] = 'Preço deve ser maior que zero.';
    }
    if ($dados['localizacao'] === '') {
        $erros[] = 'Localização é obrigatória.';
    }
    return $erros;
}

if ($metodo === 'GET') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

    if ($id !== null) {
        $stmt = $pdo->prepare('SELECT * FROM veiculos WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $veiculo = $stmt->fetch();

        if ($veiculo === false) {
            json_response(['erro' => 'Veículo não encontrado.'], 404);
        }

        $imagens = $pdo->prepare('SELECT id, url, tipo, ordem FROM veiculo_imagens WHERE veiculo_id = :id ORDER BY tipo, ordem');
        $imagens->execute(['id' => $id]);
        $veiculo['imagens'] = $imagens->fetchAll();

        json_response($veiculo);
    }

    $stmt = $pdo->query(
        "SELECT v.*, (SELECT url FROM veiculo_imagens WHERE veiculo_id = v.id AND tipo = 'capa' ORDER BY ordem LIMIT 1) AS capa
         FROM veiculos v
         ORDER BY v.criado_em DESC"
    );
    json_response(['veiculos' => $stmt->fetchAll()]);
}

if ($metodo === 'POST') {
    $dados = dados_veiculo_do_input(json_input());
    $erros = erros_validacao_veiculo($dados);
    if ($erros !== []) {
        json_response(['erro' => implode(' ', $erros)], 422);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO veiculos (vendedor_id, marca, modelo, ano_fabricacao, preco, localizacao, potencia_rpm, velocidade_maxima_kmh, aceleracao_0_100, cor, quilometragem, combustivel, cambio, descricao, status)
         VALUES (:vendedor_id, :marca, :modelo, :ano_fabricacao, :preco, :localizacao, :potencia_rpm, :velocidade_maxima_kmh, :aceleracao_0_100, :cor, :quilometragem, :combustivel, :cambio, :descricao, :status)'
    );
    $stmt->execute(array_merge($dados, ['vendedor_id' => $adminId]));

    json_response(['id' => (int) $pdo->lastInsertId()], 201);
}

if ($metodo === 'PUT') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    if ($id <= 0) {
        json_response(['erro' => 'Informe o veículo a atualizar.'], 422);
    }

    $existe = $pdo->prepare('SELECT id FROM veiculos WHERE id = :id');
    $existe->execute(['id' => $id]);
    if ($existe->fetch() === false) {
        json_response(['erro' => 'Veículo não encontrado.'], 404);
    }

    $dados = dados_veiculo_do_input(json_input());
    $erros = erros_validacao_veiculo($dados);
    if ($erros !== []) {
        json_response(['erro' => implode(' ', $erros)], 422);
    }

    $stmt = $pdo->prepare(
        'UPDATE veiculos SET
            marca = :marca, modelo = :modelo, ano_fabricacao = :ano_fabricacao, preco = :preco,
            localizacao = :localizacao, potencia_rpm = :potencia_rpm, velocidade_maxima_kmh = :velocidade_maxima_kmh,
            aceleracao_0_100 = :aceleracao_0_100, cor = :cor, quilometragem = :quilometragem,
            combustivel = :combustivel, cambio = :cambio, descricao = :descricao, status = :status
         WHERE id = :id'
    );
    $stmt->execute(array_merge($dados, ['id' => $id]));

    json_response(['ok' => true]);
}

if ($metodo === 'DELETE') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    if ($id <= 0) {
        json_response(['erro' => 'Informe o veículo a remover.'], 422);
    }

    try {
        $stmt = $pdo->prepare('DELETE FROM veiculos WHERE id = :id');
        $stmt->execute(['id' => $id]);
    } catch (PDOException $e) {
        json_response(['erro' => 'Não é possível excluir: este veículo possui pedidos vinculados.'], 409);
    }

    $pastaVeiculo = __DIR__ . '/../../assets/uploads/veiculos/' . $id;
    if (is_dir($pastaVeiculo)) {
        foreach (glob($pastaVeiculo . '/*') as $arquivo) {
            @unlink($arquivo);
        }
        @rmdir($pastaVeiculo);
    }

    json_response(['ok' => true]);
}

json_response(['erro' => 'Método não permitido.'], 405);
