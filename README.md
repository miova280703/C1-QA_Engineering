# C1-QA_Engineering
QA Engineering: TestOps, Observabilidad y Arquitectura de Pruebas
<<<<<<< Updated upstream
 
=======

**Resumen**: Este repositorio contiene una aplicación de ejemplo (backend + frontend), infraestructura mínima en Docker Compose (Kafka) y una suite de pruebas E2E con Playwright ubicada en `qa-automation`. El objetivo es proporcionar un entorno reproducible para practicar pruebas de integración y automatización.

**Requisitos**:
- Node.js v18+ y `npm`
- Docker y Docker Compose (para Kafka y servicios asociados)
- Tener permisos para ejecutar Docker en la máquina

**Estructura relevante**:
- [backend](backend): servidor simulado y worker
- [frontend](frontend): aplicación React + Vite
- [qa-automation](qa-automation): pruebas Playwright, configuraciones y reportes

**1) Levantar la infraestructura (Kafka)**
Recomendado: usar Docker Compose desde la raíz del repositorio.

```bash
# desde la raíz del repo
docker compose up -d
```

Esto iniciará los servicios definidos en `docker-compose.yml`:
- Broker Kafka en el puerto `9092`
- Kafka UI en `8081`

Si necesitas destruirla:

```bash
docker compose down
```

**2) Backend**
```bash
cd backend
npm install
# En una terminal: iniciar el servidor HTTP
npm run start-server
# En otra terminal: iniciar el worker (simula consumidores/procesos asincrónicos)
npm run start-worker
```

Notas:
- El backend usa Kafka (configurado por `docker-compose.yml`). Asegúrate de que Kafka esté arriba antes de arrancar el backend.

**3) Frontend**
```bash
cd frontend
npm install
# Modo desarrollo (Vite)
npm run dev
# Para ver una versión de producción local
npm run build
npm run preview
```

Vite suele servir en el puerto `5173` por defecto.

**4) QA Automation — Playwright**
```bash
cd qa-automation
npm install
# Instalar navegadores y dependencias necesarias (CI-friendly)
npm run install:browsers:ci
# Ejecutar pruebas (headless)
npm test
# Ejecutar pruebas en modo interactivo/visual
npm run test:headed
# Mostrar el reporte HTML generado (si existe)
npm run test:report
```

Dónde están las pruebas:
- [qa-automation/tests](qa-automation/tests)
- API helpers: [qa-automation/api](qa-automation/api)

El reporte HTML de Playwright se guarda en `qa-automation/playwright-report`. Para abrirlo manualmente, abre `qa-automation/playwright-report/index.html` en el navegador.

**Comandos útiles rápidos**
- Levantar infra, backend y frontend (ejemplo):

```bash
# desde la raíz
docker compose up -d
cd backend && npm install && npm run start-server &
cd frontend && npm install && npm run dev &
```

- Ejecutar solo la suite de pruebas:

```bash
cd qa-automation
npm install
npm run install:browsers:ci
npm test
```

**Solución de problemas (troubleshooting)**
- Si las pruebas fallan por conexión a Kafka o topics no existentes, asegúrate de haber ejecutado `docker compose up -d` y esperar que el servicio `kafka-init-topic` cree el topic `transferencias-creadas`.
- Si Playwright no encuentra navegadores, ejecuta `npm run install:browsers:ci` en `qa-automation`.
- Logs:
	- Backend: ver la salida de `npm run start-server` y `npm run start-worker` en `backend`.
	- Kafka: `docker logs qa-kafka-broker` y `docker logs qa-kafka-init-topic`.

**Ejecución en CI**
- Asegúrate de levantar los servicios que necesites (por ejemplo con Docker) y ejecutar en el job estos pasos básicos:

```bash
# ejemplo en job CI
docker compose up -d
cd qa-automation
npm ci
npm run install:browsers:ci
npm test
```

**Dónde mirar cuando termine**
- Reportes Playwright: `qa-automation/playwright-report/index.html`
- Resultados de pruebas unitarias / logs: revisar las salidas en las respectivas carpetas y terminales.

Si quieres, puedo:
- Ejecutar los comandos de instalación y pruebas en tu entorno ahora (si me autoriza a correr comandos).\
- O bien añadir un script `make` o `scripts/ci.sh` para automatizar los pasos.

---
Última actualización: instrucciones básicas para instalar, ejecutar servicios y correr pruebas E2E con Playwright.
>>>>>>> Stashed changes
