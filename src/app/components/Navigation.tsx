"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbHome, TbHeart, TbBookmark } from 'react-icons/tb';

export default function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: '/', icon: TbHome, label: 'Home' },
        { href: '/liked', icon: TbHeart, label: 'Liked' },
        { href: '/saved', icon: TbBookmark, label: 'Saved' }
    ];

    return (
        <nav className="flex items-center gap-4">
            {links.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;
                
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            isActive 
                                ? 'bg-cyan-500/10' 
                                : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Icon 
                                className={`text-xl ${
                                    isActive 
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-gradient bg-[length:200%_auto] fill-cyan-400' 
                                        : 'fill-current'
                                }`}
                            />
                            <span 
                                className={`text-sm font-medium ${
                                    isActive 
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-gradient bg-[length:200%_auto]' 
                                        : ''
                                }`}
                            >
                                {label}
                            </span>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
} 