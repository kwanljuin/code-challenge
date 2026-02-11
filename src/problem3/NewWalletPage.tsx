import React, { useMemo } from 'react';

// Corrected Interface to include blockchain
interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

// Extended interface for usage in the view
interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps { }

// Helper moved outside component (Stable reference, better performance)
const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case 'Osmosis':
            return 100;
        case 'Ethereum':
            return 50;
        case 'Arbitrum':
            return 30;
        case 'Zilliqa':
        case 'Neo': // Grouped cases with same return
            return 20;
        default:
            return -99;
    }
};

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // Optimized useMemo:
    // 1. Removed 'prices' dependency
    // 2. Fixed logic (balancePriority, amount > 0)
    // 3. Combined filter, sort, and formatting format to prepare data for view
    const formattedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // Fixed: Use correct variable and logical > 0 check
                return balancePriority > -99 && balance.amount > 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);

                // Simplified sort return
                if (leftPriority > rightPriority) return -1;
                if (rightPriority > leftPriority) return 1;
                return 0;
            })
            .map((balance: WalletBalance) => {
                return {
                    ...balance,
                    formatted: balance.amount.toFixed()
                }
            });
    }, [balances]); // Only re-run if balances change

    return (
        <div {...rest}>
            {formattedBalances.map((balance: FormattedWalletBalance) => {
                const usdValue = (prices[balance.currency] || 0) * balance.amount;

                return (
                    <WalletRow
                        className={classes.row}
                        key={balance.currency} // Use unique ID instead of index
                        amount={balance.amount}
                        usdValue={usdValue}
                        formattedAmount={balance.formatted}
                    />
                )
            })}
        </div>
    )
}