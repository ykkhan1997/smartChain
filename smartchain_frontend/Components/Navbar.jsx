import { navLinks } from "@/Context/config";
import React from "react";
import Image from "next/image";
import { Logo } from "@/public";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-[2px] shadow-inner rounded">
      <Link href={'/'}><Image src={Logo} alt="Logo" width={150} height={150} /></Link>
      <div className="flex space-x-4">
        {navLinks.map((nav, i) => (
          <ul key={i + 1} className="hover:text-gray-500 hover:cursor-pointer tracking-tight">
            <li>
              <Link href={nav.href} legacyBehavior>
                {nav.name === "Blockchain" ? (
                  <a target="_blank">{nav.name}</a>
                ) : (
                  nav.name
                )}
              </Link>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
