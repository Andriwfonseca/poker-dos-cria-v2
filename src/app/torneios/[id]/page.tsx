import { getTorneioById } from "@/lib/torneios";
import { getJogadores } from "@/lib/jogadores";
import TorneioEmAndamento from "@/components/torneio/TorneioEmAndamento";
import ConfiguracaoTorneio from "@/components/torneio/ConfiguracaoTorneio";
import TorneioFinalizado from "@/components/torneio/TorneioFinalizado";
import { notFound } from "next/navigation";

interface TorneioPageProps {
  params: {
    id: string;
  };
}

export default async function TorneioPage({ params }: TorneioPageProps) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const [torneio, jogadores] = await Promise.all([
    getTorneioById(id),
    getJogadores(),
  ]);

  if (!torneio) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{torneio.nome}</h1>

      {torneio.status === "EM_ANDAMENTO" ? (
        <TorneioEmAndamento torneio={torneio} jogadores={jogadores} />
      ) : torneio.status === "FINALIZADO" ? (
        <TorneioFinalizado torneio={torneio} />
      ) : (
        <ConfiguracaoTorneio torneio={torneio} jogadores={jogadores} />
      )}
    </div>
  );
}
