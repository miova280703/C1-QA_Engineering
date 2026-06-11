import { test, expect } from '@playwright/test';
import { TransferenciaPage } from '../pages/TransferenciaPage';
import { faker } from '@faker-js/faker';

test.describe('Lite Bank - Portal de Pagos - Transferencias', () => {
  let transferenciaPage: TransferenciaPage;

  test.beforeEach(async ({ page }) => {
    transferenciaPage = new TransferenciaPage(page);
    await transferenciaPage.navegar();
  });

  test('Envio transferencia', async () => {
    const cuentaAleatoria = faker.string.numeric(7);
    const montoAleatorio = faker.finance.amount({ min: 100, max: 5000, dec: 0 });
    await transferenciaPage.realizarTransferencia(cuentaAleatoria, montoAleatorio);
    await transferenciaPage.verificarMensajeAprobacion();
  });
});