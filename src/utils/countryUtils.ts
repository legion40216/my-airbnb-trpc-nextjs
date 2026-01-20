// lib/countryUtils.ts
import worldCountries from 'world-countries';

// ✅ Export the type
export type Country = {
  value: string;
  label: string;
  flag: string;
  latlng: [number, number];
  region: string;
};

const formattedCountries: Country[] = worldCountries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const countryUtils = {
  getAll: (): Country[] => formattedCountries,
  getByValue: (value: string): Country | undefined =>
    formattedCountries.find((item) => item.value === value),
};

export default countryUtils;