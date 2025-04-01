-- AlterTable
ALTER TABLE "JogoCacheta" ADD COLUMN     "valorPremiacao" DOUBLE PRECISION,
ADD COLUMN     "vencedorId" INTEGER,
ALTER COLUMN "valorEntrada" DROP DEFAULT;
