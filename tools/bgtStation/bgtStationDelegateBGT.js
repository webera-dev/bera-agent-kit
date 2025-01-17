"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bgtStationDelegateTool = void 0;
const createViemWalletClient_1 = require("../../utils/createViemWalletClient");
const tokenABI_1 = require("../../constants/tokenABI");
const constants_1 = require("../../constants");
const helpers_1 = require("../../utils/helpers");
const logger_1 = require("../../utils/logger");
exports.bgtStationDelegateTool = {
    definition: {
        type: 'function',
        function: {
            name: 'bgt_station_delegate',
            description: 'Delegate BGT to validator',
            parameters: {
                type: 'object',
                properties: {
                    validator: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The validator address to delegate to.',
                    },
                    amount: {
                        type: 'number',
                        minimum: 0,
                        description: 'The amount of BGT to delegate.',
                    },
                },
                required: ['validator', 'amount'],
            },
        },
    },
    handler: async (args) => {
        try {
            if (!args.validator || args.amount === undefined || args.amount <= 0) {
                throw new Error('Validator address and a positive amount are required.');
            }
            const walletClient = (0, createViemWalletClient_1.createViemWalletClient)();
            logger_1.log.info('[INFO] Parsing amount based on token decimals...');
            const parsedAmount = await (0, helpers_1.fetchTokenDecimalsAndParseAmount)(walletClient, constants_1.TOKEN.BGT, args.amount);
            logger_1.log.info('[INFO] Delegating BGT using queueBoost...');
            const delegateTx = await walletClient.writeContract({
                address: constants_1.TOKEN.BGT,
                abi: tokenABI_1.BGTABI,
                functionName: 'queueBoost',
                args: [args.validator, parsedAmount],
            });
            logger_1.log.info('[INFO] Waiting for transaction receipt...');
            const receipt = await walletClient.waitForTransactionReceipt({
                hash: delegateTx,
            });
            if (receipt.status !== 'success') {
                throw new Error('Delegation transaction failed.');
            }
            logger_1.log.info(`[INFO] Delegation successful. Transaction Hash: ${receipt.transactionHash}`);
            return receipt.transactionHash;
        }
        catch (error) {
            logger_1.log.error(`[ERROR] Failed to delegate BGT: ${error.message}`);
            throw new Error(`Failed to delegate BGT: ${error.message}`);
        }
    },
};
//# sourceMappingURL=bgtStationDelegateBGT.js.map