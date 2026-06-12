import { APIRequestContext, APIResponse, expect, test } from '@playwright/test';

export class StatusAPI {
    private request: APIRequestContext;
    private readonly endpoint: string = 'http://localhost:3000/api/status/';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async buscarTransferencia(idTransferencia: string): Promise<APIResponse> {
        const response = await this.request.get(this.endpoint + idTransferencia);
        return response;
    }

    async buscarTransferenciaAprobada(idTransferencia: string, time: number): Promise<void> {
        await expect.poll(async () => {
            const response = await this.request.get(this.endpoint + idTransferencia);
            if (!response.ok()) throw new Error(`API Error: ${response.status()}`);
            const responseBody = await response.json();
            await test.info().attach('testplan-api-transfer, estado APROBADO', {
                contentType: 'application/json',
                body: JSON.stringify({ responseBody }, null, 2)
            });
            return responseBody.status;
        }, {
            timeout: time,
            intervals: [300],
            message: `La transferencia con ID ${idTransferencia} no alcanzó el estado APROBADO en el tiempo esperado`
        }).toBe('APROBADO');
    }
}