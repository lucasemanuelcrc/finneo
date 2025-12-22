import axios from "axios";

// aqui definimos o endereço base da nossa api, que vem das variáveis de ambiente
const urlBase = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: urlBase,
  // tempo máximo que o app vai esperar por uma resposta (10 segundos)
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// NTERCEPTADORES

// interceptador de requisição: acontece antes do pedido sair do celular
api.interceptors.request.use(
  (config) => {
    // aqui verificamos se existe um token salvo no navegador
    const token = typeof window !== 'undefined' ? localStorage.getItem('finneo_token') : null;

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (erro) => {
    // se der erro na hora de montar o pedido
    return Promise.reject(erro);
  }
);

// interceptador de resposta: acontece quando a resposta volta do servidor
api.interceptors.response.use(
  (resposta) => {
    // se der tudo certo, apenas entrega os dados
    return resposta;
  },
  (erro) => {

    if (erro.response && erro.response.status === 401) {
      // lógica para deslogar o usuário ou renovar o token
      // console.log("Sessão expirada, redirecionando para login...");
    }
    return Promise.reject(erro);
  }
);