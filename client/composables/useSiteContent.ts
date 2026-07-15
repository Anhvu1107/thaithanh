import { defaultSiteContent } from '~/data/staticSite'
import type { SiteContent } from '~/types/static-site.types'

export const useSiteContent = () => {
  const content = useState<SiteContent>('site-content', () => defaultSiteContent)

  return {
    content,
  }
}
