require('dotenv').config()

const web3 = require('web3')
const initialOfferingAddr = "0x7Aa8d0782A41A5aC12d84fE573e3874D13469976"
const alice = "0xdAe503Fd260358b8f344D136160c299530006170"
const Eth = require('web3-eth')
const eth = new Eth(`https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`)
const { Contract } = eth
const { privateToAddress, toBuffer } = require('ethereumjs-util')

var contract = new Contract([
    {
        "type":"function",
        "name":"transferOwnership",
        "inputs": [{"name":"newOwner","type":"address"}],
    },
    {
        "type":"function",
        "name":"owner",
        "inputs": [],
        "outputs": [{"name":"owner","type":"address"}],
    }

], initialOfferingAddr);



(async ()=>{
    const currentOwner = await contract.methods.owner().call();

    /* You can switch addresses to test transfer on your side */
    const ownerTestObj = (currentOwner.toLowerCase() === getAddressFromPK(process.env.PK)) ?
        { pk: process.env.PK, addr: getAddressFromPK(process.env.PK) }
        :
        { pk: process.env.PK2, addr: getAddressFromPK(process.env.PK2) }

    eth.accounts.wallet.add(ownerTestObj.pk)
    eth.defaultAccount = ownerTestObj.addr


    let r;
    try {
        const bob = "0xB1330357FD4254D82D3584293308f51159067660"
        // const bob = "0xD2dd063B77cdB7b2823297a305195128eF2C300c"
        r = await contract.methods.transferOwnership(bob).send({
            from: ownerTestObj.addr, gas: 1000000
        })
        console.log(r);
    } catch (e) {
        console.trace(e.message);
    }
})().then()


function getAddressFromPK(pk){
    return '0x'+privateToAddress(toBuffer('0x' + pk)).toString('hex');
}