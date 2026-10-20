import { deepEqual } from "@elyukai/utils/equality"
import type { TSONDBTypes } from "@optolith/database-schema"
import type { Cache } from "@optolith/database-schema/cache"
import type * as Gen from "@optolith/database-schema/gen"
import type { GetResolvedSelectOptionById } from "@optolith/entity-descriptions/entities/partial/prerequisites/single/activatable"
import type { Debugger } from "debug"
import type { ReadonlyTSONDB } from "tsondb/readonly"
import { fromUniformCase, type IdArgsVariant } from "tsondb/schema/gen"

export type Database = ReadonlyTSONDB<TSONDBTypes>

export type GetInstanceById<in T extends Extract<keyof Gen.EntityMap, string>> = <U extends T>(
  ...args: IdArgsVariant<Gen.EntityMap, U>
) => Gen.EntityMap[U] | undefined

export type GetAllInstances<in T extends keyof Gen.EntityMap> = <U extends T>(
  entity: U,
) => { id: string; content: Gen.EntityMap[U] }[]

export type GetAllChildInstancesForParent<in T extends keyof Gen.ChildEntityMap> = <U extends T>(
  entity: U,
  parentId: Gen.ChildEntityMap[U][2],
) => { id: string; content: Gen.ChildEntityMap[U][0] }[]

export type DatabaseHandlers = {
  getInstanceById: <U extends keyof Gen.EntityMap>(
    ...args: IdArgsVariant<Gen.EntityMap, U>
  ) => Promise<Gen.EntityMap[U] | undefined>
  getAllInstances: <U extends keyof Gen.EntityMap>(
    entity: U,
  ) => Promise<{ id: string; content: Gen.EntityMap[U] }[]>
  getChildrenInstancesByParentId: <U extends keyof Gen.ChildEntityMap>(
    entity: U,
    parentId: Gen.ChildEntityMap[U][2],
  ) => Promise<{ id: string; content: Gen.ChildEntityMap[U][0] }[]>
  getResolvedSelectOptionById: (
    ...args: Parameters<GetResolvedSelectOptionById>
  ) => Promise<ReturnType<GetResolvedSelectOptionById>>
  getCache: () => Promise<Cache>
}

export type DatabaseEventNames = {
  "db:get": "getInstanceById"
  "db:getall": "getAllInstances"
  "db:getchildren": "getChildrenInstancesByParentId"
  "db:getresolved": "getResolvedSelectOptionById"
  "db:getcache": "getCache"
}

export type DatabaseEvents = {
  [K in keyof DatabaseEventNames]: (
    ...args: Parameters<DatabaseHandlers[DatabaseEventNames[K]]>
  ) => Awaited<ReturnType<DatabaseHandlers[DatabaseEventNames[K]]>>
}

export const attachDatabaseEventsMain = (
  ipcMain: Electron.IpcMain,
  db: ReadonlyTSONDB<TSONDBTypes>,
  cache: Cache,
  onError: (name: keyof DatabaseHandlers, event: Electron.IpcMainEvent, error: unknown) => void,
) => {
  const databaseHandlers: DatabaseEvents = {
    "db:get": (...args) => db.getInstanceOfEntityById(...args),
    "db:getall": (...args) => db.getAllInstanceContainersOfEntity(...args),
    "db:getchildren": (...args) => db.getAllChildInstanceContainersForParent(...args),
    "db:getresolved": (parentId, id) =>
      cache.activatableSelectOptions[parentId.kind][fromUniformCase(parentId)]?.find(option =>
        deepEqual(option.id, id),
      ),
    "db:getcache": () => cache,
  }

  for (const [name, handler] of Object.entries(databaseHandlers) as [
    keyof DatabaseHandlers,
    (...args: unknown[]) => unknown,
  ][]) {
    const listener = (event: Electron.IpcMainEvent, ...args: any[]): void => {
      try {
        event.returnValue = (handler as (...args: unknown[]) => unknown)(
          ...(args as Parameters<DatabaseHandlers[typeof name]>),
        )
      } catch (error) {
        onError(name, event, error)
        event.returnValue = undefined
      }
    }
    ipcMain.on(name, listener)
  }
}

export const attackDatabaseHandlersToPreloadAPI = (
  debug: Debugger,
  ipcRenderer: Electron.IpcRenderer,
): DatabaseHandlers => ({
  getInstanceById: (...args) => {
    debug("get instance by id %O", args)
    return ipcRenderer.invoke("db:get", ...args)
  },
  getAllInstances: (...args) => {
    debug("get all instances for $s", ...args)
    return ipcRenderer.invoke("db:getall", ...args)
  },
  getChildrenInstancesByParentId: (...args) => {
    debug("get children instances for parent %O", args)
    return ipcRenderer.invoke("db:getchildren", ...args)
  },
  getResolvedSelectOptionById: (...args) => {
    debug("get resolved select option by id %O", args)
    return ipcRenderer.invoke("db:getresolved", ...args)
  },
  getCache: (...args) => {
    debug("get cache")
    return ipcRenderer.invoke("db:getcache", ...args)
  },
})

// export const attackDatabaseHandlersToPreloadAPI = (
//   debug: Debugger,
//   ipcRenderer: Electron.IpcRenderer,
// ): DatabaseHandlers => {
//   const singleEntryDatabaseCache: Partial<{
//     [E in keyof Database.EntityMap]: Partial<Record<string, Database.EntityMap[E]>>
//   }> = {}
//   const allEntriesDatabaseCache: Partial<{
//     [E in keyof Database.EntityMap]: { id: string; content: Database.EntityMap[E] }[]
//   }> = {}
//   let cacheCache: Cache | undefined = undefined

//   return {
//     getInstanceById: async (...args) => {
//       const { entityName, id } = normalizedIdArgs(args)
//       debug("get instance of entity $s by id %s", entityName, id)
//       const entityCache = (singleEntryDatabaseCache[entityName] ??= {}) as Partial<
//         Record<string, Database.EntityMap[typeof entityName]>
//       >
//       entityCache[id] ??= (await ipcRenderer.invoke("db:get", entityName, id)) as
//         | Database.EntityMap[typeof entityName]
//         | undefined
//       return entityCache[id]
//     },
//     getAllInstances: async entity => {
//       debug("get all instances for s", entity)
//       ;(allEntriesDatabaseCache[entity] as {
//         id: string
//         content: Database.EntityMap[typeof entity]
//       }[]) ??= (await ipcRenderer.invoke("db:getall", entity)) as {
//         id: string
//         content: Database.EntityMap[typeof entity]
//       }[]
//       return allEntriesDatabaseCache[entity] ?? []
//     },
//     getChildrenInstancesByParentId: async (...args) => {
//       debug("get children instances for parent %O", args)
//       return ipcRenderer.invoke("db:getchildren", ...args)
//     },
//     getResolvedSelectOptionById: async (parentId, id) => {
//       debug("get resolved select option of parent $O by id %O", parentId, id)
//       cacheCache ??= (await ipcRenderer.invoke("db:getcache")) as Cache
//     },
//     getCache: async () => {
//       debug("get cache")
//       cacheCache ??= (await ipcRenderer.invoke("db:getcache")) as Cache
//       return ipcRenderer.invoke("db:getcache")
//     },
//   }
// }
