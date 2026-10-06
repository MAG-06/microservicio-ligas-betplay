# microservicio-ligas-betplay

Microservicio en **TypeScript + Fastify** que consulta la API de Kambi (proveedor de cuotas de BetPlay), extrae todas las ligas de futbol disponibles, las clasifica y las guarda en una tabla `ligas_betplay` en Supabase.

Diseñado para ser llamado por **n8n** (o cualquier cron) via `POST /api/sync`.

## Requisitos
- Node 20 o superior

## Setup

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
```

Edita `.env` con tus credenciales:

```
PORT=8000
HOST=0.0.0.0
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-service-role-key
SYNC_TOKEN=un-token-secreto
```

## Uso

```bash
npm run dev    # desarrollo con hot-reload
npm run build  # compila a dist/
npm start      # produccion
```

### Endpoint

```
POST /api/sync
Authorization: Bearer <SYNC_TOKEN>
```

Respuesta:
```json
{ "sincronizadas": 165 }
```

## Tabla en Supabase

Tabla `ligas_betplay` con las columnas:

| Columna | Tipo | Descripcion |
|---|---|---|
| id | int8 (PK) | ID de la liga en Kambi |
| nombre | text | Nombre de la liga |
| pais | text (nullable) | Pais (null para torneos internacionales) |
| tipo | text | normal, femenino, juvenil_reservas, esports, especiales |
| partidos | int8 | Cantidad de eventos activos en BetPlay |
| url | text | Ruta de Kambi para consultar partidos de esa liga |

## Estructura

```
src/
  app.ts                       Punto de entrada + endpoint POST /api/sync
  config/env.ts                Configuracion (Kambi, Supabase, token)
  clients/kambi.client.ts      Fetch a la API de Kambi
  clients/supabase.client.ts   Cliente de Supabase
  mappers/kambi.mapper.ts      JSON crudo de Kambi -> lista de ligas
  services/sync.service.ts     Fetch + map + upsert a Supabase
  types/dominio.ts             Tipo Liga
  types/kambi.types.ts         Tipos del JSON de Kambi
```

## Flujo

```
n8n (cron diario) -> POST /api/sync -> Kambi API -> mapper -> upsert Supabase
```

## Deploy en Render

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Variables de entorno:** `SUPABASE_URL`, `SUPABASE_KEY`, `SYNC_TOKEN`, `HOST=0.0.0.0`
