"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    size?: "sm" | "md";
}

export default function QuantityStepper({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
    size = "md",
}: QuantityStepperProps) {
    const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
    const shell = size === "sm" ? "h-8 text-sm" : "h-10 text-sm";

    const buttonClass = `${dim} flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors`;

    return (
        <div
            className={`inline-flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white ${shell}`}
        >
            <button
                type="button"
                className={buttonClass}
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={disabled || value <= min}
                aria-label="Decrease quantity"
            >
                <Minus size={14} />
            </button>
            <span className="min-w-8 text-center font-semibold tabular-nums text-gray-900">
                {value}
            </span>
            <button
                type="button"
                className={buttonClass}
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={disabled || value >= max}
                aria-label="Increase quantity"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}
