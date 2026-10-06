export const environment = {
  production: false,

  // --- Datos de tu App Registration en Azure AD (frontend) ---
  azureAd: {
    clientId: '5cd80da2-4880-475f-8d55-8e448ea3bf6d',
    tenantId: 'e6ec1370-abd7-4bb3-8deb-8834e6989a27',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
    apiScope: 'api://5cd80da2-4880-475f-8d55-8e448ea3bf6d/Pedidos',
  },

  // Ruta relativa: nginx (dentro del contenedor del frontend) la redirige
  // internamente al contenedor del backend. Así no dependes de la IP pública
  // ni de configurar CORS, y no hay que tocar esto si la IP de EC2 cambia.
  apiBaseUrl: '/api',
};
