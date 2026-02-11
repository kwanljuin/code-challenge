var sum_to_n_a = function(n: number): number {
    if (n <= 0) return 0;

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};


var sum_to_n_b = function(n: number): number {
    if (n <= 0) return 0;

    return (n * (n + 1)) / 2;
};


var sum_to_n_c = function(n: number): number {
    if (n <= 0) return 0;

    return Array.from({ length: n }, (_, i) => i + 1)
        .reduce((acc, cur) => acc + cur, 0);
};