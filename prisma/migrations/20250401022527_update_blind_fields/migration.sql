-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Torneio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyIn" REAL NOT NULL,
    "tempoBlind" INTEGER NOT NULL,
    "smallBlindInicial" TEXT NOT NULL,
    "bigBlindInicial" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIGURADO',
    "primeiroColocadoId" INTEGER,
    "segundoColocadoId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Torneio_primeiroColocadoId_fkey" FOREIGN KEY ("primeiroColocadoId") REFERENCES "Jogador" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Torneio_segundoColocadoId_fkey" FOREIGN KEY ("segundoColocadoId") REFERENCES "Jogador" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Torneio" ("bigBlindInicial", "buyIn", "createdAt", "data", "id", "nome", "primeiroColocadoId", "segundoColocadoId", "smallBlindInicial", "status", "tempoBlind", "updatedAt") SELECT "bigBlindInicial", "buyIn", "createdAt", "data", "id", "nome", "primeiroColocadoId", "segundoColocadoId", "smallBlindInicial", "status", "tempoBlind", "updatedAt" FROM "Torneio";
DROP TABLE "Torneio";
ALTER TABLE "new_Torneio" RENAME TO "Torneio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
