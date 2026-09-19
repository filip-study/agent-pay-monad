// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentRegistry
 * @notice Minimal onchain agent identity stub for Metropolis Track 04 (ERC-8004-inspired).
 * @dev Demo contract — not audited. Deploy on Monad when ready; off-chain /agent works today.
 */
contract AgentRegistry {
    struct Agent {
        address controller;
        string agentId;
        string endpoint;
        uint64 registeredAt;
        bool active;
    }

    mapping(bytes32 => Agent) public agents;
    mapping(address => bytes32[]) public byController;

    event AgentRegistered(bytes32 indexed key, address indexed controller, string agentId, string endpoint);
    event AgentUpdated(bytes32 indexed key, string endpoint, bool active);

    function register(string calldata agentId, string calldata endpoint) external returns (bytes32 key) {
        key = keccak256(abi.encodePacked(msg.sender, agentId));
        require(agents[key].registeredAt == 0, "exists");
        agents[key] = Agent({
            controller: msg.sender,
            agentId: agentId,
            endpoint: endpoint,
            registeredAt: uint64(block.timestamp),
            active: true
        });
        byController[msg.sender].push(key);
        emit AgentRegistered(key, msg.sender, agentId, endpoint);
    }

    function update(bytes32 key, string calldata endpoint, bool active) external {
        Agent storage a = agents[key];
        require(a.controller == msg.sender, "not controller");
        a.endpoint = endpoint;
        a.active = active;
        emit AgentUpdated(key, endpoint, active);
    }

    function get(bytes32 key) external view returns (Agent memory) {
        return agents[key];
    }
}
