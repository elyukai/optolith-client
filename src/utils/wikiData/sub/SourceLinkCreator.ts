import { SourceLink } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const SourceLinkCreator =
  fromDefault<SourceLink> ({
    id: '',
    page: 0,
  })

export const SourceLinkG = makeGetters (SourceLinkCreator)

export const createSourceLink = (id: string) => (page: number) => SourceLinkCreator ({ id, page })
