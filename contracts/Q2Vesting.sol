// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Q2Vesting is Ownable {
    using SafeMath for uint256;

    IERC20 public token;

    mapping(address => mapping(uint256 => uint256)) private unLockDateMap;
    mapping(address => mapping(uint256 => uint256)) private unLockTokenAmount;
    mapping(address => uint256) public vestingBalance;

    event WithDrawnToken(address indexed manager, uint256 amount);
    event InvestorAccountAdded(
        address indexed manager,
        uint256 _unLockDate,
        uint256 amount
    );

    modifier unlockCheck(uint256 index) {
        require(
            unLockTokenAmount[msg.sender][index] != 0,
            "You do not have permission to unlock"
        );
        _;
    }

    constructor(address _token) {
        token = IERC20(_token);
    }

    function addInvestorAccount(
        address _investorAccount,
        uint256 unLockDate,
        uint256 amount
    ) public onlyOwner {
        unLockDateMap[_investorAccount][
            vestingBalance[_investorAccount]
        ] = unLockDate;
        unLockTokenAmount[_investorAccount][
            vestingBalance[_investorAccount]
        ] = amount;
        vestingBalance[_investorAccount] += 1;
        token.transferFrom(msg.sender, address(this), amount);
        emit InvestorAccountAdded(_investorAccount, unLockDate, amount);
    }

    function blockTimestamp() public view virtual returns (uint256) {
        return block.timestamp;
    }

    function unlockQ2(uint256 index) public unlockCheck(index) {
        require(
            blockTimestamp() > unLockDateMap[msg.sender][index],
            "It's not time to unlock"
        );
        _safeTransfer(unLockTokenAmount[msg.sender][index]);
        unLockTokenAmount[msg.sender][index] = 0;
        emit WithDrawnToken(msg.sender, unLockTokenAmount[msg.sender][index]);
    }

    function unLockTime(address userAddress, uint256 index)
        public
        view
        returns (uint256)
    {
        return unLockDateMap[userAddress][index];
    }

    function unLockAmount(address userAddress, uint256 index)
        public
        view
        returns (uint256)
    {
        return unLockTokenAmount[userAddress][index];
    }

    function vestingDetails(address userAddress, uint256 index)
        public
        view
        returns (uint256, uint256)
    {
        return (
            unLockTokenAmount[userAddress][index],
            unLockDateMap[userAddress][index]
        );
    }

    function _safeTransfer(uint256 tokenNum) private {
        token.transfer(msg.sender, tokenNum);
    }
}
