// hooks/useCountries.ts
import countryUtils from "@/utils/countryUtils";
// This hook is used to reuse the same utility
const useCountries = () => {
  // You could add state here if needed
  return countryUtils; // Reuses the same utility
};

export default useCountries;