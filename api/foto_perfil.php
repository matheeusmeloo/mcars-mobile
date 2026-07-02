<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['erro' => 'Método não permitido.'], 405);
}

$usuarioId = require_login();

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    json_response(['erro' => 'Envie um arquivo de imagem válido.'], 422);
}

$arquivo = $_FILES['foto'];
$tiposPermitidos = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];

$tipoDetectado = (string) mime_content_type($arquivo['tmp_name']);
if (!isset($tiposPermitidos[$tipoDetectado])) {
    json_response(['erro' => 'Formato de imagem não suportado. Use JPG, PNG ou WEBP.'], 422);
}

$tamanhoMaximo = 5 * 1024 * 1024;
if ($arquivo['size'] > $tamanhoMaximo) {
    json_response(['erro' => 'A imagem deve ter no máximo 5MB.'], 422);
}

$pdo = db();

$stmt = $pdo->prepare('SELECT foto_perfil FROM usuarios WHERE id = :id');
$stmt->execute(['id' => $usuarioId]);
$fotoAntiga = $stmt->fetchColumn();

$pastaUploads = __DIR__ . '/../assets/uploads';
if (!is_dir($pastaUploads)) {
    mkdir($pastaUploads, 0755, true);
}

$extensao = $tiposPermitidos[$tipoDetectado];
$nomeArquivo = 'usuario-' . $usuarioId . '-' . time() . '.' . $extensao;
$caminhoDestino = $pastaUploads . '/' . $nomeArquivo;

if (!move_uploaded_file($arquivo['tmp_name'], $caminhoDestino)) {
    json_response(['erro' => 'Não foi possível salvar a imagem.'], 500);
}

$urlPublica = './assets/uploads/' . $nomeArquivo;

$stmt = $pdo->prepare("UPDATE usuarios SET foto_perfil = :foto, atualizado_em = datetime('now') WHERE id = :id");
$stmt->execute(['foto' => $urlPublica, 'id' => $usuarioId]);

if (is_string($fotoAntiga) && $fotoAntiga !== '' && $fotoAntiga !== $urlPublica) {
    $caminhoAntigo = __DIR__ . '/../' . ltrim(str_replace('./', '', $fotoAntiga), '/');
    if (is_file($caminhoAntigo)) {
        @unlink($caminhoAntigo);
    }
}

json_response(['foto_perfil' => $urlPublica], 201);
