/*// SPDX-License-Identifier: MIT */ 
// pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "./nft.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// // import "hardhat/console.sol";
// // import "@openzeppelin/contracts/utils/Counters.sol";
// // import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// // import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// contract Marketplace is ReentrancyGuard {
//     using Counters for Counters.Counter;

//     Counters.Counter private _marketItemIds;
//     Counters.Counter private _tokensSold;
//     Counters.Counter private _tokensCanceled;

//     address payable private owner;

//     // Challenge: make this price dynamic according to the current currency price
//     uint256 private listingFee = 0.045 ether;

//     mapping(uint256 => MarketItem) private marketItemIdToMarketItem;

//     struct MarketItem {
//         uint256 marketItemId;
//         address nftContractAddress;
//         uint256 tokenId;
//         address payable creator;
//         address payable seller;
//         address payable owner;
//         uint256 price;
//         bool sold;
//         bool canceled;
//     }

//     event MarketItemCreated(
//         uint256 indexed marketItemId,
//         address indexed nftContract,
//         uint256 indexed tokenId,
//         address creator,
//         address seller,
//         address owner,
//         uint256 price,
//         bool sold,
//         bool canceled
//     );

//     constructor() {
//         owner = payable(msg.sender);
//     }

//     function getListingFee() public view returns (uint256) {
//         return listingFee;
//     }

//     /**
//      * @dev Creates a market item listing, requiring a listing fee and transfering the NFT token from
//      * msg.sender to the marketplace contract.
//      */
//     function createMarketItem(
//         address nftContractAddress,
//         uint256 tokenId,
//         uint256 price
//     ) public payable nonReentrant returns (uint256) {
//         require(price > 0, "Price must be at least 1 wei");
//         require(msg.value == listingFee, "Price must be equal to listing price");
//         _marketItemIds.increment();
//         uint256 marketItemId = _marketItemIds.current();

//         address creator = NFT(nftContractAddress).getTokenCreatorById(tokenId);

//         marketItemIdToMarketItem[marketItemId] = MarketItem(
//             marketItemId,
//             nftContractAddress,
//             tokenId,
//             payable(creator),
//             payable(msg.sender),
//             payable(address(0)),
//             price,
//             false,
//             false
//         );

//         IERC721(nftContractAddress).transferFrom(msg.sender, address(this), tokenId);

//         emit MarketItemCreated(
//             marketItemId,
//             nftContractAddress,
//             tokenId,
//             payable(creator),
//             payable(msg.sender),
//             payable(address(0)),
//             price,
//             false,
//             false
//         );

//         return marketItemId;
//     }

//      function fetchAvailableMarketItems() public view returns (MarketItem[] memory) {
//         uint256 itemsCount = _marketItemIds.current();
//         uint256 soldItemsCount = _tokensSold.current();
//         uint256 canceledItemsCount = _tokensCanceled.current();
//         uint256 availableItemsCount = itemsCount - soldItemsCount - canceledItemsCount;
//         MarketItem[] memory marketItems = new MarketItem[](availableItemsCount);

//         uint256 currentIndex = 0;
//         for (uint256 i = 0; i < itemsCount; i++) {
//             // Is this refactor better than the original implementation?
//             // https://github.com/dabit3/polygon-ethereum-nextjs-marketplace/blob/main/contracts/Market.sol#L111
//             // If so, is it better to use memory or storage here?
//             MarketItem memory item = marketItemIdToMarketItem[i + 1];
//             if (item.owner != address(0)) continue;
//             marketItems[currentIndex] = item;
//             currentIndex += 1;
//         }

//         return marketItems;
//     }
//     function getMyNFTs() public view returns (MarketItem[] memory) {
//         uint totalItemCount = _marketItemIds.current();
//         uint itemCount = 0;
//         uint currentIndex = 0;

//         for(uint i=0; i < totalItemCount; i++)
//         {
//             if(marketItemIdToMarketItem[i+1].sold==false) {
//                 itemCount += 1;
//             }
//         }

//         MarketItem[] memory items = new MarketItem[](itemCount);
//         for(uint i=0; i < totalItemCount; i++) {
//             if(marketItemIdToMarketItem[i+1].sold == false) {
//                 uint currentId = i+1;
//                 MarketItem storage currentItem = marketItemIdToMarketItem[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }
//         return items;
//     }

//     function executeSale(uint256 tokenId,address nftContractAddress) public payable {
//         uint price = marketItemIdToMarketItem[tokenId].price;
//         address seller = marketItemIdToMarketItem[tokenId].seller;
//         require(msg.value == price, "Please submit the asking price in order to complete the purchase");

//         marketItemIdToMarketItem[tokenId].sold = true; // Remove the sold NFT from the marketplace
//         marketItemIdToMarketItem[tokenId].seller = payable(msg.sender);

//         _tokensSold.increment();

//         IERC721(nftContractAddress).transferFrom(address(this), msg.sender, tokenId);
    
       

//         payable(owner).transfer(listingFee);
//         payable(seller).transfer(msg.value);
//     }
// }
