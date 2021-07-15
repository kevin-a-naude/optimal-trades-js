const fs = require('fs');
const yargs = require('yargs');

const { findOptimalTrades } = require('./find-optimal-trades');

const args = yargs
    .command('$0 <file>', 'compute an optimal sequence of trades to maximise profit', yargs => {
        yargs.positional('file', { type: 'string', demandOption: true, describe: 'csv file to process' });
    })
    .options({
        m: { type: 'number', alias: 'min-hold', default: 30 },
        n: { type: 'number', alias: 'max-hold', default: 59 },
    })
    .help()
    .argv
;

/* main function */
async function run() {
    let solution = await solveFile(args.file, args.m, args.n);
    printSolution(solution);
}

async function solveFile(filename, minHold = 30, maxHold = 59) {
    return await findOptimalTrades(fs.createReadStream(filename), minHold, maxHold);
}

function printSolution(tradeList) {
    let array = tradeList.toArray();

    for (let trade of array) {
        console.log(trade.toString());
    }

    console.log(`Total profit ${tradeList.cumulativeProfit.toString()}`);
}

/* This incantation let's us run async await above. */
(async () => await run())();
