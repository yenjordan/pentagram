"use client";

import { TbCircuitDiode } from "react-icons/tb";
import Navigation from './Navigation';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="w-full px-6 py-4 backdrop-blur-xl bg-black/40 fixed top-0 z-50 border-b border-cyan-500/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/">
                    <h1 className="text-2xl font-bold flex items-center gap-6">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-75 blur-sm animate-pulse" />
                            <TbCircuitDiode className="relative text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" />
                        </div>
                        <span className="relative animate-gradient bg-clip-text text-transparent bg-[length:200%_auto] bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400">
                            Pentagram
                        </span>
                    </h1>
                </Link>
                <Navigation />
            </div>
        </header>
    );
} 