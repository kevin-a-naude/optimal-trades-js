
/**
 * This class describes a single trade.
 */
class Trade {
    constructor(openAt, openPrice, closeAt, closePrice) {
        this.openAt = openAt;
        this.openPrice = openPrice;
        this.closeAt = closeAt;
        this.closePrice = closePrice;
    }

    get profit() {
        return this.closePrice.minus(this.openPrice);
    }

    toString() {
        return (
            `Open at ${this.openAt} (${this.openPrice}), ` +
            `close ${this.closeAt} (${this.closePrice}) ` +
            `for profit ${this.profit}`
        );
    }
}

module.exports = {
    Trade,
};
