
const TXJPContract = artifacts.require("FakeTXJP")
const TXJPIOContract = artifacts.require("TXJPInitialOffering")
const { BN, isBN, toWei, fromWei } = web3.utils


const send = (method, params = []) =>
  new Promise((resolve, reject) =>
    web3.currentProvider.send({id: 0, jsonrpc: "2.0", method, params}, (err, x) => {
        if(err) reject(err)
        else resolve(x)
    })
  )

const getIOContracts = () => Promise.all([
    TXJPIOContract.deployed(),
    TXJPContract.deployed()
]).then(([InitialOffering, TXJP]) => ({InitialOffering, TXJP}))

const snapshot = () => send("evm_snapshot").then(x => x.result)
const revert = (snap) => send("evm_revert", [snap])
const timeTravel = async (seconds) => {
  await send("evm_increaseTime", [seconds])
  await send("evm_mine")
}

module.exports = {
    getIOContracts,
    timeTravel, snapshot, revert,
    toWei: (value) => toWei(value.toString(), "ether"),
    fromWei: (value) => fromWei(isBN(value) ? value : new BN(value), 'ether'),
}
