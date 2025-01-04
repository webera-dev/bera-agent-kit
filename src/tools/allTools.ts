import { getBalanceTool } from "./common/getBalance";
import { transferTool } from "./common/transfer";
import { kodiakSwapTool } from "./kodiak/kodiakSwap";
import { bexSwapTool } from "./bex/bexSwap";
import { oogaBoogaSwapTool } from "./oogaBooga/oogaBoogaSwap";
import { bgtStationStakeTool } from "./bgtStation/bgtStationStake";
import { bgtStationClaimRewardTool } from "./bgtStation/bgtStationClaimBGT";
import { bendSupplyTool } from "./bend/bendSupply";

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
  ooga_booga_swap: oogaBoogaSwapTool,
  bgt_station_stake: bgtStationStakeTool,
  bgt_station_claim_reward: bgtStationClaimRewardTool,
  bend_supply: bendSupplyTool,
};
