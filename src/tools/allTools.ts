import { getBalanceTool } from "./common/getBalance";
import { transferTool } from "./common/transfer";
import { kodiakSwapTool } from "./kodiak/kodiakSwap";
import {bexSwapTool} from "./bex/bexSwap";

export interface ToolConfig<T = any> {
  definition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
      };
    };
  };
  handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {
  // add more tools here
  get_balance: getBalanceTool,
  transfer: transferTool,
  kodiak_swap: kodiakSwapTool,
  bex_swap: bexSwapTool,
};
