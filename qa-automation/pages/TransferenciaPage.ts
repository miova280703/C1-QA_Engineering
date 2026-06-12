import {Locator, Page, expect, test} from '@playwright/test';

export class TransferenciaPage {  
    readonly page: Page;
    readonly inputCuentaDestino: Locator;
    readonly inputMonto: Locator;
    readonly btnEnviar: Locator;
    readonly divMensaje: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputCuentaDestino = page.getByRole('textbox', { name: 'Cuenta Destino (Ej: 98765)', exact: true });
        this.inputMonto = page.getByPlaceholder('Monto ($)', { exact: true });
        this.btnEnviar = page.getByRole('button', { name: 'Enviar Transferencia', exact: true });
        this.divMensaje = page.locator('#status-box');
    }

    async navegar() {
        await this.page.goto('http://localhost:5173/');
    }

    async realizarTransferencia(cuentaDestino: string, monto: string){
        await this.inputCuentaDestino.fill(cuentaDestino);
        await this.inputMonto.fill(monto);
        await this.btnEnviar.click();
        const screenshot = await this.page.screenshot();
        await test.info().attach('evidencia-transferencia', {
            body: screenshot,
            contentType: 'image/png',
        });
    }

    async verificarMensajeAprobacion() {
        await expect(this.divMensaje).toHaveText('Estado: APROBADO', { timeout: 10000 });
        const screenshot = await this.page.screenshot();
        await test.info().attach('evidencia-transferencia-estado', {
            body: screenshot,
            contentType: 'image/png',
        });
    }
} 