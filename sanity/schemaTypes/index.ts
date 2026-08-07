import { type SchemaTypeDefinition } from 'sanity'
import category from './category'
import author from './author'
import software from './software'
import article from './article'
import comparison from './comparison'
import adSlot from './adSlot'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, author, software, article, comparison, adSlot],
}