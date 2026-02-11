import { useState, useEffect } from "react";

interface TokenIconProps {
    symbol: string;
    className?: string;
    size?: number;
}

export const TokenIcon = ({ symbol, className, size = 24 }: TokenIconProps) => {
    const [hasError, setHasError] = useState(false);
    const assetsUrl = import.meta.env.VITE_SWITCHEO_ASSETS_URL;

    // Reset error state when symbol changes
    useEffect(() => {
        setHasError(false);
    }, [symbol]);

    if (hasError || !symbol || !assetsUrl) {
        return (
            <div
                className={`flex items-center justify-center bg-white/10 border border-white/10 rounded-full font-bold text-white/40 shrink-0 select-none ${className}`}
                style={{ width: size, height: size, fontSize: Math.max(8, size * 0.4) }}
            >
                {symbol?.substring(0, 2).toUpperCase() || "?"}
            </div>
        );
    }

    return (
        <img
            src={`${assetsUrl}/token-icons/main/tokens/${symbol}.svg`}
            alt={symbol}
            className={`shrink-0 rounded-full object-contain ${className}`}
            style={{ width: size, height: size }}
            onError={() => setHasError(true)}
        />
    );
};
