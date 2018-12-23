import { Categories } from '../../../constants/Categories';
import { ProfessionSelectionIds } from '../../../types/wiki';
import { Maybe } from '../../structures/Maybe';
import { Omit, Record } from '../../structures/Record';

export type RequiredExceptCategoryFunction<A extends { category: Categories }> =
(x: Omit<A, 'category'>) => Record<A>

export type RequiredExceptIdFunction<A extends { id: ProfessionSelectionIds }> =
(x: Omit<A, 'id'>) => Record<A>

export type RequiredFunction<A> = (x: Required<A>) => Record<A>

type PartialMaybeRequiredKeys<A> = {
[K in keyof A]: A[K] extends Maybe<any> ? never : K
} [keyof A]

type PartialMaybePartialKeys<A> = {
[K in keyof A]: A[K] extends Maybe<any> ? K : never
} [keyof A]

type PartialMaybe<A> = {
[K in PartialMaybeRequiredKeys<A>]-?: A[K] extends Maybe<any> ? never : A[K]
} & {
[K in PartialMaybePartialKeys<A>]?: A[K] extends Maybe<any> ? A[K] : never
}

export type PartialMaybeFunction<A> = (x: PartialMaybe<A>) => Record<A>
