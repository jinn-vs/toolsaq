import { defineQuery } from 'next-sanity'

export const ALL_SOFTWARE_QUERY = defineQuery(`
  *[_type == "software"] | order(name asc) {
    _id,
    name,
    slug,
    tagline,
    logo,
    "category": category->name
  }
`)

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description
  }
`)