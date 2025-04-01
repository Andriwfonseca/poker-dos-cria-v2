import Link from "next/link";
import { getTorneios } from "@/lib/torneios";

export default async function TorneiosPage() {
  const torneios = await getTorneios();

  // Função para retornar o ícone e a cor de acordo com o status do torneio
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "FINALIZADO":
        return {
          icon: <i className="fas fa-check-circle mr-1"></i>,
          color: "bg-green-600",
          textColor: "text-green-800",
          bgColor: "bg-green-100",
          label: "Finalizado",
        };
      case "EM_ANDAMENTO":
        return {
          icon: <i className="fas fa-play-circle mr-1"></i>,
          color: "bg-blue-600",
          textColor: "text-blue-800",
          bgColor: "bg-blue-100",
          label: "Em Andamento",
        };
      default:
        return {
          icon: <i className="fas fa-cog mr-1"></i>,
          color: "bg-gray-600",
          textColor: "text-gray-800",
          bgColor: "bg-gray-100",
          label: "Configurado",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Torneios</h1>
        <Link
          href="/torneios/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <i className="fas fa-plus-circle mr-2"></i> Novo Torneio
        </Link>
      </div>

      {torneios.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Nenhum torneio criado.</p>
          <p className="mt-2">Clique em "Novo Torneio" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {torneios.map((torneio) => {
            const totalJogadores = torneio.jogadores.length;
            const totalReentradas = torneio.jogadores.reduce(
              (sum, jt) => sum + jt.reentradas,
              0
            );
            const valorTotal =
              (totalJogadores + totalReentradas) * torneio.buyIn;
            const statusInfo = getStatusInfo(torneio.status);

            // Verificar se há vencedores para mostrar troféus
            const temVencedores =
              torneio.status === "FINALIZADO" && torneio.primeiroColocadoId;

            return (
              <div
                key={torneio.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`p-4 text-white ${statusInfo.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold truncate">
                        {torneio.nome}
                      </h2>
                      <p className="text-sm opacity-90 flex items-center">
                        <i className="fas fa-calendar-alt mr-1"></i>
                        {new Date(torneio.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500 flex items-center justify-center">
                        <i className="fas fa-coins text-yellow-500 mr-1"></i>{" "}
                        Buy-in
                      </p>
                      <p className="font-semibold">
                        R$ {torneio.buyIn.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500 flex items-center justify-center">
                        <i className="fas fa-money-bill-wave text-green-500 mr-1"></i>{" "}
                        Total
                      </p>
                      <p className="font-semibold">
                        R$ {valorTotal.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500 flex items-center justify-center">
                        <i className="fas fa-users text-blue-500 mr-1"></i>{" "}
                        Jogadores
                      </p>
                      <p className="font-semibold">{totalJogadores}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500 flex items-center justify-center">
                        <i className="fas fa-redo text-red-500 mr-1"></i>{" "}
                        Reentradas
                      </p>
                      <p className="font-semibold">{totalReentradas}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded mb-4">
                    <p className="text-xs text-gray-500 flex items-center">
                      <i className="fas fa-dice mr-1 text-blue-600"></i> Blinds
                      Iniciais
                    </p>
                    <p className="font-semibold text-sm">
                      SB: {torneio.smallBlindInicial} / BB:{" "}
                      {torneio.bigBlindInicial}
                    </p>
                  </div>

                  {temVencedores && (
                    <div className="bg-yellow-50 p-3 rounded mb-4">
                      <p className="text-xs text-gray-500 flex items-center">
                        <i className="fas fa-trophy text-yellow-500 mr-1"></i>{" "}
                        Vencedores
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm flex items-center">
                          <i className="fas fa-trophy text-yellow-500 mr-1"></i>
                          {torneio.primeiroColocado?.nome || "N/A"}
                        </span>
                        <span className="font-semibold text-sm flex items-center">
                          <i className="fas fa-medal text-gray-500 mr-1"></i>
                          {torneio.segundoColocado?.nome || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <Link
                      href={`/torneios/${torneio.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                      <i className="fas fa-eye mr-2"></i> Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
