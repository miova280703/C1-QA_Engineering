import {test, expect} from '@playwright/test';
import {TransferAPI} from '../api/Transfer';
import {StatusAPI} from '../api/Status';
import { faker } from '@faker-js/faker';

test.describe('Lite Bank - API de Transferencias', () => {
    let transferAPI: TransferAPI;
    let statusAPI: StatusAPI;

    test.beforeEach(async ({request}) => {
        transferAPI = new TransferAPI(request);
        statusAPI = new StatusAPI(request);
    });

    test('Realizar transferencia con datos válidos y verificar estado PENDIENTE', async () => {
        const cuentaAleatoria = faker.string.numeric(7);
        const montoAleatorio = faker.finance.amount({ min: 100, max: 5000, dec: 0 });
        const response = await transferAPI.realizarTransferencia(cuentaAleatoria, montoAleatorio, 'FAST_5', 1);
        expect(response.status()).toBe(202);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('status', 'PENDIENTE');
        await test.info().attach('testplan-api-transfer-datos válidos, estado PENDIENTE', {
            contentType: 'application/json',
            body: JSON.stringify({ responseBody }, null, 2)
        });
    });

    test('Realizar transferencia con datos válidos y verificar estado APROBADO', async () => {
        const cuentaAleatoria = faker.string.numeric(7);
        const montoAleatorio = faker.finance.amount({ min: 100, max: 5000, dec: 0 });
        const response = await transferAPI.realizarTransferencia(cuentaAleatoria, montoAleatorio, 'FAST_5', 1);
        expect(response.status()).toBe(202);
        const data = await response.json();
        expect(data).toHaveProperty('id');
        await test.info().attach('testplan-api-transfer-datos válidos, estado PENDIENTE', {
            contentType: 'application/json',
            body: JSON.stringify({ data }, null, 2)
        });

        await statusAPI.buscarTransferenciaAprobada(data.id, 30000);        
    });

    test('Realizar transferencia con monto negativo', async () => {
        const cuentaAleatoria = faker.string.numeric(7);
        const montoAleatorio = faker.finance.amount({ min: 100, max: 5000, dec: 0 });
        const response = await transferAPI.realizarTransferencia(cuentaAleatoria, -montoAleatorio, 'FAST_5', 1);
        expect(response.status()).toBe(202);
        const data = await response.json();
        expect(data).toHaveProperty('id');
        await test.info().attach('testplan-api-transfer-datos inválidos, estado PENDIENTE', {
            contentType: 'application/json',
            body: JSON.stringify({ data }, null, 2)
        });

        await test.info().attach('testplan-api-transfer-datos inválidos', {
            contentType: 'text/plain',
            body: "LA API NO DEBERÍA ACEPTAR MONTOS NEGATIVOS, PERO SI LO HACE"
        });

        await statusAPI.buscarTransferenciaAprobada(data.id, 30000); 
    });

    test('Realizar transferencia a cuenta no existente', async () => {
        const montoAleatorio = faker.finance.amount({ min: 100, max: 5000, dec: 0 });
        const response = await transferAPI.realizarTransferencia(0, montoAleatorio, 'FAST_5', 1);
        expect(response.status()).toBe(202);
        const data = await response.json();
        expect(data).toHaveProperty('id');
        await test.info().attach('testplan-api-transfer-datos inválidos, estado PENDIENTE', {
            contentType: 'application/json',
            body: JSON.stringify({ data }, null, 2)
        });

        await test.info().attach('testplan-api-transfer-datos inválidos', {
            contentType: 'text/plain',
            body: "LA API NO DEBERÍA ACEPTAR CUENTAS NO EXISTENTES, PERO SI LO HACE"
        });

        await statusAPI.buscarTransferenciaAprobada(data.id, 30000); 
    });
}); 
