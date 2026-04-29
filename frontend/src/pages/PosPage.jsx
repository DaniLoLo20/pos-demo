import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getProducts } from "../api/products";
import { createSale } from "../api/sales";
import { openCash, closeCash } from "../api/cash";

export default function PosPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [ticketData, setTicketData] = useState([]); // ✅ snapshot para imprimir
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [search, setSearch] = useState("");

  /* 🟢 ABRIR CAJA AL ENTRAR */
  useEffect(() => {
    const init = async () => {
      const res = await Swal.fire({
        title: "Abrir caja",
        input: "number",
        inputLabel: "Fondo inicial",
        inputPlaceholder: "Ej. 1000",
        confirmButtonText: "Abrir caja",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (res.isConfirmed) {
        await openCash(Number(res.value));
      }
    };

    init();
    getProducts().then(setProducts);
  }, []);

  const availableProducts = products.filter((p) => p.stock > 0);

  /* 🛒 CARRITO */
 const addToCart = (product) => {
  const exists = cart.find((i) => i.productId === product.id);

  if (exists) {
    setCart(
      cart.map((i) =>
        i.productId === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  } else {
    setCart([
      ...cart,
      {
        productId: product.id,
        name: product.name,
        price: Number(product.salePrice), // ✅ FIX
        quantity: 1,
      },
    ]);
  }

  };

  const increase = (id) =>
    setCart((prev) =>
      prev.map((i) =>
        i.productId === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

  const decrease = (id) =>
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((i) => i.productId !== id));

  const subtotal = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const total = subtotal;

  /* 💵 COBRAR */
  const submitSale = async () => {
    if (cart.length === 0) return;

    const confirm = await Swal.fire({
      title: "Confirmar pago",
      text: "¿Deseas finalizar esta venta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Pagar",
    });

    if (!confirm.isConfirmed) return;

    // ✅ guardamos snapshot del ticket ANTES de limpiar
    const snapshot = [...cart];
    setTicketData(snapshot);

    await createSale({
      paymentMethod,
      items: snapshot.map(({ productId, quantity }) => ({
        productId,
        quantity,
      })),
    });

    const res = await Swal.fire({
      title: "Venta registrada ✅",
      text: "¿Deseas imprimir el ticket?",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Imprimir ticket",
      cancelButtonText: "Cerrar",
    });

    if (res.isConfirmed) {
      window.print();
    }

    setCart([]);
    setTicketData([]);
  };

  /* 🔒 CERRAR CAJA */
  const exitPos = async () => {
    const res = await Swal.fire({
      title: "Cerrar caja",
      input: "number",
      inputLabel: "Efectivo contado en caja",
      showCancelButton: true,
      confirmButtonText: "Cerrar caja",
    });

    if (!res.isConfirmed) return;

    await closeCash(Number(res.value));
    await Swal.fire("Caja cerrada ✅", "", "success");
    navigate("/dashboard");
  };

  const filteredProducts = availableProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-200">
      {/* HEADER */}
      <header className="h-14 bg-purple-800 text-white flex items-center justify-between px-4 shadow">
        <span className="font-bold text-lg">POS</span>
        <button
          onClick={exitPos}
          className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700"
        >
          ✕ Close
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* 🧾 CARRITO */}
        <aside
          className="
            bg-white p-4 flex flex-col
            md:w-1/3
            fixed md:static
            bottom-0 left-0 right-0
            max-h-[60vh] md:max-h-full
            overflow-y-auto
            shadow-lg md:shadow-none
          "
        >
          {/* ✅ TICKET IMPRIMIBLE */}
          <div className="ticket-print hidden print:block text-sm">
            <h2 className="text-center font-bold mb-2">MI TIENDA</h2>

            {ticketData.map((i, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {i.name} ({i.quantity} x ${i.price.toFixed(2)})
                </span>
                <span>
                  ${(i.price * i.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <hr />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                $
                {ticketData.reduce(
                  (sum, i) => sum + i.price * i.quantity,
                  0
                ).toFixed(2)}
              </span>
            </div>

            <p>Método: {paymentMethod}</p>
          </div>

          {/* CONTENIDO DEL CARRITO */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="text-6xl mb-4">🛒</div>
              <p>This order is empty</p>
            </div>
          ) : (
            <div className="flex-1 space-y-3 overflow-auto">
              {cart.map((i) => (
                <div key={i.productId} className="border-b pb-2">
                  <div className="font-medium text-sm mb-1">
                    {i.name}
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      ${i.price.toFixed(2)} x {i.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${(i.price * i.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-end gap-3 mt-2">
                    <button onClick={() => decrease(i.productId)}>➖</button>
                    <button onClick={() => increase(i.productId)}>➕</button>
                    <button
                      onClick={() => removeItem(i.productId)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ✅ RESUMEN */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Transfer</option>
            </select>

            <button
              onClick={submitSale}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold"
            >
              Payment
            </button>
          </div>
        </aside>

        {/* 📦 PRODUCTOS */}
        <main className="flex-1 p-4 overflow-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="mb-4 w-full border rounded p-2"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredProducts.map((p) => {
              const inCart = cart.some((i) => i.productId === p.id);

              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={`p-3 rounded shadow text-left transition ${
                    inCart
                      ? "bg-purple-100 border border-purple-400"
                      : "bg-white"
                  }`}
                >
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.sku}</p>
                  <p className="font-bold text-purple-700">
                    ${p.salePrice}
                  </p>
                </button>
              );
            })}
          </div>
        </main>
      </div>

      {/* 🟣 BOTÓN VER CARRITO (solo mobile) */}
      <button
        onClick={() =>
          document
            .querySelector("aside")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="md:hidden fixed bottom-24 right-4 bg-purple-700 text-white px-5 py-3 rounded-full shadow-lg font-bold"
      >
        🛒 Ver carrito
      </button>
    </div>
  );
}
