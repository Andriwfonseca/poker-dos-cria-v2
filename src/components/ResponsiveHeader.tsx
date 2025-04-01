"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResponsiveHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto">
        {/* Versão desktop */}
        <div className="hidden md:flex justify-between items-center">
          <h1 className="text-2xl font-bold">Poker dos Cria</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-200">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/jogadores" className="hover:text-blue-200">
                  Jogadores
                </Link>
              </li>
              <li>
                <Link href="/torneios" className="hover:text-blue-200">
                  Torneios
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="hover:text-blue-200">
                  Ranking
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Versão mobile com menu dropdown */}
        <div className="md:hidden">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Poker dos Cria</h1>
            <button className="mobile-menu-button" onClick={toggleMenu}>
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
          <div className={`mt-4 ${isMenuOpen ? "block" : "hidden"}`}>
            <nav>
              <ul className="flex flex-col space-y-3">
                <li>
                  <Link
                    href="/"
                    className="block py-2 hover:bg-blue-700 px-2 rounded"
                  >
                    <i className="fas fa-home mr-2"></i> Início
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jogadores"
                    className="block py-2 hover:bg-blue-700 px-2 rounded"
                  >
                    <i className="fas fa-users mr-2"></i> Jogadores
                  </Link>
                </li>
                <li>
                  <Link
                    href="/torneios"
                    className="block py-2 hover:bg-blue-700 px-2 rounded"
                  >
                    <i className="fas fa-trophy mr-2"></i> Torneios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ranking"
                    className="block py-2 hover:bg-blue-700 px-2 rounded"
                  >
                    <i className="fas fa-medal mr-2"></i> Ranking
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
