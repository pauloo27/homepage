import AbstractProvider from "./AbstractProvider";

export default class LocalStorageProvider extends AbstractProvider {
  hasValue(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  unsetValue(key: string): void {
    localStorage.removeItem(key);
  }

  getValue(key: string): string | null {
    return localStorage.getItem(key);
  }

  setValue(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
