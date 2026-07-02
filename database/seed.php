<?php
declare(strict_types=1);

function seed_database(PDO $pdo): void
{
    $veiculos = [
        ['marca' => 'Porsche', 'modelo' => '718 Spyder', 'ano' => 2020, 'preco' => 3000000.00, 'local' => 'Trindade'],
        ['marca' => 'Porsche', 'modelo' => '718 Spyder', 'ano' => 2020, 'preco' => 3000000.00, 'local' => 'Conceição do Araguaia'],
        ['marca' => 'Porsche', 'modelo' => '718 Spyder', 'ano' => 2020, 'preco' => 3000000.00, 'local' => 'Goiânia'],
        ['marca' => 'Porsche', 'modelo' => '718 Spyder', 'ano' => 2020, 'preco' => 3000000.00, 'local' => 'Joinville'],
    ];

    $inserirVeiculo = $pdo->prepare(
        'INSERT INTO veiculos (marca, modelo, ano_fabricacao, preco, localizacao, potencia_rpm, velocidade_maxima_kmh, aceleracao_0_100, avaliacao_media)
         VALUES (:marca, :modelo, :ano, :preco, :localizacao, 6500, 350, 4.4, 4.5)'
    );
    $inserirImagem = $pdo->prepare(
        'INSERT INTO veiculo_imagens (veiculo_id, url, tipo, ordem) VALUES (:veiculo_id, :url, :tipo, :ordem)'
    );

    foreach ($veiculos as $v) {
        $inserirVeiculo->execute([
            'marca' => $v['marca'],
            'modelo' => $v['modelo'],
            'ano' => $v['ano'],
            'preco' => $v['preco'],
            'localizacao' => $v['local'],
        ]);
        $veiculoId = (int) $pdo->lastInsertId();

        $inserirImagem->execute([
            'veiculo_id' => $veiculoId,
            'url' => './assets/images/2020-porsche-718-spider.png',
            'tipo' => 'capa',
            'ordem' => 0,
        ]);
        $inserirImagem->execute([
            'veiculo_id' => $veiculoId,
            'url' => './assets/images/cars/prisma-2010-teste/',
            'tipo' => '360',
            'ordem' => 0,
        ]);
    }
}
