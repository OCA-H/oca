'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import 'flag-icons/css/flag-icons.min.css';
import { CustomDropdown, type DropdownOption } from './CustomDropdown';
import { countryForDialCode, flagClass, phoneCountries, type PhoneParts } from '../helper/phone';

const noSubscribe = () => () => {};

interface PhoneInputProps {
  /** The number input's id, for its label. */
  id: string;
  /** The number input's name; the country picker's is `${name}_country`. */
  name: string;
  value: PhoneParts;
  onChange: (value: PhoneParts) => void;
  required?: boolean;
  disabled?: boolean;
  /** For a read-only number: shown, but neither part can change. */
  readOnly?: boolean;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

/**
 * A phone number with its country: a searchable list of countries, each with its flag and
 * calling code, beside the number itself. Starts on India (+91) unless the value says otherwise.
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  name,
  value,
  onChange,
  required,
  disabled,
  readOnly,
  placeholder = 'Mobile number',
  maxLength = 20,
  autoComplete = 'tel-national',
  className = '',
  ...aria
}) => {
  // Countries share some codes (+1 is the US, Canada and more), so the one picked is kept here;
  // a code that changes from outside picks that code's main country.
  const [picked, setPicked] = useState(() => countryForDialCode(value.code));
  const countries = phoneCountries();
  const country = countries.find((c) => c.iso2 === picked && c.dialCode === value.code)?.iso2 ?? countryForDialCode(value.code);

  // Country names come from the runtime, and the server's may differ from the browser's; so the
  // page is served with only the chosen country, and the full list arrives once it is running.
  const isHydrated = useSyncExternalStore(noSubscribe, () => true, () => false);

  const options: DropdownOption[] = useMemo(
    () =>
      (isHydrated ? countries : countries.filter((c) => c.iso2 === country)).map((c) => ({
        value: c.iso2,
        label: `${c.name} (${c.dialCode})`,
        triggerLabel: c.dialCode,
        keywords: `${c.iso2} ${c.dialCode.slice(1)}`,
        icon: <span className={`${flagClass(c.iso2)} phone-flag`} aria-hidden="true" />,
      })),
    [countries, country, isHydrated]
  );

  const pickCountry = (iso2: string) => {
    const next = countries.find((c) => c.iso2 === iso2);
    if (!next) return;
    setPicked(next.iso2);
    onChange({ code: next.dialCode, number: value.number });
  };

  return (
    <div className={`phone-input ${className}`}>
      <CustomDropdown
        name={`${name}_country`}
        value={country}
        onChange={pickCountry}
        options={options}
        searchable
        disabled={disabled || readOnly}
        className="phone-country"
        ariaLabel="Country code"
      />
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value.number}
        onChange={(e) => onChange({ code: value.code, number: e.target.value })}
        {...aria}
      />
    </div>
  );
};

export default PhoneInput;
