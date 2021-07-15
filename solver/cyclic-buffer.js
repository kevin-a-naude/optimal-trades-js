
/**
 * A cyclic buffer is like a queue with a bounded length,
 * such that old items drop off to make room for new items.
 * 
 * Our algorithm for generating trades only needs to retain
 * candidate trade lists for the N previously seen points in
 * time, where N is maxHold.
 * 
 * The cyclic buffer will automatically discard any trade lists
 * prior to that window of time. However, as each trade list
 * is a linked list, the prior trade sequence that remain relevant
 * will continue to be reachable.
 */
class CyclicBuffer {
    constructor(size, defaultValue = undefined) {
        this.buffer = new Array(size);
        this.start = 0;
        this.size = size;
        this.count = 0;
        this.defaultValue = defaultValue;
    }

    push(item) {
        var position = (this.start + this.count) % this.size;
        this.buffer[position] = item;

        if (this.count < this.size) {
            this.count++;
        } else {
            this.start = (this.start + 1) % this.size;
        }
    }

    peek(index) {
        if (index >= this.count) return this.defaultValue;
        if (index < 0) return this.defaultValue;

        var position = (this.start + this.count - index - 1) % this.size;
        return this.buffer[position];
    }
}

module.exports = {
    CyclicBuffer,
};
