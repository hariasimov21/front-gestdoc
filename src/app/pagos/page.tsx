import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PaymentsClient } from "@/components/payments/payments-client";
import { listPayments } from "./actions";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const jar = await cookies();
  const session = jar.get("session")?.value;
  if (!session || !jar.get("auth_token")?.value) redirect("/ingresar");
  const params = await searchParams;
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
  const mes = typeof params.mes === "string" ? params.mes : today;
  const pagina =
    typeof params.pagina === "string" && /^\d+$/.test(params.pagina)
      ? Math.max(1, Number(params.pagina))
      : 1;
  const buscar = typeof params.buscar === "string" ? params.buscar : "";
  const estado = typeof params.estado === "string" ? params.estado : "todos";
  const result = await listPayments(mes, pagina, buscar, estado);
  return (
    <DashboardLayout
      user={JSON.parse(session)}
      title="Pagos mensuales"
      description="Controla el pago de arriendo y gastos comunes de cada mes."
    >
      <PaymentsClient
        key={`${mes}-${pagina}-${buscar}-${estado}`}
        mes={mes}
        buscar={buscar}
        estado={estado}
        data={result.payload}
        error={result.error}
      />
    </DashboardLayout>
  );
}
