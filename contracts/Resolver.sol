// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {Enum} from "./Enum.sol";
import {GnosisSafe} from "./AllowanceModule.sol";

interface IAllowanceModule {
    struct Allowance {
        uint96 amount;
        uint96 spent;
        uint16 resetTimeMin;
        uint32 lastResetMin;
        uint16 nonce;
    }

    struct Delegate {
        address delegate;
        uint48 prev;
        uint48 next;
    }

    function delegatesStart(address safe) external view returns (uint48);

    function delegates(address safe, uint48 node)
        external
        view
        returns (Delegate memory delegate);

    function getTokenAllowance(
        address safe,
        address delegate,
        address token
    ) external view returns (uint256[5] memory);

    function executeAllowanceTransfer(
        GnosisSafe safe,
        address token,
        address payable to,
        uint96 amount,
        address paymentToken,
        uint96 payment,
        address delegate,
        bytes memory signature
    ) external;
}

contract Resolver {
    IAllowanceModule public immutable allowanceModule;

    constructor(address _allowanceModule) {
        allowanceModule = IAllowanceModule(_allowanceModule);
    }

    function checker(
        address _safe,
        address _token
    ) external view returns (bool canExec, bytes memory execPayload) {
        uint48 entry = allowanceModule.delegatesStart(_safe);

        IAllowanceModule.Delegate memory currentNode = allowanceModule
            .delegates(_safe, entry);

        do {
            uint96 amount;
            (canExec, amount) = _canTransferToDelegate(
                _safe,
                currentNode.delegate,
                _token
            );
            if (canExec) {
                execPayload = _getPayload(
                    _safe,
                    _token,
                    currentNode.delegate,
                    amount
                );
                return (canExec, execPayload);
            }

            uint48 nextNode = currentNode.next;
            currentNode = allowanceModule.delegates(_safe, nextNode);
        } while (currentNode.delegate != address(0));

        return (canExec, execPayload);
    }

    /// @dev Checks if delegate has remaining allowance.
    function _canTransferToDelegate(
        address _safe,
        address _delegate,
        address _token
    ) internal view returns (bool, uint96) {
        uint256[5] memory allowance = allowanceModule.getTokenAllowance(
            _safe,
            _delegate,
            _token
        );

        uint96 amount = uint96(allowance[0]);
        uint96 spent = uint96(allowance[1]);

        if (amount > spent) {
            uint96 remaining = amount - spent;
            return (true, remaining);
        }

        return (false, 0);
    }

    function _getPayload(
        address _safe,
        address _token,
        address _delegate,
        uint96 _amount
    ) internal pure returns (bytes memory payload) {
        bytes memory signature = new bytes(0);
        uint96 fee = 1;
        address paymentToken = address(0);

        payload = abi.encodeWithSelector(
            IAllowanceModule.executeAllowanceTransfer.selector,
            _safe,
            _token,
            _delegate,
            _amount,
            paymentToken,
            fee,
            _delegate,
            signature
        );
    }
}
