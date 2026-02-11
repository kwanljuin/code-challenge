interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // ERROR: `getPriority` is recreated on every render cycle. best practice to move pure helper functions outside the component or use `useCallback` to maintain referential stability.
    const getPriority = (blockchain: any): number => { // ERROR: using `any` defeats the purpose of TypeScript. It should be `string`.
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            // ERROR: lhsPriority is undefined
            if (lhsPriority > -99) {
                // ERROR: incorrect filtering logic filters out positive balances, should be > 0
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            // ERROR: `interface WalletBalance` only has `currency` and `amount`, no `blockchain`
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
        });
    }, [balances, prices]); // ERROR: dependency `prices` is not used

    // ERROR: unnecessarily iterates over the array to create a new array
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={index} // ERROR: using index as key is not recommended
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted} // ERROR: `formatted` is not a property of `WalletBalance`
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}