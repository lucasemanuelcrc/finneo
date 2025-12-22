// tipo de dado para quando for enviar o login
export interface DadosLogin {
  email: string;
  senhaSecreta: string;
}

// tipo de dados que o servidor vai receber
export interface RespostaLogin {
  tokenAcesso: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}