import { APIRequestContext, APIResponse } from '@playwright/test';

export class TransferAPI {
    private request: APIRequestContext;
    private readonly endpoint: string = 'http://localhost:3000/api/transfer';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async realizarTransferencia(cuentaDestino: any, monto: any, simulacion: String, speed: number): Promise<APIResponse> {
        const response = await this.request.post(this.endpoint, {
            data: {
                target: cuentaDestino,
                amount: monto,
                simulationProfile: simulacion,
                speedFactor: speed
            }
        });
        return response;
    }
}