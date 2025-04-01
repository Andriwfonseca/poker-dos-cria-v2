-- AlterTable
ALTER TABLE "Torneio" ADD COLUMN "smallBlindInicial_old" INTEGER;
ALTER TABLE "Torneio" ADD COLUMN "bigBlindInicial_old" INTEGER;

-- Copia os valores antigos
UPDATE "Torneio" SET "smallBlindInicial_old" = "smallBlindInicial", "bigBlindInicial_old" = "bigBlindInicial";

-- Altera as colunas para texto
ALTER TABLE "Torneio" DROP COLUMN "smallBlindInicial";
ALTER TABLE "Torneio" DROP COLUMN "bigBlindInicial";
ALTER TABLE "Torneio" ADD COLUMN "smallBlindInicial" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Torneio" ADD COLUMN "bigBlindInicial" TEXT NOT NULL DEFAULT '';

-- Converte os valores antigos para texto
UPDATE "Torneio" SET 
    "smallBlindInicial" = CAST("smallBlindInicial_old" AS TEXT),
    "bigBlindInicial" = CAST("bigBlindInicial_old" AS TEXT);

-- Remove as colunas temporárias
ALTER TABLE "Torneio" DROP COLUMN "smallBlindInicial_old";
ALTER TABLE "Torneio" DROP COLUMN "bigBlindInicial_old"; 