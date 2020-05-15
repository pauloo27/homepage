export default abstract class AbstractProvider {
  abstract setValue(key: string, value: string): void;

  abstract getValue(key: string): string | null;

  abstract hasValue(key: string): boolean;

  abstract unsetValue(key: string): void;
}
