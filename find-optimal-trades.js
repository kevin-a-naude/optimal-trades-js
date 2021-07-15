const csv = require('fast-csv');

const { TradeSolver } = require('./solver/trade-solver');

function streamPromise(stream) {
    var promise = new Promise((resolve, reject) => {
        stream
            .on('error', error => reject(error))
            .on('end', _ => resolve());
    });
    return promise;
}

async function findOptimalTrades(sourceStream, minHold, maxHold) {
    var solver = new TradeSolver(minHold, maxHold);

    let stream = sourceStream
        .pipe(csv.parse({ headers: true }))
        .on('data', row => solver.recordPrice(Number(row.Time), row.Price));

    await streamPromise(stream);

    return solver.leadingTradeList;
}

module.exports = {
    findOptimalTrades,
};
