"use client";
import countryUtils, { Country } from "@/utils/countryUtils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LocationInputProps = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const countries = countryUtils.getAll();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Where do you want to go?</h2>
        <p className="text-muted-foreground">Find properties in any location</p>
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="location-select"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Location
        </label>
        <Select
          value={value || ""}
          onValueChange={(val) => onChange(val || undefined)}
        >
          <SelectTrigger 
            id="location-select"
            className="p-6 border-2 text-left w-full"
          >
            <SelectValue placeholder="Anywhere" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country: Country) => (
              <SelectItem
                key={country.value}
                value={country.value}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" role="img" aria-label={`${country.label} flag`}>
                    {country.flag}
                  </span>
                  <span>
                    {country.label}
                    <span className="text-muted-foreground ml-1">
                      {country.region}
                    </span>
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}