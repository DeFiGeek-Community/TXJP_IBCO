const BN = web3.utils.BN
const TXJP = artifacts.require("FakeTXJP")
const InitialOffering = artifacts.require("TXJPInitialOffering")
const MainnetTxjpAddress = process.env.TXJP_ADDRESS

module.exports = async function (deployer, network) {
    if (["development", "develop", 'soliditycoverage'].indexOf(network) >= 0) {
      await deployer.deploy(TXJP)
      await deployer.deploy(InitialOffering, TXJP.address)
  } else if (["testnet", "rinkeby"].indexOf(network) >= 0) {
      await deployer.deploy(TXJP)
      await deployer.deploy(InitialOffering, TXJP.address)
  } else if (["main"].indexOf(network) >= 0) {
      await deployer.deploy(InitialOffering, MainnetTxjpAddress)
  } else {
      throw Error(`wrong network ${network}`)
  }
}
