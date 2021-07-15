
const Big = require('big.js');

const ZERO = new Big(0);

/**
 * This class is an immutable linked list of trades.
 * 
 * The fact that it is a linked list and not an array is import
 * for the solution design. Ad we step through the prices,
 * we will be building a set of trade lists that may share
 * data from earlier in the time sequence.
 * 
 * In this way, the solution actually builds an inverted tree,
 * with all nodes pointing back to the root, which is the empty
 * trade list.
 * 
 * The linked list implementation is simple, because we only append.
 * I have named it append because the head is at the grows with the
 * time sequence. It is functionally equivalent to an insert in a
 * typical linked list.
 */
class TradeList {
    static Empty = new TradeList(undefined);

    constructor(trade, next = undefined) {
        this.trade = trade;
        this.next = next;

        let tradeProfit = trade ? trade.profit : ZERO;
        let priorProfit = next ? next.cumulativeProfit : ZERO;
        this.cumulativeProfit = tradeProfit.plus(priorProfit);
    }

    append(trade) {
        return new TradeList(trade, this);
    }

    toArray() {
        let array = [];
        let current = this;
        while (current.trade) {
            array.unshift(current.trade);
            current = current.next;
        }
        return array;
    }
}

module.exports = {
    TradeList,
};
