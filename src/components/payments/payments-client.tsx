"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { savePayment, getPaymentHistory } from "@/app/pagos/actions";
import type { MonthlyPayment, PaymentInput, PaymentPage } from "./types";

function dateLabel(date: string | null) {
  return date ? date.split("-").reverse().join("/") : "—";
}
function PaymentStatus({ paid, date }: { paid: boolean; date: string | null }) {
  return (
    <div>
      <span
        className={
          paid
            ? "font-medium text-green-700 dark:text-green-400"
            : "font-medium text-amber-700 dark:text-amber-400"
        }
      >
        {paid ? "Pagado" : "Pendiente"}
      </span>
      <div className="text-xs text-muted-foreground">{dateLabel(date)}</div>
    </div>
  );
}

export function PaymentsClient({
  mes,
  buscar,
  estado,
  data,
  error,
}: {
  mes: string;
  buscar: string;
  estado: string;
  data?: PaymentPage;
  error?: string;
}) {
  const [editing, setEditing] = useState<MonthlyPayment | null>(null);
  const [history, setHistory] = useState<MonthlyPayment | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  async function downloadReport(formato: "pdf" | "excel") {
    if (downloading) return;
    setDownloading(true);
    setDownloadError("");
    try {
      const response = await fetch(
        `/pagos/exportar?${new URLSearchParams({ mes, formato })}`,
      );
      if (
        !response.ok ||
        !response.headers
          .get("content-type")
          ?.includes(
            formato === "excel"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              : "application/pdf",
          )
      ) {
        const result = await response.json().catch(() => null);
        throw new Error(
          result?.message ||
            "No se pudo descargar el informe. Comprueba tu sesión.",
        );
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `pagos-mensuales-${mes}.${formato === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "No se pudo descargar el informe.",
      );
    } finally {
      setDownloading(false);
    }
  }
  function pageHref(pagina: number) {
    return `/pagos?${new URLSearchParams({ mes, buscar, estado, pagina: String(pagina) })}`;
  }
  return (
    <div className="space-y-4">
      <form
        action="/pagos"
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4"
      >
        <label className="space-y-1 text-sm">
          Mes
          <Input
            aria-label="Mes"
            name="mes"
            type="month"
            required
            defaultValue={mes}
            min="1900-01"
            max="9998-12"
          />
        </label>
        <label className="min-w-48 flex-1 space-y-1 text-sm">
          Buscar
          <Input
            name="buscar"
            defaultValue={buscar}
            maxLength={100}
            placeholder="Arrendatario, RUT, local o propiedad"
          />
        </label>
        <label className="space-y-1 text-sm">
          Estado
          <select
            name="estado"
            defaultValue={estado}
            className="block h-10 rounded-md border bg-background px-3"
          >
            <option value="todos">Todos</option>
            <option value="pendientes">Con pagos pendientes</option>
            <option value="pagados">Ambos pagados</option>
          </select>
        </label>
        <Button type="submit">Consultar</Button>
      </form>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={downloading || !!error}
          onClick={() => downloadReport("pdf")}
        >
          {downloading ? "Generando informe…" : "Descargar informe (PDF)"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={downloading || !!error}
          onClick={() => downloadReport("excel")}
        >
          Descargar informe (Excel)
        </Button>
        <span className="text-xs text-muted-foreground">
          Incluye todos los pagos realizados y pendientes de {mes}, sin
          limitarse a la búsqueda ni a esta página.
        </span>
      </div>
      {downloadError && (
        <p role="alert" className="text-sm text-destructive">
          {downloadError}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Una fila por arriendo. Se incluyen contratos cuyas fechas abarcan el
        mes, aunque estén inactivos. “Pendiente” significa que el pago no está
        registrado.
      </p>
      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive p-4 text-destructive"
        >
          {error}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {[
                    "Arrendatario / Local",
                    "Arriendo",
                    "Gastos comunes",
                    "Comentarios",
                    "Acciones",
                  ].map((label) => (
                    <th key={label} className="p-3 text-left">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.datos.map((row) => (
                  <tr key={row.id_arriendo} className="border-t align-top">
                    <td className="min-w-56 p-3">
                      <div className="font-medium">
                        {row.nombre_arrendatario}
                      </div>
                      <div>{row.rut_arrendatario}</div>
                      <div className="text-muted-foreground">
                        {row.nombre_local} · {row.direccion_propiedad}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Arriendo #{row.id_arriendo}
                        {row.arriendo_activo === false ? " · Inactivo" : ""}
                        {!row.id_pago ? " · Sin registro guardado" : ""}
                      </div>
                    </td>
                    <td className="p-3">
                      <PaymentStatus
                        paid={row.arriendo_pagado}
                        date={row.fecha_pago_arriendo}
                      />
                    </td>
                    <td className="p-3">
                      <PaymentStatus
                        paid={row.gastos_comunes_pagados}
                        date={row.fecha_pago_gastos_comunes}
                      />
                    </td>
                    <td className="min-w-40 max-w-xs whitespace-pre-wrap break-words p-3">
                      {row.comentarios || "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => setEditing(row)}>
                          {row.id_pago ? "Editar" : "Registrar"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setHistory(row)}
                        >
                          Historial
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!data?.datos.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No hay arriendos para este mes y estos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span>
              {data?.total ?? 0} arriendos · Página {data?.pagina ?? 1} de{" "}
              {Math.max(1, data?.paginasTotales ?? 1)}
            </span>
            <div className="flex gap-3">
              {data && data.pagina > 1 && (
                <Link className="underline" href={pageHref(data.pagina - 1)}>
                  Anterior
                </Link>
              )}
              {data && data.pagina < data.paginasTotales && (
                <Link className="underline" href={pageHref(data.pagina + 1)}>
                  Siguiente
                </Link>
              )}
            </div>
          </div>
        </>
      )}
      {editing && (
        <PaymentEditor row={editing} onClose={() => setEditing(null)} />
      )}
      {history && (
        <PaymentHistory row={history} onClose={() => setHistory(null)} />
      )}
    </div>
  );
}

function PaymentEditor({
  row,
  onClose,
}: {
  row: MonthlyPayment;
  onClose: () => void;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<PaymentInput>({
    mes: row.mes,
    arriendo_pagado: row.arriendo_pagado,
    fecha_pago_arriendo: row.fecha_pago_arriendo,
    gastos_comunes_pagados: row.gastos_comunes_pagados,
    fecha_pago_gastos_comunes: row.fecha_pago_gastos_comunes,
    comentarios: row.comentarios,
    version: row.version,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await savePayment(row.id_arriendo, draft);
      if (result.error) setError(result.error);
      else {
        router.refresh();
        onClose();
      }
    } catch {
      setError("No se pudo guardar. Intenta nuevamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pago de {row.mes}</DialogTitle>
          <DialogDescription>
            {row.nombre_arrendatario} · {row.nombre_local} · Arriendo #
            {row.id_arriendo}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <fieldset disabled={busy} className="space-y-4">
            <div className="space-y-2 rounded border p-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.arriendo_pagado}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      arriendo_pagado: e.target.checked,
                      fecha_pago_arriendo: e.target.checked
                        ? draft.fecha_pago_arriendo
                        : null,
                    })
                  }
                />{" "}
                Arriendo pagado
              </label>
              <label className="block text-sm">
                Fecha de pago del arriendo
                <Input
                  type="date"
                  required={draft.arriendo_pagado}
                  disabled={!draft.arriendo_pagado}
                  value={draft.fecha_pago_arriendo ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      fecha_pago_arriendo: e.target.value || null,
                    })
                  }
                />
              </label>
            </div>
            <div className="space-y-2 rounded border p-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.gastos_comunes_pagados}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      gastos_comunes_pagados: e.target.checked,
                      fecha_pago_gastos_comunes: e.target.checked
                        ? draft.fecha_pago_gastos_comunes
                        : null,
                    })
                  }
                />{" "}
                Gastos comunes pagados
              </label>
              <label className="block text-sm">
                Fecha de pago de gastos comunes
                <Input
                  type="date"
                  required={draft.gastos_comunes_pagados}
                  disabled={!draft.gastos_comunes_pagados}
                  value={draft.fecha_pago_gastos_comunes ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      fecha_pago_gastos_comunes: e.target.value || null,
                    })
                  }
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Las fechas pueden corresponder a otro mes, por ejemplo si el pago
              fue anticipado o atrasado. Al desmarcar un pago se borra su fecha.
            </p>
            <label className="block space-y-1 text-sm">
              Comentarios
              <Textarea
                maxLength={2000}
                value={draft.comentarios}
                onChange={(e) =>
                  setDraft({ ...draft, comentarios: e.target.value })
                }
                placeholder="Observaciones del mes"
              />
            </label>
          </fieldset>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PaymentHistory({
  row,
  onClose,
}: {
  row: MonthlyPayment;
  onClose: () => void;
}) {
  const [pagina, setPagina] = useState(1);
  const [data, setData] = useState<PaymentPage>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    let active = true;
    setBusy(true);
    setError("");
    getPaymentHistory(row.id_arriendo, pagina)
      .then((result) => {
        if (active) {
          setData(result.payload);
          setError(result.error ?? "");
        }
      })
      .catch(() => {
        if (active) setError("No se pudo cargar el historial.");
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [row.id_arriendo, pagina]);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial de pagos</DialogTitle>
          <DialogDescription>
            {row.nombre_arrendatario} · Arriendo #{row.id_arriendo}. Se muestran
            los meses guardados; un mes ausente no acredita pago.
          </DialogDescription>
        </DialogHeader>
        {busy ? (
          <p role="status">Cargando historial…</p>
        ) : error ? (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        ) : (
          <div className="space-y-3">
            {!data?.datos.length && <p>No hay meses registrados todavía.</p>}
            {data?.datos.map((payment) => (
              <div
                className="space-y-2 rounded border p-3"
                key={payment.id_pago}
              >
                <div className="flex justify-between gap-3">
                  <strong>{payment.mes}</strong>
                  <Link
                    href={`/pagos?mes=${payment.mes}`}
                    onClick={onClose}
                    className="text-sm underline"
                  >
                    Ver mes
                  </Link>
                </div>
                <div className="text-sm text-muted-foreground">
                  {payment.nombre_arrendatario} · {payment.nombre_local} ·{" "}
                  {payment.direccion_propiedad}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    Arriendo
                    <PaymentStatus
                      paid={payment.arriendo_pagado}
                      date={payment.fecha_pago_arriendo}
                    />
                  </div>
                  <div>
                    Gastos comunes
                    <PaymentStatus
                      paid={payment.gastos_comunes_pagados}
                      date={payment.fecha_pago_gastos_comunes}
                    />
                  </div>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm">
                  {payment.comentarios || "Sin comentarios"}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={pagina <= 1}
                onClick={() => setPagina(pagina - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm">
                {pagina} / {Math.max(1, data?.paginasTotales ?? 1)}
              </span>
              <Button
                variant="outline"
                disabled={pagina >= (data?.paginasTotales ?? 0)}
                onClick={() => setPagina(pagina + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
