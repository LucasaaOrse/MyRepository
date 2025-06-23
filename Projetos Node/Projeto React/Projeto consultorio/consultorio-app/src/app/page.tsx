import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-blue-100 py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-blue-800">Bem-vindo à VivaBem Saúde Integrada</h2>
        <p className="mt-4 text-lg text-blue-900">Cuidando de você e da sua família com carinho e excelência</p>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Especialidades</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {["Clínico Geral", "Pediatria", "Cardiologia", "Dermatologia", "Ginecologia", "Ortopedia"].map((esp) => (
            <div key={esp} className="bg-white shadow p-4 rounded-xl">
              <p className="text-blue-700 font-semibold">{esp}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-white max-w-5xl mx-auto">
        <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Planos Atendidos</h3>
        <ul className="list-disc list-inside text-blue-700 text-lg">
          <li>Plano VivaBem Premium</li>
          <li>Plano Saúde+</li>
          <li>Convênios parceiros: Amil, SulAmérica, Bradesco Saúde</li>
          <li>Atendimento particular com valores acessíveis</li>
        </ul>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h3 className="text-2xl font-semibold text-blue-800 mb-6">Ambiente acolhedor e profissionais dedicados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Image src="/images/image1.jpeg" alt="Atendimento médico" width={600} height={400} className="rounded-xl shadow-md object-cover" />
          <Image src="/images/image2.jpg" alt="Paciente feliz" width={600} height={400} className="rounded-xl shadow-md object-cover" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
