export default function Footer() {
  return (
    <footer className="bg-[#2B7A78] text-white py-6 mt-10">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} VivaBem Saúde Integrada. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">Contato: contato@vivabem.com.br | (11) 4002-8922</p>
      </div>
    </footer>

  );
}
