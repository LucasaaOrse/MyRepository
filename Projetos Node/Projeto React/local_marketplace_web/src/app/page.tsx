import Image from "next/image";
import { MapPinCustomIcon } from "./_components/MapPinCustomIcon";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#055333] text-[#F5F5F5]">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-2">
          <MapPinCustomIcon size={40} fillColor="#FAA75C" holeColor="white" />

          <h1 className="text-xl font-bold text-[#E5F8CC]">AquiDoLado</h1>
        </div>
        <div className="space-x-3">
          <button className="text-sm text-[#002005] border bg-[#E5F2CC] border-white px-4 py-1 rounded-full hover:bg-white hover:text-[#1B5E20] transition">
            Entrar
          </button>
          <button className="text-sm bg-[#E5F2CC] text-[#002005] px-4 py-1 rounded-full hover:bg-white transition">
            Cadastre-se
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-12 text-center space-y-4">
        <h2 className="text-3xl font-bold text-[#E4FACF]">
          Compre no seu bairro sem sair de casa
        </h2>
        <p className="text-[#D0FFD0] max-w-xl mx-auto">
          Descubra mercados perto de você e faça suas compras pelo aplicativo com entrega rápida e segura.
        </p>
        <div className="mt-6">
          <input
            type="text"
            placeholder="🔍 Buscar mercados próximos"
            className="w-full max-w-md px-5 py-3 rounded-full text-[#1B5E20] placeholder:text-[#1B5E20] bg-[#EBF8D3]"
          />
        </div>
      </section>

      {/* Como funciona */}
<section className="bg-[#E9F9D2] text-[#1B5E20] px-6 py-12">
  <h3 className="text-2xl font-semibold text-center mb-8">Como Funciona</h3>

  <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">
    
    {/* Passos */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-6 text-center w-full md:w-3/4">
      <div>
        <MapPinCustomIcon size={10} fillColor="#FAA75C" holeColor="white" />
        <p className="mt-2">Localize</p>
      </div>
      <div>
        <div className="text-2xl">🏪</div>
        <p className="mt-2">Escolha</p>
      </div>
      <div>
        <div className="text-2xl">💳</div>
        <p className="mt-2">Pague</p>
      </div>
      <div>
        <div className="text-2xl">✅</div>
        <p className="mt-2">Confirme</p>
      </div>
      <div>
        <div className="text-2xl">📦</div>
        <p className="mt-2">Receba</p>
      </div>
    </div>

    {/* Imagem da mulher */}
    <div className="w-full md:w-1/4 flex justify-center">
      <Image
        src="/images/woman-hero.png"
        alt="Mulher usando app"
        width={180}
        height={260}
        className="drop-shadow-lg"
      />
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-[#FFFEDE] text-[#1B5E20] px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-semibold">Mercados Próximos</p>
        </div>
        <div>
          <p className="font-semibold">Por que escolher?</p>
        </div>
        <div>
          <p className="font-semibold">Contate-nos</p>
        </div>
      </footer>
    </main>
  );
}
