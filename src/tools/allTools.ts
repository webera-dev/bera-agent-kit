import { getBalanceTool } from "./common/getBalance";
import { transferTool } from "./common/transfer";
import { kodiakSwapTool } from "./kodiak/kodiakSwap";
import { bexSwapTool } from "./bex/bexSwap";
import { oogaBoogaSwapTool } from "./oogaBooga/oogaBoogaSwap";
import { bgtStationStakeTool } from "./bgtStation/bgtStationStake";
import { bgtStationClaimRewardTool } from "./bgtStation/bgtStationClaimBGT";
import { infraredStakeIBGTTool } from "./infrared/infraredStakeIBGT";
import { getTokenBalanceTool } from "./common/getTokenBalance";
import { infraredWithdrawStakedIBGTTool } from "./infrared/infraredWithdrawStakedIBGT";
import { bendSupplyTool } from "./bend/bendSupply";
import { bendWithdrawTool } from "./bend/bendWithdraw";
import { bendBorrowTool } from "./bend/bendBorrow";
import { bendRepayTool } from "./bend/bendRepay";
import { bgtStationDelegateTool } from "./bgtStation/bgtStationDelegateBGT";
import { bgtStationRedeemTool } from "./bgtStation/bgtStationRedeem";

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
  infrared_stake_ibgt: infraredStakeIBGTTool,
  infrared_withdraw_staked_ibgt: infraredWithdrawStakedIBGTTool,
  get_token_balance: getTokenBalanceTool,
  bend_supply: bendSupplyTool,
  bend_withdraw: bendWithdrawTool,
  bend_borrow: bendBorrowTool,
  bend_repay: bendRepayTool,
  bgt_station_delegate: bgtStationDelegateTool,
  bgt_station_redeem: bgtStationRedeemTool,
};
