CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT,
    tipo TEXT NOT NULL DEFAULT 'cliente' CHECK (tipo IN ('cliente','admin')),
    provedor TEXT NOT NULL DEFAULT 'local' CHECK (provedor IN ('local','google','facebook','apple')),
    provedor_id TEXT,
    foto_perfil TEXT,
    telefone TEXT,
    cpf TEXT,
    cep TEXT,
    rua TEXT,
    numero TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    criado_em TEXT NOT NULL DEFAULT (datetime('now')),
    atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE veiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendedor_id INTEGER REFERENCES usuarios(id),
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    ano_fabricacao INTEGER NOT NULL,
    preco REAL NOT NULL,
    localizacao TEXT NOT NULL,
    potencia_rpm INTEGER,
    velocidade_maxima_kmh INTEGER,
    aceleracao_0_100 REAL,
    cor TEXT,
    quilometragem INTEGER,
    combustivel TEXT CHECK (combustivel IN ('gasolina','etanol','flex','diesel','eletrico','hibrido')),
    cambio TEXT CHECK (cambio IN ('manual','automatico')),
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel','reservado','vendido')),
    avaliacao_media REAL NOT NULL DEFAULT 0,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE veiculo_imagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    veiculo_id INTEGER NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'galeria' CHECK (tipo IN ('capa','galeria','360')),
    ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE carrinho_itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    veiculo_id INTEGER NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    adicionado_em TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (usuario_id, veiculo_id)
);

CREATE TABLE pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    veiculo_id INTEGER NOT NULL REFERENCES veiculos(id),
    valor_total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','pago','cancelado')),
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
