/**
 * Utility functions for parsing extension options (platforms and languages)
 */

/**
 * Parses a platform string or array into selector options.
 * Disables options that are present in ownedPlatforms.
 *
 * @param {string|Array} platformsStr - Comma separated platforms string (e.g. "PC, PS5, Xbox") or array
 * @param {Array} ownedPlatforms - List of platforms already owned by the user
 * @param {string} alreadyOwnedLabel - Label suffix for owned platforms (e.g. "(Ya adquirida)")
 * @returns {Array<{value: string, label: string, disabled: boolean}>}
 */
export function parsePlatforms(platformsStr, ownedPlatforms = [], alreadyOwnedLabel = '(Ya adquirida)') {
  if (!platformsStr) return []

  let list = []
  if (Array.isArray(platformsStr)) {
    list = platformsStr
  } else if (typeof platformsStr === 'string') {
    list = platformsStr.split(',').map((p) => p.trim()).filter(Boolean)
  }

  const ownedSet = new Set(
    (ownedPlatforms || []).map((p) => String(p).trim().toLowerCase())
  )

  return list.map((platform) => {
    const isOwned = ownedSet.has(String(platform).trim().toLowerCase())
    return {
      value: platform,
      label: isOwned ? `${platform} ${alreadyOwnedLabel}`.trim() : platform,
      disabled: isOwned,
    }
  })
}

/**
 * Parses a languages string or array into selector options.
 *
 * @param {string|Array} languagesStr - Comma separated languages string (e.g. "ES, EN") or array
 * @returns {Array<{value: string, label: string}>}
 */
export function parseLanguages(languagesStr) {
  if (!languagesStr) return []

  let list = []
  if (Array.isArray(languagesStr)) {
    list = languagesStr
  } else if (typeof languagesStr === 'string') {
    list = languagesStr.split(',').map((l) => l.trim()).filter(Boolean)
  }

  return list.map((langItem) => ({
    value: langItem,
    label: langItem,
  }))
}
