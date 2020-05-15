import LocalStorageProvider from "../provider/LocalStorageProvider";
import AbstractProvider from "../provider/AbstractProvider";

const defaultProvider = new LocalStorageProvider();
let currentProvider: AbstractProvider;

export function setProvider(provider: AbstractProvider) {
  currentProvider = provider;
}

export function getProvider(): AbstractProvider {
  if (currentProvider === undefined) setProvider(defaultProvider);
  return currentProvider;
}
