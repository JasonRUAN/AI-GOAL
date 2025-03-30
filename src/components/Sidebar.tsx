"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    HomeIcon,
    PlusCircleIcon,
    UserGroupIcon,
    TrophyIcon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";
import { ConnectButton } from "@mysten/dapp-kit";

interface NavItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

export default function Sidebar() {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            name: "首页",
            path: "/",
            icon: <HomeIcon className="w-6 h-6" />,
        },
        {
            name: "创建目标",
            path: "/create",
            icon: <PlusCircleIcon className="w-6 h-6" />,
        },
        {
            name: "我的目标",
            path: "/my-goals",
            icon: <TrophyIcon className="w-6 h-6" />,
        },
        {
            name: "见证目标",
            path: "/witness",
            icon: <UserGroupIcon className="w-6 h-6" />,
        },
        {
            name: "所有目标",
            path: "/all-goals",
            icon: <ListBulletIcon className="w-6 h-6" />,
        },
    ];

    return (
        <div className="flex flex-col h-screen bg-white border-r border-gray-200 w-64 fixed left-0 top-0">
            {/* Logo 区域 */}
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">AI GOAL</h1>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-3">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    pathname === item.path
                                        ? "bg-primary text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {item.icon}
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* 底部用户信息 */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex justify-center items-center">
                    <ConnectButton />
                </div>
            </div>
        </div>
    );
}
