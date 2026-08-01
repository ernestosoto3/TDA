function getTranslationValue(catalog: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((currentValue, segment) => {
    if (typeof currentValue !== 'object' || currentValue === null || !(segment in currentValue)) {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[segment];
  }, catalog);
}

export function findMissingTranslationKeys(
  catalog: Record<string, unknown>,
  requiredKeys: readonly string[],
): string[] {
  return requiredKeys.filter((key) => {
    const value = getTranslationValue(catalog, key);

    return typeof value !== 'string' || value.trim().length === 0;
  });
}
