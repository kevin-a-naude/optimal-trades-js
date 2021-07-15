
const { TradeList } = require('./trade-list');
const { TradeSolver } = require('./trade-solver');

function solve(prices, maxHold = 3) {
    let solver = new TradeSolver(1, maxHold);
    for (const [time, price]of prices.entries()) {
        solver.recordPrice(time, price);
    }
    let profit = solver.leadingTradeList.cumulativeProfit.toNumber();
    let trades = solver.leadingTradeList.toArray();
    return [profit, trades];
}


test('produce no trades when given no prices', () => {
    let [profit, trades] = solve([]);

    expect(profit).toStrictEqual(0);
    expect(trades).toStrictEqual([]);
});


test('produce no trades when given one price', () => {
    let [profit, trades] = solve([1]);

    expect(profit).toStrictEqual(0);
    expect(trades).toStrictEqual([]);
});


test('produce no trades for decreasing prices', () => {
    let [profit, trades] = solve([3,2,1]);

    expect(profit).toStrictEqual(0);
    expect(trades).toStrictEqual([]);
});


test('produce one valid trade for increasing prices within hold interval', () => {
    let [profit, trades] = solve([1,2,3]);

    expect(profit).toStrictEqual(2);
    expect(trades.length).toStrictEqual(1);
    expect(trades[0].openAt).toStrictEqual(0);
    expect(trades[0].closeAt).toStrictEqual(2);
});


test('produce optimal inner trades', () => {
    let [profit, trades] = solve([2,1,4,5,6], 2);

    expect(profit).toStrictEqual(4);
    expect(trades.length).toStrictEqual(1);
    expect(trades[0].openAt).toStrictEqual(1);
    expect(trades[0].closeAt).toStrictEqual(3);
});


test('produce optimal outer trades', () => {
    let [profit, trades] = solve([2,1,4,5,8], 2);
    console.log(trades.map(item => item.toString()));

    expect(profit).toStrictEqual(6);
    expect(trades.length).toStrictEqual(2);
    expect(trades[0].openAt).toStrictEqual(1);
    expect(trades[0].closeAt).toStrictEqual(2);
    expect(trades[1].openAt).toStrictEqual(3);
    expect(trades[1].closeAt).toStrictEqual(4);
});
