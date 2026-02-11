import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner"
import { ArrowDownUp, RefreshCcw } from "lucide-react";
import { TokenIcon } from "./TokenIcon";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePrices } from "@/hooks/usePrices";

const swapSchema = z.object({
  fromAmount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be greater than 0",
  }),
  fromCurrency: z.string().min(1, "Required"),
  toCurrency: z.string().min(1, "Required"),
});

type SwapFormData = z.infer<typeof swapSchema>;

export function CurrencySwapForm() {
  const { prices, tokenList, loading, error: priceError } = usePrices();
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [toAmount, setToAmount] = useState<string>("0");
  const assetsUrl = import.meta.env.VITE_SWITCHEO_ASSETS_URL;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromAmount: "",
      fromCurrency: "ETH",
      toCurrency: "USDC",
    },
  });

  const fromAmount = watch("fromAmount");
  const fromCurrency = watch("fromCurrency");
  const toCurrency = watch("toCurrency");

  const onSubmit = async (data: SwapFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Swap successful!", {
      description: `Swapped ${data.fromAmount} ${data.fromCurrency} for ${toAmount} ${data.toCurrency}`,
    });

    reset({
      fromAmount: "",
      fromCurrency: data.fromCurrency,
      toCurrency: data.toCurrency,
    });
    setToAmount("0");
  };

  // Update exchange rate and toAmount
  useEffect(() => {
    if (prices[fromCurrency] && prices[toCurrency]) {
      const rate = prices[fromCurrency] / prices[toCurrency];
      setExchangeRate(rate);

      const amt = parseFloat(fromAmount);
      if (!isNaN(amt)) {
        setToAmount((amt * rate).toFixed(6));
      } else {
        setToAmount("0");
      }
    }
  }, [fromAmount, fromCurrency, toCurrency, prices]);

  const handleSwapCurrencies = () => {
    const currentFrom = fromCurrency;
    const currentTo = toCurrency;
    setValue("fromCurrency", currentTo);
    setValue("toCurrency", currentFrom);
  };


  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-2xl border-white/10 bg-black/40 backdrop-blur-xl text-white">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <RefreshCcw className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading market data...</p>
        </CardContent>
      </Card>
    );
  }

  const error = priceError || (!assetsUrl ? "VITE_SWITCHEO_ASSETS_URL is not defined" : null);

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-destructive/50 bg-destructive/10 text-destructive">
        <CardContent className="p-6 text-center">
          <p className="font-bold mb-2">Configuration Error</p>
          <p className="text-sm opacity-80">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md md:max-w-4xl mx-auto overflow-hidden border-white/10 bg-neutral-900/90 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_0_60px_-12px_rgba(59,130,246,0.3)]">
      <CardHeader className="space-y-1 pb-4 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
          Swap
        </CardTitle>
        <CardDescription className="text-white/40">
          Instant, secure token exchange
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 relative">
            {/* From Field */}
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
              <div className="relative p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-medium text-white/40">
                  <Label htmlFor="fromAmount" className="text-white">You Pay</Label>
                  <span className="text-white/60">Balance: --</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      id="fromAmount"
                      type="number"
                      placeholder="0.00"
                      {...register("fromAmount")}
                      className="border-none bg-transparent text-3xl font-bold h-auto p-0 focus-visible:ring-0 placeholder:text-white/20 tabular-nums text-white"
                    />
                    {errors.fromAmount && (
                      <p className="text-[10px] text-destructive mt-1">
                        {errors.fromAmount.message}
                      </p>
                    )}
                  </div>
                  <Select
                    value={fromCurrency}
                    onValueChange={(value) => setValue("fromCurrency", value)}
                  >
                    <SelectTrigger className="w-full sm:w-[140px] h-12 bg-white/5 border-white/10 hover:bg-white/10 transition-colors rounded-xl text-white">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <TokenIcon symbol={fromCurrency} />
                          <span className="font-bold text-base text-white">{fromCurrency}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-neutral-900 border-white/10 text-white max-h-[300px]">
                      {tokenList.map((token) => (
                        <SelectItem key={token} value={token} className="focus:bg-white/10 focus:text-white">
                          <div className="flex items-center gap-2">
                            <TokenIcon symbol={token} size={16} />
                            <span>{token}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 pointer-events-none">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleSwapCurrencies}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-neutral-800 border-4 border-neutral-900 text-white hover:bg-neutral-700 hover:text-white group transition-all duration-300 shadow-xl pointer-events-auto"
              >
                <ArrowDownUp className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-180 transition-transform duration-500 md:-rotate-90 md:group-hover:-rotate-[270deg]" />
              </Button>
            </div>

            {/* To Field */}
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
              <div className="relative p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-medium text-white/40">
                  <Label className="text-white">You Receive</Label>
                  {exchangeRate && (
                    <span className="tabular-nums text-white/60">
                      1 {fromCurrency} ≈ {exchangeRate.toFixed(4)} {toCurrency}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      readOnly
                      value={toAmount}
                      className="border-none bg-transparent text-3xl font-bold h-auto p-0 focus-visible:ring-0 cursor-default tabular-nums text-white"
                    />
                  </div>
                  <Select
                    value={toCurrency}
                    onValueChange={(value) => setValue("toCurrency", value)}
                  >
                    <SelectTrigger className="w-full sm:w-[140px] h-12 bg-white/5 border-white/10 hover:bg-white/10 transition-colors rounded-xl text-white">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <TokenIcon symbol={toCurrency} />
                          <span className="font-bold text-base text-white">{toCurrency}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-neutral-900 border-white/10 text-white max-h-[300px]">
                      {tokenList.map((token) => (
                        <SelectItem key={token} value={token} className="focus:bg-white/10 focus:text-white">
                          <div className="flex items-center gap-2">
                            <TokenIcon symbol={token} size={16} />
                            <span>{token}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 rounded-2xl transition-all shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] md:max-w-md mx-auto flex"
              disabled={isSubmitting || !!Object.keys(errors).length || !fromAmount}
            >
              {isSubmitting ? "Processing..." : "Confirm Swap"}
            </Button>
          </div>
        </form>
      </CardContent>
      <div className="px-6 pb-6 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Powered by Switcheo Network</p>
      </div>
    </Card>
  );
}
