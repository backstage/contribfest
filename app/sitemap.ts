import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE_URL = 'https://contribfest.backstage.io'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/contrib-champs/`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/getting-started/`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/hall-of-hosts/`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/issues/`,
      lastModified: new Date(),
    },
  ]
}
