-- CreateTable
CREATE TABLE "Jogador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "chavePix" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Torneio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyIn" REAL NOT NULL,
    "tempoBlind" INTEGER NOT NULL,
    "smallBlindInicial" INTEGER NOT NULL,
    "bigBlindInicial" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIGURADO',
    "primeiroColocadoId" INTEGER,
    "segundoColocadoId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Torneio_primeiroColocadoId_fkey" FOREIGN KEY ("primeiroColocadoId") REFERENCES "Jogador" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Torneio_segundoColocadoId_fkey" FOREIGN KEY ("segundoColocadoId") REFERENCES "Jogador" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JogadorTorneio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jogadorId" INTEGER NOT NULL,
    "torneioId" INTEGER NOT NULL,
    "reentradas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JogadorTorneio_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JogadorTorneio_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES "Torneio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "JogadorTorneio_jogadorId_torneioId_key" ON "JogadorTorneio"("jogadorId", "torneioId");
