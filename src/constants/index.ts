export const CONTRACT = {
  OBRouter: "0xF6eDCa3C79b4A3DFA82418e278a81604083b999D" as `0x${string}`,
  KodiakSwapRouter02:
    "0x496e305c03909ae382974caca4c580e1bf32afbe" as `0x${string}`,
  KodiakUniswapV2Router02:
    "0x406846114B2A9b65a8A2Ab702C2C57d27784dBA2" as `0x${string}`,
  BeraCrocMultiSwap:
    "0x21e2C0AFd058A89FCf7caf3aEA3cB84Ae977B73D" as `0x${string}`,
  Bend: "0x30A3039675E5b5cbEA49d9a5eacbc11f9199B86D" as `0x${string}`,
} as const;

export const TOKEN = {
  WBERA: "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8" as `0x${string}`,
  HONEY: "0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03" as `0x${string}`,
  BGT: "0xbDa130737BDd9618301681329bF2e46A016ff9Ad" as `0x${string}`,
} as const;

export const URL = {
  BEXRouteURL: "https://bartio-bex-router.berachain.com/dex/route",
  OogaBoogaURL: "https://bartio.api.oogabooga.io",
  BGTVaultURL:
    "https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/vaults?pageSize=9999",
};
