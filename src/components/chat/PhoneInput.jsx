import React, { useState, useEffect } from 'react';

export const COUNTRY_OPTIONS = [
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States', placeholder: '(555) 000-0000' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada', placeholder: '(555) 000-0000' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom', placeholder: '07123 456789' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia', placeholder: '0412 345 678' },
  { code: 'NZ', dialCode: '+64', flag: '🇳🇿', name: 'New Zealand', placeholder: '021 123 4567' },
];

/**
 * Normalizes raw phone input string + selected dial code to strict E.164 format (e.g., "+14155552671").
 * Strips leading national zero (for GB, AU, NZ) and cleans duplicate user-pasted dial codes.
 * Note: Performs syntactic E.164 normalization, not real carrier lookup validation.
 */
export function formatToE164(dialCode, phoneNumber) {
  if (!phoneNumber) return '';
  let digitsOnly = phoneNumber.replace(/\D/g, '');
  if (!digitsOnly) return '';
  
  const cleanDialCode = dialCode.replace(/\D/g, '');
  
  // If user typed/pasted the dial code digits at the start of input, strip them to prevent duplication
  if (digitsOnly.startsWith(cleanDialCode)) {
    digitsOnly = digitsOnly.slice(cleanDialCode.length);
  }
  
  // Strip leading national zero if provided (e.g., UK 07123 -> 7123, AU 0412 -> 412, NZ 021 -> 21)
  if (digitsOnly.startsWith('0')) {
    digitsOnly = digitsOnly.slice(1);
  }

  if (!digitsOnly) return '';
  return `+${cleanDialCode}${digitsOnly}`;
}

export function PhoneInput({
  value,
  onChange,
  disabled,
  required = false,
  error = null,
}) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0]);
  const [rawPhone, setRawPhone] = useState(value?.rawPhone || '');

  useEffect(() => {
    if (value?.countryCode) {
      const match = COUNTRY_OPTIONS.find((c) => c.code === value.countryCode);
      if (match) setSelectedCountry(match);
    }
  }, [value?.countryCode]);

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const country = COUNTRY_OPTIONS.find((c) => c.code === code) || COUNTRY_OPTIONS[0];
    setSelectedCountry(country);
    
    const e164 = formatToE164(country.dialCode, rawPhone);
    onChange?.({
      rawPhone,
      countryCode: country.code,
      dialCode: country.dialCode,
      e164,
    });
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setRawPhone(val);

    const e164 = formatToE164(selectedCountry.dialCode, val);
    onChange?.({
      rawPhone: val,
      countryCode: selectedCountry.code,
      dialCode: selectedCountry.dialCode,
      e164,
    });
  };

  return (
    <div className="chat-phone-input-wrapper">
      <div className="chat-phone-input-group" style={{ display: 'flex', gap: '8px' }}>
        <select
          className="chat-country-select"
          value={selectedCountry.code}
          onChange={handleCountryChange}
          disabled={disabled}
          aria-label="Select Country Code"
          style={{
            padding: '8px 6px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#1E293B',
            cursor: 'pointer',
            maxWidth: '110px',
            flexShrink: 0,
          }}
        >
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.dialCode}
            </option>
          ))}
        </select>

        <input
          id="visitor-phone"
          type="tel"
          inputMode="tel"
          className="chat-input"
          placeholder={selectedCountry.placeholder}
          value={rawPhone}
          onChange={handlePhoneChange}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-label="Phone Number"
          style={{ flex: 1 }}
        />
      </div>
      {error && (
        <span
          className="chat-field-error"
          style={{ color: '#DC2626', fontSize: '11px', marginTop: '4px', display: 'block' }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default PhoneInput;
