/**
 * Dynamically parses comma-separated platform strings from an extension
 * (e.g. "PC, Mac, PlayStation, Xbox") into normalized option objects.
 */
export function parsePlatforms(platformsStr, ownedPlatforms = [], alreadyOwnedLabel = ' (Ya adquirida)') {
  if (!platformsStr || typeof platformsStr !== 'string') {
    const defaults = ['PC', 'PlayStation', 'Xbox']
    return defaults.map((p) => {
      const isOwned = ownedPlatforms.some((op) => op.toLowerCase() === p.toLowerCase())
      return {
        value: p,
        label: p + (isOwned ? ` ${alreadyOwnedLabel}`.replace(/\s+/g, ' ') : ''),
        disabled: isOwned,
      }
    })
  }

  const rawList = platformsStr.split(',').map((s) => s.trim()).filter(Boolean)
  return rawList.map((raw) => {
    // Check if this specific platform is already owned
    const isOwned = ownedPlatforms.some(
      (op) => op.toLowerCase() === raw.toLowerCase() ||
              (op.toLowerCase().includes('pc') && raw.toLowerCase().includes('pc')) ||
              (op.toLowerCase().includes('ps') && raw.toLowerCase().includes('playstation')) ||
              (op.toLowerCase().includes('xbox') && raw.toLowerCase().includes('xbox'))
    )

    return {
      value: raw,
      label: raw + (isOwned ? ` ${alreadyOwnedLabel}`.replace(/\s+/g, ' ') : ''),
      disabled: isOwned,
    }
  })
}

/**
 * Dynamically parses comma-separated language strings from an extension
 * (e.g. "Español, Inglés") into normalized option objects.
 */
export function parseLanguages(languagesStr) {
  if (!languagesStr || typeof languagesStr !== 'string') {
    return [
      { value: 'ES', label: 'Español' },
      { value: 'EN', label: 'Inglés' },
    ]
  }

  const rawList = languagesStr.split(',').map((s) => s.trim()).filter(Boolean)
  return rawList.map((raw) => {
    let value = 'ES'
    const lower = raw.toLowerCase()
    if (lower.startsWith('ing') || lower.startsWith('en')) {
      value = 'EN'
    } else if (lower.startsWith('fra') || lower.startsWith('fr')) {
      value = 'FR'
    } else if (lower.startsWith('deu') || lower.startsWith('de')) {
      value = 'DE'
    } else {
      value = raw
    }

    return {
      value,
      label: raw,
    }
  })
}
