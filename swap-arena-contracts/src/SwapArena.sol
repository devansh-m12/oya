// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/utils/BaseHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {Currency, CurrencyLibrary} from "v4-core/src/types/Currency.sol";
import {BalanceDelta, BalanceDeltaLibrary} from "v4-core/src/types/BalanceDelta.sol";

contract SwapArena is BaseHook, Ownable{
    using PoolIdLibrary for PoolKey;
    using SafeERC20 for IERC20;
    using CurrencyLibrary for Currency;
    using BalanceDeltaLibrary for BalanceDelta;

    string public name = "SwapArena";
    string public symbol = "SXA";

    struct TradeStats {
        uint40 totalBuys;
        uint40 totalSells;
        uint256 totalVolumeOfSells;
        uint256 totalVolumeOfBuys;
        uint40 startTime;
        uint40 endTime;
    }

    enum QuestType {
        VOLUME,
        FREQUENCY
    }

    enum UserQuest {
        NONE,
        WIN,
        LOSS
    }

    struct QuestStake {
        bool isPut;
        bool hasStaked;
        uint256 stakedAmount;
        QuestType questType;
        bool isClaimed;
        uint256 rewardAmount;
        UserQuest isWinner;
    }

    struct TotalStaked {
        uint256 totalStakedVolume;
        uint256 totalStakedFrequency;
        uint256 winnersTotalStakeAmount;
    }

    mapping(PoolId poolId => uint40 currentIndex) public currentPoolIndex;
    mapping(PoolId poolId => mapping(uint40 index => TradeStats stats))
        public questTradeStats;
    mapping(uint256 questId => mapping(address user => QuestStake questStake))
        public userQuestStakes;
    mapping(uint256 questId => TotalStaked totalQuestStakes)
        public questTotalStaked;
    mapping(uint256 questId => address[] questWinners) public questWinnersList;
    mapping(uint256 questId => address[] questQuesters)
        public questQuestersList;

    // Constants
    uint40 public constant QUEST_DURATION = 1 days;
    uint40 public constant COOLDOWN_PERIOD = 1 hours;
    uint40 public constant JOIN_WINDOW = 2 hours;
    uint256 public constant REWARD_FEE = 10; // 10% fee on rewards

    // Immutable variables
    address public bexCoin;

    // Errors
    error HasAlreadyStaked(uint256 questId, address user);
    error QuestClosed(uint256 questId);
    error InvalidQuestType();
    error QuestNotStarted();
    error QuestStillOngoing();
    error NoStakeAmount();
    error AlreadyClaimed();
    error NotAWinner();
    error TransferFailed();

    // Events
    event JoinedQuest(
        address indexed user,
        uint256 indexed questId,
        uint128 amount,
        bool isPut,
        PoolId poolId
    );
    event QuestRewardDistributed(
        uint256 indexed questId,
        uint256 totalWinners,
        uint256 totalReward
    );
    event RewardClaimed(
        address indexed user,
        uint256 indexed questId,
        uint256 amount
    );
    event NewQuestStarted(
        PoolId indexed poolId,
        uint40 index,
        uint40 startTime,
        uint40 endTime
    );

    constructor(IPoolManager _poolManager, address _owner) BaseHook(_poolManager) Ownable(_owner) {
    
    }

    function setToken(address token) external {
        bexCoin = token;
    }

     function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: false,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }


        function _afterSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, BalanceDelta delta, bytes calldata)
        internal
        override
        returns (bytes4, int128)
 {
        uint40 currentTimeStamp = uint40(block.timestamp);
        uint40 poolIndex = currentPoolIndex[key.toId()];

        if (
            poolIndex == 0 ||
            (questTradeStats[key.toId()][poolIndex].endTime <
                currentTimeStamp &&
                questTradeStats[key.toId()][poolIndex].endTime +
                    COOLDOWN_PERIOD <=
                currentTimeStamp)
        ) {
            uint40 nextIndex = poolIndex + 1;
            currentPoolIndex[key.toId()] = nextIndex;
            questTradeStats[key.toId()][nextIndex] = TradeStats({
                totalBuys: 0,
                totalSells: 0,
                totalVolumeOfSells: 0,
                totalVolumeOfBuys: 0,
                startTime: uint40(currentTimeStamp),
                endTime: uint40(currentTimeStamp) + QUEST_DURATION
            });

            emit NewQuestStarted(
                key.toId(),
                nextIndex,
                currentTimeStamp,
                currentTimeStamp + QUEST_DURATION
            );
            return (BaseHook.afterSwap.selector, 0);
        }

        if (questTradeStats[key.toId()][poolIndex].endTime < currentTimeStamp) {
            return (BaseHook.afterSwap.selector, 0);
        }

        int256 delta0 = delta.amount0();
        int256 delta1 = delta.amount1();
        TradeStats storage stats = questTradeStats[key.toId()][poolIndex];

        if (delta0 > 0 && delta1 < 0) {
            // Sell operation
            stats.totalSells++;
            stats.totalVolumeOfSells += uint128(uint256(delta0));
        } else if (delta0 < 0 && delta1 > 0) {
            // Buy operation
            stats.totalBuys++;
            stats.totalVolumeOfBuys += uint128(uint256(delta1));
        }

        return (BaseHook.afterSwap.selector, 0);
    }

    // call functions
    function joinQuest(
        PoolId poolId,
        uint128 _amount,
        bool _isPut,
        QuestType _type
    ) external payable {
        address user = msg.sender;
        uint40 currentIndex = currentPoolIndex[poolId];
        
        if (currentIndex == 0) revert QuestNotStarted();
        TradeStats memory stats = questTradeStats[poolId][currentIndex];

        if (block.timestamp > stats.startTime + JOIN_WINDOW) revert QuestClosed(getQuestId(poolId, stats.startTime));

        uint256 questId = getQuestId(poolId, currentIndex);
        QuestStake storage userState = userQuestStakes[questId][user];
        
        if (userState.hasStaked) revert HasAlreadyStaked(questId, user);

        // Set user state
        userState.isPut = _isPut;
        userState.hasStaked = true;
        userState.stakedAmount = _amount;
        userState.questType = _type;

        // Update total staked amounts
        TotalStaked storage total = questTotalStaked[questId];
        if (_type == QuestType.VOLUME) {
            total.totalStakedVolume += _amount;
        } else if (_type == QuestType.FREQUENCY) {
            total.totalStakedFrequency += _amount;
        } else {
            revert InvalidQuestType();
        }

        questQuestersList[questId].push(user);
        IERC20(bexCoin).approve(address(this), _amount);
        IERC20(bexCoin).safeTransferFrom(user, address(this), _amount);
        emit JoinedQuest(user, questId, _amount, _isPut, poolId);
    }

     function settleQuest(PoolId poolId) external {
        uint40 currentIndex = currentPoolIndex[poolId];
        TradeStats memory state = questTradeStats[poolId][currentIndex];
        
        if (block.timestamp <= state.endTime) revert QuestStillOngoing();

        uint256 questId = getQuestId(poolId, currentIndex);
        uint256 totalWinnersStakeAmount = 0;
        address[] memory userList = questQuestersList[questId];

        for (uint256 i = 0; i < userList.length; i++) {
            address user = userList[i];
            QuestStake storage userState = userQuestStakes[questId][user];
            
            if (userState.stakedAmount == 0) revert NoStakeAmount();
            bool isWinner;
            if (userState.questType == QuestType.VOLUME) {
                isWinner = userState.isPut 
                    ? state.totalVolumeOfBuys > state.totalVolumeOfSells
                    : state.totalVolumeOfSells > state.totalVolumeOfBuys;
            } else {
                isWinner = userState.isPut 
                    ? state.totalBuys > state.totalSells
                    : state.totalSells > state.totalBuys;
            }

            if (isWinner) {
                questWinnersList[questId].push(user);
                userState.isWinner = UserQuest.WIN;
                totalWinnersStakeAmount += userState.stakedAmount;
            } else {
                userState.isWinner = UserQuest.LOSS;
                userState.isClaimed = true; // Losers can't claim
            }
        }
        questTotalStaked[questId].winnersTotalStakeAmount = uint128(totalWinnersStakeAmount);
        
        emit QuestRewardDistributed(
            questId,
            questWinnersList[questId].length,
            questTotalStaked[questId].totalStakedVolume + questTotalStaked[questId].totalStakedFrequency - totalWinnersStakeAmount
        );
    }

     function claimReward(uint256 questId) external {
        address user = msg.sender;
        QuestStake storage userState = userQuestStakes[questId][user];
        
        if (userState.isClaimed) revert AlreadyClaimed();
        if (userState.isWinner != UserQuest.WIN) revert NotAWinner();

        userState.isClaimed = true;
        
        TotalStaked storage total = questTotalStaked[questId];
        uint256 totalReward = (total.totalStakedVolume + total.totalStakedFrequency) - total.winnersTotalStakeAmount;
        
        // Calculate reward with fee deduction
        userState.rewardAmount = uint256(
            (uint256(userState.stakedAmount) * totalReward * (100 - REWARD_FEE)) / 
            (uint256(total.winnersTotalStakeAmount) * 100)
        );

        uint256 userCashout = userState.rewardAmount + userState.stakedAmount;
        
        // Use SafeERC20 for transfer
        IERC20(bexCoin).safeTransfer(user, userCashout);

        emit RewardClaimed(user, questId, userCashout);
    }

    // View functions

     function getQuestStatus(PoolId poolId) public view returns (bool isActive, uint40 timeRemaining) {
         uint40 currentIndex = currentPoolIndex[poolId];
        TradeStats memory stats = questTradeStats[poolId][currentIndex];
        
        if (block.timestamp < stats.endTime) {
            isActive = true;
            timeRemaining = stats.endTime - uint40(block.timestamp);
        } else {
            isActive = false;
            timeRemaining = 0;
        }
    }

    function getWinnerList(
        uint256 questId
    ) public view returns (address[] memory) {
        return questWinnersList[questId];
    }

    function getQuestersList(
        uint256 questId
    ) public view returns (address[] memory) {
        return questQuestersList[questId];
    }

    function getWinnerCount(uint256 questId) public view returns (uint256) {
        return questWinnersList[questId].length;
    }

    function getQuesterCount(uint256 questId) public view returns (uint256) {
        return questQuestersList[questId].length;
    }

    function getCurrentQuestStats(
        PoolId poolId
    ) public view returns (TradeStats memory) {
        uint40 currentIndex = currentPoolIndex[poolId];
        return questTradeStats[poolId][currentIndex];
    }

    function getQuestId(
        PoolId poolId,
        uint40 _currentIndex
    ) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(poolId, _currentIndex)));
    }

    // Admin functions
    function emergencyWithdraw(
        address token,
        uint256 amount
    ) external  {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
