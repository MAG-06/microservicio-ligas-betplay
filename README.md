# pronosticador-api

Microservicio en **TypeScript + Node + Fastify** que trae las ligas y partidos (con cuotas) de BetPlay
usando la API de Kambi, los limpia y los expone como JSON. Es la migracion del script `betplay_api.py`.

## Requisitos
- Node 20 o superior (`node -v`)

## Arrancar
```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev              # modo desarrollo, se reinicia solo al guardar
```
Probar en el navegador:
- http://127.0.0.1:8000/api/ligas
- http://127.0.0.1:8000/api/ligas?tipo=all&con_partidos=true
- http://127.0.0.1:8000/api/ligas/1000449742/partidos?dia=today

Los parametros son los mismos que tenia la version de Python
(`tipo`, `con_partidos`, `dia` = all | today | tomorrow | YYYY-MM-DD).

## Scripts
| Comando | Que hace |
|---|---|
| `npm run dev` | servidor en desarrollo (tsx watch) |
| `npm run build` | compila a `dist/` |
| `npm start` | corre lo compilado (`dist/server.js`) |
| `npm test` | corre los tests (no usan internet) |
| `npm run typecheck` | revisa tipos sin compilar |

## Arquitectura por capas
```
src/
├── server.ts              punto de entrada (levanta el servidor)
├── app.ts                 arma la app: conecta las piezas y registra rutas
├── config/env.ts          constantes: URL de Kambi, headers, TTL, zona horaria
├── routes/                PRESENTACION: recibe request, valida con Zod, llama al service
├── services/              NEGOCIO: filtrar por tipo/dia, ordenar, reglas
├── clients/kambi.client   INTEGRACION: unico que hace fetch a Kambi
├── mappers/               convierte JSON crudo de Kambi -> modelos limpios
├── cache/                 cache en memoria (cambiable por Redis)
├── errors/app-error.ts    errores con codigo HTTP (404, 400, 502)
└── types/                 interfaces (formato Kambi y modelos propios)
tests/                     mapper, services y API con datos falsos
```
Flujo: `route -> service -> client (Kambi)` y `service -> cache`, `service -> mapper`.
Cada capa solo habla con la de abajo.

## Como crecer
- **Otra casa de apuestas:** crea otro client + mapper que cumpla la interfaz `ProveedorCuotas`.
- **Redis:** crea una clase que implemente `Cache` y pasala en `buildApp({ cache })`.
- **Produccion:** cambia `origin: "*"` de CORS en `app.ts` por tu dominio.

## Equivalencias con el script de Python
| Python | TypeScript |
|---|---|
| `betplay_api.py` (todo junto) | separado en config / client / mapper / service / routes |
| `cached()` | `MemoryCache.getOrSet()` |
| `clasificar`, `_liga`, `aplanar_ligas` | `mappers/kambi.mapper.ts` |
| `parsear_partido`, `_inicio` | `mappers/kambi.mapper.ts` |
| `filtrar_dia` | `services/partido.service.ts` |
| `HTTPException` | `AppError` + error handler en `app.ts` |
| `@app.get(...)` | `app.get(...)` en `routes/` |
