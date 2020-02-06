import { Either, fromLeft_, fromRight_, isLeft, Left, Right } from "../../../Data/Either"
import { IO } from "../../../System/IO"

type MapToEitherIO<L, A> = { [K in keyof A]: IO<Either<L, A [K]>> }

type MaoEitherIORejected<L, A> = { [K in keyof A]?: L }

export type MapEitherIO<L, A> = IO<Either<MaoEitherIORejected<L, A>, A>>

export const mapMObjectIO =
  async <L, A> (obj: MapToEitherIO<L, A>): MapEitherIO<L, A> => {
    const res: A = {} as A
    let err: MaoEitherIORejected<L, A> | undefined = undefined

    for (const [ key, ioValue ] of Object.entries (obj) as [keyof A, IO<Either<L, any>>][]) {
      const value = await ioValue

      if (isLeft (value)) {
        err = { ...(err ?? {}), [key]: fromLeft_ (value) }
      }
      else {
        res [key] = fromRight_ (value)
      }
    }

    if (err !== undefined) {
      return Left (err)
    }

    return Right (res)
  }
