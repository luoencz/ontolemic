"use client";

import { ReactNode } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";

interface CollapsibleSectionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    bgColor: string;
    children: ReactNode;
}

export default function CollapsibleSection({ title, isOpen, onToggle, bgColor, children }: CollapsibleSectionProps) {
    return (
        <div className={`flex flex-col gap-2 ${bgColor} p-4 rounded-lg`}>
            <h3 
                onClick={onToggle} 
                className="flex items-center gap-2 cursor-pointer select-none hover:opacity-80 transition-opacity"
            >
                {isOpen ? <FaChevronDown className="text-sm" /> : <FaChevronRight className="text-sm" />}
                {title}
            </h3>
            {isOpen && (
                <ul className="flex flex-col gap-4">
                    {children}
                </ul>
            )}
        </div>
    );
}

