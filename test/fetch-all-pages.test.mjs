import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchAllPages } from '../src/lib/fetch-all-pages.ts';

test('carga todas las páginas y conserva filtros y autenticación', async (t) => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url: new URL(url), options });
    const page = Number(new URL(url).searchParams.get('pagina'));
    return Response.json({ payload: { datos: Array.from({ length: page === 3 ? 5 : 100 }, (_, i) => (page - 1) * 100 + i), paginasTotales: 3 } });
  });
  const data = await fetchAllPages('http://example.test/arriendos?estado=todos', 'test-token');
  assert.equal(data.length, 205);
  assert.equal(new Set(data).size, 205);
  assert.equal(requests.length, 3);
  for (const { url, options } of requests) {
    assert.equal(url.searchParams.get('estado'), 'todos');
    assert.equal(url.searchParams.get('limite'), '100');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.equal(options.cache, 'no-store');
  }
});

test('no presenta un listado parcial si falla una página', async (t) => {
  t.mock.method(globalThis, 'fetch', async url => new URL(url).searchParams.get('pagina') === '1'
    ? Response.json({ payload: { datos: [1], paginasTotales: 2 } })
    : new Response('', { status: 500 }));
  await assert.rejects(fetchAllPages('http://example.test/arriendos', 'token'), /500/);
});

test('tolera un listado vacío', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ payload: { datos: [], paginasTotales: 0 } }));
  assert.deepEqual(await fetchAllPages('http://example.test/arriendos', 'token'), []);
});
