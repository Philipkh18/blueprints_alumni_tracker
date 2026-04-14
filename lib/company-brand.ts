const BRANDFETCH_CLIENT_ID = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID

export function normalizeUrlInput(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  try {
    const url = new URL(withProtocol)
    return url.toString()
  } catch {
    return null
  }
}

export function getDomainFromUrlish(value: string | null | undefined): string | null {
  const normalized = normalizeUrlInput(value)
  if (!normalized) return null

  try {
    return new URL(normalized).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function getCompanyLogoUrl(companyWebsite: string | null | undefined): string | null {
  const domain = getDomainFromUrlish(companyWebsite)
  if (!domain) return null

  if (BRANDFETCH_CLIENT_ID) {
    const params = new URLSearchParams({
      c: BRANDFETCH_CLIENT_ID,
      size: '80',
    })
    return `https://cdn.brandfetch.io/${domain}?${params.toString()}`
  }

  return `https://icons.duckduckgo.com/ip3/${domain}.ico`
}
