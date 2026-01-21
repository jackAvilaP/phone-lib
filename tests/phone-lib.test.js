import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import PhoneLib from '../phone-lib.js';

describe('PhoneLib', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = '<div id="phone-container"></div>';
        container = document.getElementById('phone-container');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should initialize correctly with default options', () => {
        const phoneLib = new PhoneLib('#phone-container', {
            initialCountry: 'CO'
        });

        expect(phoneLib.getCountry()).toBe('CO');
        expect(phoneLib.getDialCode()).toBe('+57');
    });

    it('should set phone number correctly', () => {
        const phoneLib = new PhoneLib('#phone-container', {
            initialCountry: 'CO'
        });

        phoneLib.setPhoneNumber('3001234567');
        expect(phoneLib.getRaw()).toBe('3001234567');
        expect(phoneLib.getE164()).toBe('+573001234567');
    });

    it('should validate phone numbers', () => {
        const phoneLib = new PhoneLib('#phone-container', {
            initialCountry: 'US'
        });

        phoneLib.setPhoneNumber('202-555-0119'); // Valid US number with format
        expect(phoneLib.isValid()).toBe(true);

        phoneLib.setPhoneNumber('123'); // Invalid
        expect(phoneLib.isValid()).toBe(false);
    });

    it('should change country programmatically', () => {
        const phoneLib = new PhoneLib('#phone-container', {
            initialCountry: 'CO'
        });

        phoneLib.setCountry('US');
        expect(phoneLib.getCountry()).toBe('US');
        expect(phoneLib.getDialCode()).toBe('+1');
    });

    it('should format numbers correctly', () => {
        const phoneLib = new PhoneLib('#phone-container', {
            initialCountry: 'CO'
        });

        phoneLib.setPhoneNumber('3001234567');
        // Allow strict or flexible matching for spaces (libphonenumber updates can change formats)
        const international = phoneLib.formatInternational();
        expect(international.replace(/\s/g, '')).toBe('+573001234567');

        const national = phoneLib.formatNational();
        expect(national.replace(/\s/g, '')).toBe('3001234567');
    });
});
