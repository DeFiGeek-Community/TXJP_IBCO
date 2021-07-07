const {getIOContracts, toWei, fromWei, timeTravel, snapshot, revert} = require("../utils/utils.js")
const toBN = web3.utils.toBN
const params = {
    BCSupply: toBN("3600000000000")
}

contract("InitialOffering", ([user1, user2, user3, user4]) => {
    const contract = getIOContracts()



    it("Should provide TXJP to InitialOffering contract", async () => {
        const {InitialOffering, TXJP} = await contract
        await TXJP.mintTo(InitialOffering.address, params.BCSupply)
    })

    it("Shouldn't withdraw TXJP before start", async () => {
        const {InitialOffering} = await contract
        await InitialOffering.withdrawTXJP().then(
            () => assert.fail("The owner withdraw TXJP before start"),
            x => assert.equal(x.reason, "The offering must be completed")
        )
    })


    it("Shouldn't receive ETH before the offering", async () => {
        const {InitialOffering} = await contract
        await InitialOffering.sendTransaction({value:100000000, from:user1})
            .then(
                () => assert.fail("ETH was provided"),
                x => assert.equal(x.reason, "The offering has not started yet")
            )
    })

    it("Should receive ETH during the offering", async () => {
        lastSnapshot = await snapshot()
        try {
            const {InitialOffering} = await contract
            const start = await InitialOffering.START()
            const delta = parseInt(start - Date.now() / 1000) + 1

            await timeTravel(delta)
            await InitialOffering.sendTransaction({value:100000000, from:user1})
                .catch(() => assert.fail("ETH provide was reverted"))
            await timeTravel(24*3600)
            await InitialOffering.sendTransaction({value:100000000, from:user1})
                .catch(() => assert.fail("ETH provide was reverted"))
            await timeTravel(24*3600)
            await InitialOffering.sendTransaction({value:100000000, from:user1})
                .catch(() => assert.fail("ETH provide was reverted"))
            await timeTravel(24*3600)
            await InitialOffering.sendTransaction({value:100000000, from:user1})
                .catch(() => assert.fail("ETH provide was reverted"))
            await timeTravel(24*3600)
            await InitialOffering.sendTransaction({value:100000000, from:user1})
                .catch(() => assert.fail("ETH provide was reverted"))
            await timeTravel(12*3600-1)
            await InitialOffering.sendTransaction({value:100000000, from:user1})
                .catch(() => assert.fail("ETH provide was reverted during the offering"))
        } finally {
            await revert(lastSnapshot)
        }
    })

    it("Shouldn't receive ETH after the offering", async () => {
        lastSnapshot = await snapshot()
        try {
            const {InitialOffering} = await contract
            const start = await InitialOffering.START()
            const delta = parseInt(start - Date.now() / 1000) + 5.5*24*3600 + 2

            await timeTravel(delta)
            await InitialOffering.sendTransaction({value:100000000, from:user1})
                .then(
                    () => assert.fail("ETH was provided"),
                    x => assert.equal(x.reason, "The offering has already ended")
                )
        } finally {
            await revert(lastSnapshot)
        }
    })

    it("Should claim TXJP after the offering (was provided enough)", async () => {
        lastSnapshot = await snapshot()
        try {
            const {InitialOffering, TXJP} = await contract
            const start = await InitialOffering.START()
            const delta = parseInt(start - Date.now() / 1000) + 1

            const startBalance = await Promise.all([
                TXJP.balanceOf(user1).then(toBN),
                TXJP.balanceOf(user2).then(toBN),
                TXJP.balanceOf(user3).then(toBN),
                TXJP.balanceOf(user4).then(toBN),
            ])

            await timeTravel(delta)
            await InitialOffering.sendTransaction({value:toWei(1000), from:user1})
            await InitialOffering.sendTransaction({value:toWei(2000), from:user2})
            await InitialOffering.sendTransaction({value:toWei(500), from:user4})
            await InitialOffering.sendTransaction({value:toWei(1000), from:user2})
            await InitialOffering.sendTransaction({value:toWei(2000), from:user3})
            await timeTravel(5.5 * 24 * 3600 + 1)
            await InitialOffering.claim({from: user1})
            await InitialOffering.claim({from: user2})
            await InitialOffering.claim({from: user3})
            await InitialOffering.claim({from: user4})


            const deltaBalance = await Promise.all([
                TXJP.balanceOf(user1).then(toBN),
                TXJP.balanceOf(user2).then(toBN),
                TXJP.balanceOf(user3).then(toBN),
                TXJP.balanceOf(user4).then(toBN),
            ]).then(x => x.map((x,i) => x.sub(startBalance[0]).toString()))
            const _totalSupply = await TXJP.totalSupply().then(toBN);
            assert.equal(deltaBalance[0], Math.floor(_totalSupply * 1000 / 6500))
            assert.equal(deltaBalance[1], Math.floor(_totalSupply * 3000 / 6500))
            assert.equal(deltaBalance[2], Math.floor(_totalSupply * 2000 / 6500))
            assert.equal(deltaBalance[3], Math.floor(_totalSupply * 500 / 6500))

            await InitialOffering.withdrawProvidedETH()
            const contractBalance = await web3.eth
                .getBalance(InitialOffering.address)
                .then(x => x.toString())
            assert.equal(contractBalance, "0")

            await InitialOffering.withdrawTXJP().then(
                () => assert.faild("TXJP was withdrawn"),
                x => assert.equal(x.reason, "The required amount has been provided!")
            )
        } finally {
            await revert(lastSnapshot)
        }
    })

    it("Should claim ETH after the offering (was provided less than necessary)", async () => {
        lastSnapshot = await snapshot()
        try {
            const {InitialOffering, TXJP} = await contract
            const start = await InitialOffering.START()
            const delta = parseInt(start - Date.now() / 1000) + 1

            const startBalance = await Promise.all([
                TXJP.balanceOf(user1).then(toBN),
                TXJP.balanceOf(user2).then(toBN),
                TXJP.balanceOf(user3).then(toBN),
                TXJP.balanceOf(user4).then(toBN),
            ])

            await timeTravel(delta)
            await InitialOffering.sendTransaction({value:toWei(0.1), from:user1})
            await InitialOffering.sendTransaction({value:toWei(0.2), from:user2})
            await InitialOffering.sendTransaction({value:toWei(0.3), from:user4})
            await InitialOffering.sendTransaction({value:toWei(0.1), from:user2})
            await InitialOffering.sendTransaction({value:toWei(0.2), from:user3})
            await timeTravel(5.5 * 24 * 3600 + 1)
            await InitialOffering.claim({from: user1})
            await InitialOffering.claim({from: user2})
            await InitialOffering.claim({from: user3})
            await InitialOffering.claim({from: user4})


            const deltaBalance = await Promise.all([
                TXJP.balanceOf(user1).then(toBN),
                TXJP.balanceOf(user2).then(toBN),
                TXJP.balanceOf(user3).then(toBN),
                TXJP.balanceOf(user4).then(toBN),
            ]).then(x => x.map((x,i) => x.sub(startBalance[i]).toString()))
            assert.equal(deltaBalance[0], "0")
            assert.equal(deltaBalance[1], "0")
            assert.equal(deltaBalance[2], "0")
            assert.equal(deltaBalance[3], "0")

            await InitialOffering.withdrawTXJP()
            const contractBalance = await TXJP
                .balanceOf(InitialOffering.address)
                .then(x => x.toString())
            assert.equal(contractBalance, "0")

            await InitialOffering.withdrawProvidedETH().then(
                () => assert.faild("ETH was withdrawn"),
                x => assert.equal(x.reason, "The required amount has not been provided!")
            )
        } finally {
            await revert(lastSnapshot)
        }
    })

    it("Should withdrawUnclaimedTXJP only after 30 days after the end", async () => {
        lastSnapshot = await snapshot()
        try {
            const {InitialOffering, TXJP} = await contract
            const start = await InitialOffering.START()
            const delta = parseInt(start - Date.now() / 1000) + 1

            await InitialOffering.withdrawUnclaimedTXJP().then(
                () => assert.fail("Unclaimed TXJP was withdrawn too early"),
                x => assert.equal(x.reason, "Withdrawal unavailable yet")
            )

            await timeTravel(delta)
            await InitialOffering.withdrawUnclaimedTXJP().then(
                () => assert.fail("Unclaimed TXJP was withdrawn too early"),
                x => assert.equal(x.reason, "Withdrawal unavailable yet")
            )

            await timeTravel(5.5 * 24 * 3600 + 1)
            await InitialOffering.withdrawUnclaimedTXJP().then(
                () => assert.fail("Unclaimed TXJP was withdrawn too early"),
                x => assert.equal(x.reason, "Withdrawal unavailable yet")
            )
            await timeTravel(30 * 24 * 3600)
            await InitialOffering.withdrawUnclaimedTXJP()
        } finally {
            await revert(lastSnapshot)
        }
    })
})
