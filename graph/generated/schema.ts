// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class ExampleEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save ExampleEntity entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save ExampleEntity entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("ExampleEntity", id.toString(), this);
  }

  static load(id: string): ExampleEntity | null {
    return store.get("ExampleEntity", id) as ExampleEntity | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }

  get account(): Bytes {
    let value = this.get("account");
    return value.toBytes();
  }

  set account(value: Bytes) {
    this.set("account", Value.fromBytes(value));
  }

  get userShare(): BigInt {
    let value = this.get("userShare");
    return value.toBigInt();
  }

  set userShare(value: BigInt) {
    this.set("userShare", Value.fromBigInt(value));
  }
}

export class EventInfo extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save EventInfo entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save EventInfo entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("EventInfo", id.toString(), this);
  }

  static load(id: string): EventInfo | null {
    return store.get("EventInfo", id) as EventInfo | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get START(): BigInt {
    let value = this.get("START");
    return value.toBigInt();
  }

  set START(value: BigInt) {
    this.set("START", Value.fromBigInt(value));
  }

  get END(): BigInt {
    let value = this.get("END");
    return value.toBigInt();
  }

  set END(value: BigInt) {
    this.set("END", Value.fromBigInt(value));
  }

  get MINIMAL_PROVIDE_AMOUNT(): BigInt {
    let value = this.get("MINIMAL_PROVIDE_AMOUNT");
    return value.toBigInt();
  }

  set MINIMAL_PROVIDE_AMOUNT(value: BigInt) {
    this.set("MINIMAL_PROVIDE_AMOUNT", Value.fromBigInt(value));
  }

  get TOTAL_DISTRIBUTE_AMOUNT(): BigInt {
    let value = this.get("TOTAL_DISTRIBUTE_AMOUNT");
    return value.toBigInt();
  }

  set TOTAL_DISTRIBUTE_AMOUNT(value: BigInt) {
    this.set("TOTAL_DISTRIBUTE_AMOUNT", Value.fromBigInt(value));
  }

  get totalProvided(): BigInt {
    let value = this.get("totalProvided");
    return value.toBigInt();
  }

  set totalProvided(value: BigInt) {
    this.set("totalProvided", Value.fromBigInt(value));
  }
}

export class PersonalBalance extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PersonalBalance entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PersonalBalance entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PersonalBalance", id.toString(), this);
  }

  static load(id: string): PersonalBalance | null {
    return store.get("PersonalBalance", id) as PersonalBalance | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }
}
