const englishOrdinalRules = new Intl.PluralRules("en", { type: "ordinal" });
const suffixes = { one: "st", two: "nd", few: "rd", other: "th" };
export const toOrdinal = (num: number) => num + suffixes[englishOrdinalRules.select(num) as keyof typeof suffixes];
