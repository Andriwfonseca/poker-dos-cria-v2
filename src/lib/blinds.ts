export const BLINDS = [
  {
    small: "0,25",
    big: "0,50",
  },
  {
    small: "0,25",
    big: "0,75",
  },
  {
    small: "0,50",
    big: "1,00",
  },
  {
    small: "0,50",
    big: "1,50",
  },
  {
    small: "1,00",
    big: "2,00",
  },
  {
    small: "1,00",
    big: "3,00",
  },
  {
    small: "2,00",
    big: "4,00",
  },
  {
    small: "2,00",
    big: "5,00",
  },
  {
    small: "3,00",
    big: "6,00",
  },
  {
    small: "3,00",
    big: "7,00",
  },
  {
    small: "4,00",
    big: "8,00",
  },
  {
    small: "4,00",
    big: "9,00",
  },
  {
    small: "5,00",
    big: "10,00",
  },
];

// Função para formatar valor com vírgula para exibição (BRL)
export const formatarValorBRL = (valor: number): string => {
  return valor.toFixed(2).replace(".", ",");
};

// Função para converter valor com vírgula para número
export const converterValorParaNumero = (valor: string): number => {
  return parseFloat(valor.replace(",", "."));
};

// Função para converter número para valor com vírgula
export const converterNumeroParaValor = (numero: number): string => {
  return numero.toFixed(2).replace(".", ",");
};
