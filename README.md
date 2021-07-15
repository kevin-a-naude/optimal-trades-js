# optimal-trades

A simple algorithm to find a sequence of trades that maximises profit in stock trading.


## Getting started


### Install program dependencies

```bash
  npm install
```

### Run the provided tests

```bash
  npm test
```

### Running the program

Run the following for command line options.

```bash
  npm start
```

To run the optimiser on a specific CSV file, say `data_240.csv`, run the following.

```bash
  npm start data_240.csv
```

Note that the expected output for the above command is as follows.
```bash
  $ npm start data_240.csv 

  > optimal-trades@1.0.0 start
  > node index.js "data_240.csv"

  Open at 0 (1.2546), close 58 (1.2796) for profit 0.025
  Open at 64 (1.2635), close 94 (1.2845) for profit 0.021
  Open at 101 (1.275), close 138 (1.2929) for profit 0.0179
  Open at 139 (1.2846), close 169 (1.3016) for profit 0.017
  Open at 178 (1.2943), close 228 (1.3728) for profit 0.0785
  Total profit 0.1594
```


## The Algorithm

### Assumptions

* The data is contiguous in time, so there are no gaps.
* The data is in monotonically increasing order on time.


### Process

```
  minHold = 1, maxHold = 2

      2   1   4   4   6
  1.  *
  2.  *   *
  3.  <---2---|
          <-3-|
  4.      <---3---|
  5.          <---2---|
          <-3-|   <-1-|   Total: 4
```

Strategy:
* For each time value, store the best sequence of trades up to that point in time.
* When receiving the j'th data point, look back to see which trades could be made to close at j. Let's suppose one such trade is (i, j), so that it opens at i, and closes at j.
* Create a new trade list based on the best trades to reach i-1, combined with the (i, j) trade.
* Store the best trade sequence for j that closes at, or before, j.
* After the last data point, traverse the final list of trades in reverse order.

## Bugs and feedback

Please feel welcome to send me bugs and feedback.
