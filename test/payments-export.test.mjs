import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function handler(token, fetch) {
  const code = ts.transpileModule(readFileSync(new URL('../src/app/pagos/exportar/route.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  runInNewContext(code, {
    module, exports: module.exports, Response, URLSearchParams,
    process: { env: { NEXT_PUBLIC_API_URL: 'http://api.test' } }, fetch,
    require: name => {
      assert.equal(name, 'next/headers');
      return { cookies: async () => ({ get: () => token ? { value: token } : undefined }) };
    },
  });
  return module.exports.GET;
}
const request = (mes = '2026-09') => ({ nextUrl: new URL(`http://front.test/pagos/exportar?mes=${mes}`), signal: new AbortController().signal });

test('sin sesión no consulta la API', async () => {
  const response = await handler(null, () => assert.fail('No debe llamar a la API'))(request());
  assert.equal(response.status, 401);
});
test('rechaza un mes inválido antes de consultar la API', async () => {
  const response = await handler('token', () => assert.fail('No debe llamar a la API'))(request('2026-13'));
  assert.equal(response.status, 400);
});
test('transmite el PDF y mantiene el token fuera de la URL', async () => {
  const response = await handler('private-token', async (url, options) => {
    assert.equal(url, 'http://api.test/pagos/exportar?mes=2026-09&formato=pdf');
    assert.equal(options.headers.Authorization, 'Bearer private-token');
    assert.equal(options.cache, 'no-store');
    return new Response('%PDF-example', { headers: { 'Content-Type': 'application/pdf' } });
  })(request());
  assert.equal(await response.text(), '%PDF-example');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.match(response.headers.get('content-disposition'), /pagos-mensuales-2026-09.pdf/);
});
test('informa sesión vencida y errores de API sin descargar JSON como PDF', async () => {
  const response = await handler('token', async () => Response.json({ message: 'private detail' }, { status: 401 }))(request());
  assert.equal(response.status, 401);
  assert.match((await response.json()).message, /sesión terminó/);
});
test('rechaza una respuesta HTML aunque tenga código 200', async () => {
  const response = await handler('token', async () => new Response('<html>Login</html>', { headers: { 'Content-Type': 'text/html' } }))(request());
  assert.equal(response.status, 502);
});

test('descarga Excel con MIME y extensión correctos', async () => {
  const req = request();
  req.nextUrl.searchParams.set('formato', 'excel');
  const response = await handler('token', async (url) => {
    assert.match(url, /formato=excel/);
    return new Response('xlsx-data', { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } });
  })(req);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-disposition'), /pagos-mensuales-2026-09.xlsx/);
  assert.equal(await response.text(), 'xlsx-data');
});
