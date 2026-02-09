import Version from "@fi4f/v";

export declare const __kind__: unique symbol;

export const VERSION = Version.new({
  moniker: "id",
  major  : 0,
  minor  : 1,
  patch  : 1,
})


export type Id<T> = string & {[__kind__] ?: T}

export namespace Id {
  export type Table = {
    [id: Id<any>]: any
  }
}

const Table = {
  new() {
    return {} satisfies Id.Table
  },

  acquire<T>(table: Id.Table, what: T, id ?: string) {
    id ??= Table.uniqueId(table)
    if (id in table)
      throw new Error(`[Id.acquire] Entry with id '${id}' already exists`)
    table[id] = what
    return id as Id<T>
  },

  request<T>(table: Id.Table, id: Id<T>) {
    if (!(id in table))
      throw new Error(`[Id.request] Entry with id '${id}' does not exist`)
    return table[id] as T
  },

  release<T>(table: Id.Table, id: Id<T>) {
    if (!(id in table))
      throw new Error(`[Id.release] Entry with id '${id}' does not exist`)
    delete table[id]
  },

    wrap<T>(table: Id.Table, what: T | Id<T>) {
    if (typeof what === "string")
      return what as Id<T>
    else
      return Table.acquire(table, what)
  },

  unwrap<T>(table: Id.Table, what: T | Id<T>) {
    if (typeof what === "string")
      return Table.request(table, what)
    else
      return what as T
  },

  uniqueId(ids: Id.Table) {
    let id = crypto.randomUUID()
    while (id in ids)
        id = crypto.randomUUID()
    return id
  }
}

const __table__ = Table.new()

export const Id = {
  __table__,
  Table,

  acquire<T>(what: T, id ?: string, use: Id.Table = __table__) {
    return Table.acquire(use, what, id)
  },

  request<T>(id: Id<T>, use: Id.Table = __table__) {
    return Table.request(use, id)
  },

  release<T>(id: Id<T>, use: Id.Table = __table__) {
    return Table.release(use, id)
  },

    wrap<T>(what: T | Id<T>, use: Id.Table = __table__) {
    return Table.wrap(use, what)
  },

  unwrap<T>(what: T | Id<T>, use: Id.Table = __table__) {
    return Table.unwrap(use, what)
  },
}

export { Version } from "@fi4f/v"