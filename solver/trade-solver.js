
const Big = require('big.js');

const { CyclicBuffer } = require('./cyclic-buffer');
const { TradeList } = require('./trade-list');
const { Trade } = require('./trade');

/***
 * The TradeSolver is the heart of the trade optimisation algorithm.
 * It is designed to process the data in the order it is received
 * so that it can perform online processing. This means that it does
 * not need to look into the future, and always knows the current
 * best candidate trade lists.
 */
class TradeSolver {
    constructor(minHold, maxHold) {
        if (maxHold < minHold) {
            throw new Error('maxHold is less than minHold');
        }

        this.minHold = minHold;
        this.maxHold = maxHold;

        /*
            NOTE: The i'th candidateTradeList is the best performing list
            that closes on or before the i'th price-point.
        */

        /*
            We keep up to N most recent prices, and N+1 most recent lists,
            where N is maxHold.
        */
        this.prices = new CyclicBuffer(maxHold);
        this.candidateTradeLists = new CyclicBuffer(maxHold+1, TradeList.Empty);

        this.recentPriceTime = undefined;
    }

    get leadingTradeList() {
        return this.candidateTradeLists.peek(0);
    }

    recordPrice(time, price) {
        /* Here we do a quick sanity check to ensure we get temporally contiguous data. */
        if (this.recentPriceTime != undefined && this.recentPriceTime + 1 !== time) {
            throw new Error('Price information is non-contiguous');
        }

        price = new Big(price);

        let bestTradeList = this.computeBestTrades(time, price);

        /* The best trade list enters the buffer, and we advance. */
        this.recentPriceTime = time;
        this.prices.push(price);
        this.candidateTradeLists.push(bestTradeList);
    }

    /**
     * To compute the best trades upon receiving a new data point,
     * we either:
     *   a) take the current best trade list and propagate it, or
     *   b) discover that the new data point can close a trade to extend
     *      a prior list.
     * 
     * We must search through the possible trades that could be created
     * from earlier points in time, to be closed now at this moment.
     * If any of these yield a better overall profit, the current leading
     * trade list is suplanted.
     */
    computeBestTrades(edgeTime, edgePrice) {
        let bestTradeList = this.leadingTradeList;

        for (let hold = this.minHold; hold <= this.maxHold; hold++) {
            let openAt = edgeTime - hold;
            let openPrice = this.prices.peek(hold - 1);
            let priorTradeList = this.candidateTradeLists.peek(hold);

            /* Check if the trade is valid and gives a profit. */
            if (openPrice === undefined || openPrice.gte(edgePrice)) continue;

            let profit = edgePrice
                .minus(openPrice)
                .plus(priorTradeList.cumulativeProfit);

            /* Check if the overall profit is improved. */
            if (profit.lte(bestTradeList.cumulativeProfit)) continue;

            // We have found a better trade list!
            bestTradeList = priorTradeList.append(
                 new Trade(openAt, openPrice, edgeTime, edgePrice));
        }

        return bestTradeList;
    }
}

module.exports = {
    TradeSolver,
};
