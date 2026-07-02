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
    $colunasUsuarios = array_column($pdo->query('PRAGMA table_info(usuarios)')->fetchAll(), 'name');
    foreach (['cpf', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'] as $coluna) {
        if (!in_array($coluna, $colunasUsuarios, true)) {
            $pdo->exec("ALTER TABLE usuarios ADD COLUMN {$coluna} TEXT");
        }
    }
    if (!in_array('tipo', $colunasUsuarios, true)) {
        $pdo->exec("ALTER TABLE usuarios ADD COLUMN tipo TEXT NOT NULL DEFAULT 'cliente'");
    }

    $colunasVeiculos = array_column($pdo->query('PRAGMA table_info(veiculos)')->fetchAll(), 'name');
    foreach (['cor', 'combustivel', 'cambio'] as $coluna) {
        if (!in_array($coluna, $colunasVeiculos, true)) {
            $pdo->exec("ALTER TABLE veiculos ADD COLUMN {$coluna} TEXT");
        }
    }
    if (!in_array('quilometragem', $colunasVeiculos, true)) {
        $pdo->exec('ALTER TABLE veiculos ADD COLUMN quilometragem INTEGER');
    }

    $totalAdmins = (int) $pdo->query("SELECT COUNT(*) FROM usuarios WHERE tipo = 'admin'")->fetchColumn();
    if ($totalAdmins === 0) {
        $stmt = $pdo->prepare(
            "INSERT OR IGNORE INTO usuarios (nome, email, senha_hash, tipo) VALUES ('Administrador', 'admin@mcars.com', :senha_hash, 'admin')"
        );
        $stmt->execute(['senha_hash' => password_hash('admin123', PASSWORD_DEFAULT)]);
    }
}
