import type { WishData } from '../types/wish';

/**
 * Encodes the WishData object into a URL-safe Base64 string.
 * Handles Unicode (including emojis) by converting the JSON string
 * into UTF-8 bytes before base64 encoding.
 */
export function encodeWish(wish: WishData): string {
  try {
    const json = JSON.stringify(wish);
    const utf8Bytes = new TextEncoder().encode(json);
    let binString = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binString += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode wish data:', err);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string back into a WishData object.
 * Returns null if decoding or parsing fails.
 */
export function decodeWish(encoded: string): WishData | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binString = atob(base64);
    const utf8Bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      utf8Bytes[i] = binString.charCodeAt(i);
    }
    const json = new TextDecoder().decode(utf8Bytes);
    return JSON.parse(json) as WishData;
  } catch (err) {
    console.error('Failed to decode wish data:', err);
    return null;
  }
}
