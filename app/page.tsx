"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function Home() {
  const [saldo, setSaldo] = useState<string>("");
  const [stopLossPorc, setStopLossPorc] = useState<string>("");
  const [riesgoPorc, setRiesgoPorc] = useState<number>(0.5);
  const [comisionPorc, setComisionPorc] = useState<number>(0.02);
  const [resultado, setResultado] = useState<{ posicion: number; perdida: number }>({
    posicion: 0,
    perdida: 0,
  });

  const calcularClicked = () => {
    const saldoNum = parseFloat(saldo);
    const stopLossNum = parseFloat(stopLossPorc);

    if (isNaN(saldoNum) || isNaN(stopLossNum)) {
      toast.error("Ingresa solo números válidos en Saldo y Stop Loss");
      return;
    }

    const riesgo_usdt = (riesgoPorc / 100) * saldoNum;
    const tamano_posicion_comision =
      (riesgo_usdt * 100) / (stopLossNum + comisionPorc * 2);

    setResultado({
      posicion: tamano_posicion_comision,
      perdida: -riesgo_usdt,
    });
  };

  const copiarPortapapelesClicked = () => {
    navigator.clipboard.writeText(resultado.posicion.toFixed(2));
    toast.success("Copiado al portapapeles ✅");
  };

  return (
    <main className="max-w-sm mx-auto bg-white h-[30rem] p-4">
      {/* Toast container */}
      <Toaster position="top-center" />

      <h2
        className={`${poppins.className} text-2xl pt-8 text-center font-semibold text-gray-800`}
      >
        Gestión inteligente de tu posición
      </h2>
      <span className="text-gray-600 text-base block text-center mt-3">
        Decide cuánto invertir según tu nivel de riesgo.
      </span>

      <div className="app mx-auto px-4 flex flex-col mt-4 space-y-4">
        <div>
          <label
            htmlFor="saldo"
            className="text-lg font-semibold text-gray-700"
          >
            Saldo de la cuenta (USDT)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-xl"
            placeholder="Saldo actual"
          />
        </div>

        <div>
          <label
            htmlFor="stoploss"
            className="text-lg font-semibold text-gray-700"
          >
            Stop Loss (%)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={stopLossPorc}
            onChange={(e) => setStopLossPorc(e.target.value)}
            className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-xl"
            placeholder="Stop Loss en porcentaje"
          />
        </div>

        <div>
          <label
            htmlFor="riesgo"
            className="text-lg font-semibold text-gray-700"
          >
            Riesgo de la cuenta por operación (%)
          </label>
          <select
            value={riesgoPorc}
            onChange={(e) => setRiesgoPorc(parseFloat(e.target.value))}
            className="mt-2 w-full px-4 border border-gray-300 rounded-xl py-2"
          >
            {[0.25, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0].map(
              (val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="comision"
            className="text-lg font-semibold text-gray-700"
          >
            Comisión (%)
          </label>
          <select
            value={comisionPorc}
            onChange={(e) => setComisionPorc(parseFloat(e.target.value))}
            className="mt-2 w-full px-4 border border-gray-300 rounded-xl py-2"
          >
            <option value={0.02}>Orden límite 0.02% (Maker)</option>
            <option value={0.05}>Orden mercado 0.05% (Taker)</option>
          </select>
        </div>

        <button
          onClick={calcularClicked}
          className="mt-4 cursor-pointer w-full bg-color1 text-white py-3 rounded-xl"
        >
          Calcular mi posición
        </button>

        <div className="resultado my-3">
          <div className="posicion flex justify-between items-center">
            <p className="text-base font-semibold text-gray-700">
              Tamaño de posición: {resultado.posicion.toFixed(2)}
            </p>
            <Image
              onClick={copiarPortapapelesClicked}
              className="cursor-pointer"
              alt="copiar al portapapeles"
              width={24}
              height={24}
              src="/icons/copy.png"
            />
          </div>
          <p className="text-base font-semibold text-red-600 my-2">
            Pérdida estimada si toca SL: {resultado.perdida.toFixed(2)}
          </p>
        </div>
      </div>
    </main>
  );
}
