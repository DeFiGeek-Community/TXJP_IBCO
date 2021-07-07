# TXJP IBCO
A forked repository of Hegic IBCO.

## Spec

### Contract properties
- totalProvided = ETH amount which is accumulated on the contract
- START = 2021/7/9 JST 12:00 in unixtime (sec) for TXJP
- END = after 5 days 9 hours of START. Modification of it can break tests.
- MINIMAL_PROVIDE_AMOUNT = Currently 1 ether. This value is tightly-coupled with test code. Carefully change it and enhance `./test`
- initial owner = deployer

### Behavior
- Do not accept money before START
- Accept money after START and before END
- Do not accept money after END
- Doners can withdraw TXJP after END
- Owner can withdraw ETH after END

### Logic
- Owner locks 36000 TXJP to the initial offering contract by doing `transfer()` to the contract
- Doners claim their sharehold. This share is proportional to the ether deposit share.
- `TXJP.safeTransfer()` internally refers `_msgSender()` as sender. This is the contract address. So the claim function is sending TXJP from the contract to the doner.


## Miscellaneous
- You can change owner by `npm run changeOwner` and so multisig can be the owner.
