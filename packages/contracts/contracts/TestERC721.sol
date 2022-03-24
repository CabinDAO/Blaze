// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Stamp is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _nextTokenId;

    constructor() {
        super("Blaze Access Stamp", "BLZ");
        _nextTokenId.increment();
    }

    function mintTo(address _to) public {
        uint256 currentTokenId = _nextTokenId.current();
        _nextTokenId.increment();
        _safeMint(_to, currentTokenId);
    }
}