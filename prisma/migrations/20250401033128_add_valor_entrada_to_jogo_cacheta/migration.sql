/*
  Warnings:

  - Added the required column `valorEntrada` to the `JogoCacheta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JogoCacheta" ADD COLUMN     "valorEntrada" DOUBLE PRECISION NOT NULL DEFAULT 10.0;
