export interface PhoneLibOptions {
  initialCountry?: string;
  initialPhoneNumber?: string;
  preferredCountries?: string[];
  showHint?: boolean;
  layout?: 'integrated' | 'separated';
  showDialCode?: boolean;
  autoDetectCountry?: boolean;
  validateOnInput?: boolean;
  onlyCountries?: string[];
  disabledCountries?: string[];
  excludeCountries?: string[];
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  countryLabel?: string;
  dialCodeLabel?: string;
  phoneLabel?: string;
  messages?: {
    invalid?: string;
    valid?: string;
  };
  width?: string;
  maxWidth?: string;
  dropdownWidth?: string;
  inputWidth?: string;
  gridColumns?: string;
  countryWidth?: string;
  dialCodeWidth?: string;
  phoneWidth?: string;
  arrowIcon?: string;
  customClasses?: {
    wrapper?: string;
    input?: string;
    countryCode?: string;
    flag?: string;
    arrow?: string;
    dropdown?: string;
    countryItem?: string;
    search?: string;
  };
  customStyles?: {
    input?: Partial<CSSStyleDeclaration>;
    wrapper?: Partial<CSSStyleDeclaration>;
    dropdown?: Partial<CSSStyleDeclaration>;
  };
  onCountryChange?: (country: string, dialCode: string, countryName: string) => void;
  onPhoneChange?: (phoneNumber: string, isValid: boolean, country: string) => void;
  onValidationChange?: (isValid: boolean, phoneNumber: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface PhoneLibInfo {
  country: string;
  dialCode: string;
  raw: string;
  e164: string | null;
  international: string | null;
  national: string | null;
  rfc3966: string | null;
  isValid: boolean;
  type: string | null;
  countryName: string;
}

export interface CountryMetadata {
  iso2: string;
  name: string;
  dialCode: string;
  flag: string;
}

export default class PhoneLib {
  constructor(selector: string, options?: PhoneLibOptions);

  getCountry(): string;
  getDialCode(): string;
  getRaw(): string;
  getE164(): string | null;
  isValid(): boolean;
  formatInternational(): string | null;
  formatNational(): string | null;
  formatRFC3966(): string | null;
  getNumberType(): string | null;
  getInfo(): PhoneLibInfo;
  getCountryMetadata(): CountryMetadata | null;

  setCountry(iso2: string): void;
  setPhoneNumber(number: string): void;
  setValue(country: string, number: string): void;
  
  enable(): void;
  disable(): void;
  reset(): void;
  destroy(): void;
  
  // Getters for state
  get isDisabled(): boolean;
  get isReadonly(): boolean;
}
