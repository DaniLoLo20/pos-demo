import { useEffect, useMemo, useState } from "react";
import { getSalesReport } from "../api/reports";
import { getCashHistory } from "../api/cash";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [cashHistory, setCashHistory] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getSalesReport().then(setData);
    getCashHistory().then(setCashHistory);
  }, []);

  const filteredSales = useMemo(() => {
    if (!data) return [];
    return data.sales.filter((s) => {
      const date = new Date(s.createdAt);
      if (paymentFilter !== "all" && s.paymentMethod !== paymentFilter) return false;
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    });
  }, [data, paymentFilter, startDate, endDate]);

  const salesByMethod = useMemo(() => {
    const map = {};
    filteredSales.forEach((s) => {
      map[s.paymentMethod] = (map[s.paymentMethod] || 0) + Number(s.total);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  const salesByDay = useMemo(() => {
    const map = {};
    filteredSales.forEach((s) => {
      const day = s.createdAt.split("T")[0];
      map[day] = (map[day] || 0) + Number(s.total);
    });
    return Object.entries(map).map(([date, total]) => ({ date, total }));
  }, [filteredSales]);

  if (!data) return <p className="p-6">Cargando reportes…</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* HEADER */}
        <div className="col-span-12">
          <h1 className="text-3xl font-bold">📊 Business Dashboard</h1>
        </div>

        {/* KPIs */}
        {[
          ["Ventas", `$${data.totalSales}`],
          ["Ganancia", `$${data.totalProfit}`],
          ["Productos vendidos", data.totalItems],
          ["Ventas", filteredSales.length],
        ].map(([title, value]) => (
          <div
            key={title}
            className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white rounded-xl p-5 shadow"
          >
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}

        {/* CONTENIDO PRINCIPAL */}
        <div className="col-span-12 lg:col-span-9 space-y-6">

          {/* FILTROS */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-wrap gap-4">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">Todos</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2"
            />

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => exportExcel(filteredSales)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Excel
              </button>
              <button
                onClick={() => exportPDF(filteredSales)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                PDF
              </button>
            </div>
          </div>

          {/* CHART */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-bold mb-4">Ventas por día</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByDay}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* TABLA VENTAS */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-bold mb-4">Ventas recientes</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-center">Método</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="p-2 text-center">{s.paymentMethod}</td>
                    <td className="p-2 text-right font-semibold">${s.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔥 CORTES DE CAJA */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-bold mb-4">🧾 Cortes de Caja</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Apertura</th>
                  <th className="p-2">Cierre</th>
                  <th className="p-2 text-right">Efectivo</th>
                  <th className="p-2 text-right">Tarjeta</th>
                  <th className="p-2 text-right">Transferencia</th>
                  <th className="p-2 text-right">Declarado</th>
                </tr>
              </thead>
              <tbody>
                {cashHistory.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="p-2">{new Date(c.openedAt).toLocaleString()}</td>
                    <td className="p-2">
                      {c.closedAt
                        ? new Date(c.closedAt).toLocaleString()
                        : "Abierta"}
                    </td>
                    <td className="p-2 text-right">${c.totalCash}</td>
                    <td className="p-2 text-right">${c.totalCard}</td>
                    <td className="p-2 text-right">${c.totalTransfer}</td>
                    <td className="p-2 text-right font-bold">${c.closingAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-bold mb-4">Resumen por método</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={salesByMethod} dataKey="value" nameKey="name" outerRadius={80}>
                  {salesByMethod.map((_, i) => (
                    <Cell key={i} fill={["#7c3aed", "#10b981", "#2563eb"][i % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

/* EXPORTS */
function exportExcel(rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
  XLSX.writeFile(workbook, "reporte-ventas.xlsx");
}

function exportPDF(rows) {
  const doc = new jsPDF();
  doc.text("Reporte de Ventas", 14, 16);
  doc.autoTable({
    startY: 22,
    head: [["Fecha", "Método", "Total"]],
    body: rows.map((s) => [
      new Date(s.createdAt).toLocaleString(),
      s.paymentMethod,
      `$${s.total}`,
    ]),
  });
  doc.save("reporte-ventas.pdf");
}
