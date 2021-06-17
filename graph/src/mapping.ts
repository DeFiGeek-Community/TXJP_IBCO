import { BigInt } from "@graphprotocol/graph-ts"
import {
  TXJPInitialOffering,
  Claimed,
  OwnershipTransferred,
  Received
} from "../generated/TXJPInitialOffering/TXJPInitialOffering"
import { ExampleEntity, EventInfo, PersonalBalance } from "../generated/schema"

export function handleClaimed(event: Claimed): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = BigInt.fromI32(1).plus(entity.count)

  // Entity fields can be set based on event parameters
  entity.account = event.params.account
  entity.userShare = event.params.userShare

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.END(...)
  // - contract.MINIMAL_PROVIDE_AMOUNT(...)
  // - contract.START(...)
  // - contract.TOTAL_DISTRIBUTE_AMOUNT(...)
  // - contract.TXJP(...)
  // - contract.owner(...)
  // - contract.provided(...)
  // - contract.totalProvided(...)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleReceived(event: Received): void {
  // EventInfo
  let id = event.transaction.to.toHex()
  let eventBalance = EventInfo.load(id)
  if (eventBalance == null) {
    // initialize
    eventBalance = new EventInfo(id)
    let contract = TXJPInitialOffering.bind(event.address)
    eventBalance.START = contract.START()
    eventBalance.END =  contract.END()
    eventBalance.MINIMAL_PROVIDE_AMOUNT = contract.MINIMAL_PROVIDE_AMOUNT()
    eventBalance.TOTAL_DISTRIBUTE_AMOUNT =  contract.TOTAL_DISTRIBUTE_AMOUNT()
    eventBalance.totalProvided = BigInt.fromI32(0)
  }

  // update totalProvided
  eventBalance.totalProvided = eventBalance.totalProvided.plus(event.params.amount)
  eventBalance.save()


  // PersonalBalance
  let personalId = event.transaction.from.toHex()
  let personalBalance = PersonalBalance.load(personalId)
  if (personalBalance == null) {
    // initialize
    personalBalance = new PersonalBalance(personalId)
    personalBalance.amount = BigInt.fromI32(0)
  }

  // update provided
  personalBalance.amount = personalBalance.amount.plus(event.params.amount)
  personalBalance.save()
}
