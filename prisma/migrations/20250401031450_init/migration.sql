-- CreateTable
CREATE TABLE "Jogador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "chavePix" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Torneio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buyIn" DOUBLE PRECISION NOT NULL,
    "tempoBlind" INTEGER NOT NULL,
    "smallBlindInicial" TEXT NOT NULL,
    "bigBlindInicial" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIGURADO',
    "primeiroColocadoId" INTEGER,
    "segundoColocadoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Torneio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JogadorTorneio" (
    "id" SERIAL NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "torneioId" INTEGER NOT NULL,
    "reentradas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JogadorTorneio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JogoCacheta" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JogoCacheta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JogadorCacheta" (
    "id" SERIAL NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "pontos" INTEGER NOT NULL DEFAULT 10,
    "reentradas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JogadorCacheta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RodadaCacheta" (
    "id" SERIAL NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RodadaCacheta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RodadaJogadorCacheta" (
    "id" SERIAL NOT NULL,
    "rodadaId" INTEGER NOT NULL,
    "jogadorCachetaId" INTEGER NOT NULL,
    "acao" TEXT NOT NULL,
    "resultado" TEXT,
    "pontosAntes" INTEGER NOT NULL,
    "pontosApos" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RodadaJogadorCacheta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JogadorTorneio_jogadorId_torneioId_key" ON "JogadorTorneio"("jogadorId", "torneioId");

-- CreateIndex
CREATE UNIQUE INDEX "JogadorCacheta_jogadorId_jogoId_key" ON "JogadorCacheta"("jogadorId", "jogoId");

-- CreateIndex
CREATE UNIQUE INDEX "RodadaCacheta_jogoId_numero_key" ON "RodadaCacheta"("jogoId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "RodadaJogadorCacheta_rodadaId_jogadorCachetaId_key" ON "RodadaJogadorCacheta"("rodadaId", "jogadorCachetaId");

-- AddForeignKey
ALTER TABLE "Torneio" ADD CONSTRAINT "Torneio_primeiroColocadoId_fkey" FOREIGN KEY ("primeiroColocadoId") REFERENCES "Jogador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Torneio" ADD CONSTRAINT "Torneio_segundoColocadoId_fkey" FOREIGN KEY ("segundoColocadoId") REFERENCES "Jogador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JogadorTorneio" ADD CONSTRAINT "JogadorTorneio_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JogadorTorneio" ADD CONSTRAINT "JogadorTorneio_torneioId_fkey" FOREIGN KEY ("torneioId") REFERENCES "Torneio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JogadorCacheta" ADD CONSTRAINT "JogadorCacheta_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JogadorCacheta" ADD CONSTRAINT "JogadorCacheta_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "JogoCacheta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RodadaCacheta" ADD CONSTRAINT "RodadaCacheta_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "JogoCacheta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RodadaJogadorCacheta" ADD CONSTRAINT "RodadaJogadorCacheta_rodadaId_fkey" FOREIGN KEY ("rodadaId") REFERENCES "RodadaCacheta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RodadaJogadorCacheta" ADD CONSTRAINT "RodadaJogadorCacheta_jogadorCachetaId_fkey" FOREIGN KEY ("jogadorCachetaId") REFERENCES "JogadorCacheta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
