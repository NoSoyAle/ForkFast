# ForkFast-FF

Sistema básico de restaurante (Productos, Inventario, Clientes, Órdenes) para el
Encargo de Evaluación Parcial N°1 — DSY1107 Desarrollo Cloud Native I.

Arquitectura:

```
Angular (MSAL) → login con Azure AD → obtiene JWT
      ↓
AWS API Gateway (protege y enruta)
      ↓
Spring Boot en EC2 (valida el JWT con filtro de seguridad, conecta a BD cloud)
```

## Estructura

```
ForkFast-FF/
├── backend/     Spring Boot (Java 17, Maven) - microservicio REST
└── frontend/    Angular 17 + MSAL
```

## 1. Backend (Spring Boot)

Requisitos: Java 17, Maven.

```bash
cd backend
mvn spring-boot:run
```

Por defecto corre en `http://localhost:8080` con una base de datos H2 en memoria
(perfecta para desarrollar sin instalar nada). La consola H2 está en
`http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:forkfastdb`, usuario `sa`).

Antes de conectar el frontend real, edita `src/main/resources/application.yml`:

```yaml
azure:
  ad:
    issuer-uri: https://login.microsoftonline.com/{tenant-id}/v2.0
    audience: api://{client-id-de-la-api}
```

Reemplaza `{tenant-id}` por el Directory (tenant) ID de tu App Registration en
Azure Portal, y `{client-id-de-la-api}` por el Application ID URI que le des a tu
API al "Exponer una API" (Expose an API) en Azure AD.

Cuando quieras usar una base de datos cloud real (por ejemplo RDS Postgres),
reemplaza el bloque `spring.datasource` por tus credenciales reales.

## 2. Frontend (Angular + MSAL)

Requisitos: Node.js 18+, npm.

```bash
cd frontend
npm install
npm start
```

Corre en `http://localhost:4200`.

Antes de iniciar sesión, edita `src/environments/environment.ts`:

```ts
azureAd: {
  clientId: '{client-id-de-la-app-frontend}',
  tenantId: '{tenant-id}',
  redirectUri: 'http://localhost:4200',
  postLogoutRedirectUri: 'http://localhost:4200',
  apiScope: 'api://{client-id-de-la-api}/access_as_user',
},
```

Estos valores salen de dos App Registrations en Azure AD: una para el frontend
(SPA, con el redirect URI de arriba) y otra para el backend/API (la que expone
el scope `access_as_user`).

## 2.5. Con Docker (recomendado para EC2)

Esto evita instalar Java, Node, Maven o nginx a mano en la instancia — solo necesitas Docker.
Además, el frontend usa nginx para redirigir `/api` al backend internamente, así que **no
hay que preocuparse de CORS ni de que cambie la IP pública**.

**Instalar Docker en Amazon Linux 2023:**

```bash
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
# cierra sesión y vuelve a conectarte para que el grupo "docker" tome efecto
```

**Instalar el plugin de Docker Compose:**

```bash
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
docker compose version
```

**Levantar todo con un comando** (desde la raíz del proyecto, donde está `docker-compose.yml`):

```bash
docker compose up -d --build
```

Esto compila ambas imágenes y deja corriendo:
- Backend en el puerto `8080`
- Frontend (nginx) en el puerto `80`, con `/api` redirigido internamente al backend

**Comandos útiles:**

```bash
docker compose ps              # ver estado de los contenedores
docker compose logs -f backend # logs del backend en vivo
docker compose logs -f frontend
docker compose down            # detener y eliminar los contenedores
docker compose up -d --build   # reconstruir después de cambios en el código
```

⚠️ En un `t3.micro` (1GB RAM), compilar la imagen del frontend (`npm install` dentro del
contenedor) puede quedarse sin memoria si no tienes swap activo. Revisa la sección de swap
más abajo antes de correr `docker compose up --build` por primera vez.

## 3. Endpoints del backend

Todos bajo `/api`, protegidos y requieren el JWT de Azure AD en el header
`Authorization: Bearer {token}` (MSAL lo agrega automático vía el interceptor):

- `GET/POST/PUT/DELETE /api/productos`
- `GET/POST/PUT/DELETE /api/inventarios`
- `GET/POST/PUT/DELETE /api/clientes`
- `GET/POST/PUT/DELETE /api/ordenes`

## 4. Siguientes pasos para cumplir el encargo completo

- [ ] Dividir el backend en varios microservicios (por ejemplo: `productos-service`,
      `clientes-service`, `ordenes-service`) en vez de un solo módulo — la pauta
      pide explícitamente "varios microservicios".
- [ ] Agregar el componente BFF que valida el JWT antes de reenviar al API Gateway
      (indicador con 40% de ponderación en la pauta).
- [ ] Desplegar el/los backend(s) en instancias EC2.
- [ ] Configurar AWS API Gateway delante de las instancias EC2.
- [ ] Conectar a una base de datos cloud real (RDS) en vez de H2.
- [ ] Crear los dos App Registrations en Azure AD (frontend SPA + API) y completar
      los placeholders en `environment.ts` y `application.yml`.
- [ ] Subir frontend y backend como repositorios GitHub separados, cada uno con
      su `.gitignore` correspondiente (ya incluidos en este starter).

## Notas de recursos (8GB disco / 1GB RAM)

Ver sección "Liberar puertos y recursos" en la respuesta del chat para instrucciones
sobre cómo liberar puertos ocupados (8080, 4200) en tu máquina local.
