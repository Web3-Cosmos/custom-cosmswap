export type EnumStr = string & {}
export type Primitive = boolean | number | string | bigint
export type StringNumber = string | number
export type ObjectNotArray = { [key: string]: any }

export type AnyFn = (...args: any[]) => any
export type AnyObj = { [key: string]: any }
export type AnyArr = any[]

export type MayFunction<T, Params extends any[] = []> =
  | T
  | ((...params: Params) => T)
export type MayPromise<T> = T | Promise<T>
export type MayArray<T> = T | T[]
export type DeMayArray<T extends MayArray<any>> = T extends any[]
  ? T[number]
  : T

export type NotFunctionValue = Exclude<any, AnyFn>
export type Stringish = Primitive | Nullish | { toString(): any }
export type Nullish = undefined | null
export type PublicKeyish = HexAddress
export type Numberish = number | string | bigint
export type BooleanLike = unknown // any value that can transform to boolean

export type Entry<Key = any, Value = any> = [Key, Value]
export type Entriesable<Key = any, Value = any> =
  | [Key, Value][] // already is entries
  | AnyCollection<Key, Value>
export type AnyCollection<Key = any, Value = any> =
  | Array<Value>
  | Set<Value>
  | Map<Key, Value>
  | Record<Key & string, Value>

/**
 * e.g. mintAdress
 */
export type AdressKey = string
export type ID = string

/** a string of readless charateries (like: base64 string)  */
export type HexAddress = string

/** a string of charateries represent a link href */
export type LinkAddress = string

/** use it in <img>'src */
export type SrcAddress = string

/** (like: '1379.92%' '80%' 0.8) */
export type PercentString = string
export type DateInfo = string | number | Date

/** used by gesture: pointer move */
export type Delta2dTranslate = {
  // distance in x (px)
  dx: number
  // distance in y (px)
  dy: number
}

export type Vector = {
  /** distance in x axis */
  x: number
  /** distance in y axis */
  y: number
}
export type SpeedVector = Vector

export type Swap = 'SWAP'
export type LimitOrder = 'LIMIT ORDER'
export type StopLoss = 'STOP LOSS'
export type Transfer = 'TRANSFER'
export type Liquidity = 'LIQUIDITY'

export type SwapMode = Swap | LimitOrder | StopLoss | Transfer | Liquidity

export type TransactionKind = 'deposit' | 'withdraw'
export type TransactionOrigin = 'platform' | 'wallet'
export type TransactionType = 'incoming' | 'outgoing'
