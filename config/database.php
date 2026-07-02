<?php
declare(strict_types=1);

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dbDir = __DIR__ . '/../database';
    $dbFile = $dbDir . '/mcars.sqlite';
    $isNew = !file_exists($dbFile);

    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON');

    if ($isNew) {
        $pdo->exec((string) file_get_contents($dbDir . '/schema.sql'));
        require_once $dbDir . '/seed.php';
        seed_database($pdo);
    }

    migrar_colunas_novas($pdo);

    return $pdo;
}

function migrar_colunas_novas(PDO $pdo): void
{
    $colunasExistentes = array_column($pdo->query('PRAGMA table_info(usuarios)')->fetchAll(), 'name');
    $colunasNovas = ['cpf', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'];

    foreach ($colunasNovas as $coluna) {
        if (!in_array($coluna, $colunasExistentes, true)) {
            $pdo->exec("ALTER TABLE usuarios ADD COLUMN {$coluna} TEXT");
        }
    }
}
