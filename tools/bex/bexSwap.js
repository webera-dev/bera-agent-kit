"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bexSwapTool = void 0;
const axios_1 = __importDefault(require("axios"));
const bexABI_1 = require("../../constants/bexABI");
const constants_1 = require("../../constants");
const createViemWalletClient_1 = require("../../utils/createViemWalletClient");
const helpers_1 = require("../../utils/helpers");
const logger_1 = require("../../utils/logger");
exports.bexSwapTool = {
    definition: {
        type: 'function',
        function: {
            name: 'bex_swap',
            description: 'Perform a token swap on BEX',
            parameters: {
                type: 'object',
                properties: {
                    base: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'Base token address',
                    },
                    quote: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'Quote token address',
                    },
                    amount: {
                        type: 'number',
                        description: 'The amount of swap tokens',
                    },
                },
                required: ['base', 'quote', 'amount'],
            },
        },
    },
    handler: async (args) => {
        // TODO: Detect the "native token" automatically so that users do not need to provide the BERA address.
        try {
            const walletClient = (0, createViemWalletClient_1.createViemWalletClient)();
            const parsedAmount = await (0, helpers_1.fetchTokenDecimalsAndParseAmount)(walletClient, args.base, args.amount);
            logger_1.log.info(`[INFO] Checking allowance for ${args.base}`);
            await (0, helpers_1.checkAndApproveAllowance)(walletClient, args.base, constants_1.CONTRACT.BeraCrocMultiSwap, parsedAmount);
            // Fetch swap route
            const routeApiUrl = `${constants_1.URL.BEXRouteURL}?fromAsset=${args.base}&toAsset=${args.quote}&amount=${parsedAmount.toString()}`;
            logger_1.log.info(`[INFO] request route: ${routeApiUrl}`);
            const response = await axios_1.default.get(routeApiUrl);
            if (response.status !== 200 || !response.data) {
                throw new Error(`Failed to fetch swap steps from API`);
            }
            const steps = response.data.steps.map((step) => ({
                poolIdx: step.poolIdx,
                base: step.base,
                quote: step.quote,
                isBuy: step.isBuy,
            }));
            if (!steps.length) {
                throw new Error(`No valid swap steps returned from the API`);
            }
            logger_1.log.info(`[INFO] Swap steps fetched:`, steps);
            const parsedMinOut = BigInt(0); //TODO: calculate min out
            const tx = await walletClient.writeContract({
                address: constants_1.CONTRACT.BeraCrocMultiSwap,
                abi: bexABI_1.BeraCrocMultiSwapABI,
                functionName: 'multiSwap',
                args: [steps, parsedAmount, parsedMinOut],
                value: steps.some((step) => step.base === constants_1.TOKEN.WBERA)
                    ? parsedAmount
                    : undefined,
            });
            const receipt = await walletClient.waitForTransactionReceipt({
                hash: tx,
            });
            if (receipt.status !== 'success') {
                throw new Error(`Swap transaction failed with status: ${receipt.status}`);
            }
            logger_1.log.info(`[INFO] Swap successful: Transaction hash: ${tx}`);
            return tx;
        }
        catch (error) {
            logger_1.log.error(`[ERROR] Swap failed: ${error.message}`);
            throw new Error(`Swap failed: ${error.message}`);
        }
    },
};
//# sourceMappingURL=bexSwap.js.map