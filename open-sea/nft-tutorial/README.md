# OpenSea Base tutorial

https://docs.opensea.io/docs/setting-up-your-smart-contract-project

https://moralis.io/whats-the-difference-between-moralis-alchemy-and-infura/

https://ethereum-waffle.readthedocs.io/en/latest/

?!https://ipld.io/specs/transport/car/carv1/

https://www.web3.university/article/comparing-erc-721-to-erc-1155#:~:text=ERC%2D1155%20permits%20the%20creation,721%20permits%20only%20the%20latter.&text=ERC%2D1155%20also%20allows%20batch,multiple%20tokens%2C%20they%20happen%20individually.


## Sample stuff

### Mint Token

````
> npx hardhat mint --address 0xb9720BE63Ea8896956A06d2dEd491De125fD705E
========= NOTICE =========
Request-Rate Exceeded  (this message will not be repeated)

The default API keys for each service are provided as a highly-throttled,
community resource for low-traffic projects and early prototyping.

While your application will continue to function, we highly recommended
signing up for your own API keys to improve performance, increase your
request rate/limit and enable other perks, such as metrics and advanced APIs.

For more details: https://docs.ethers.io/api-keys/
==========================
Transaction Hash: 0x16ea832e486f115fb828dbec20e578a008675998256c807682d8cbdca17264d3
````

#### Metamask
Import Tokens
Contract address
Decimals 0 (=NFT)



### NFT Metadata Storage
For this tutorial, we will rely on IPFS and Protocol Lab's NFT Storage for metadata storage,
but you could consider other solution providers such as Arweave or Pinata if your needs
call for data permeance or ease-of-use.

####
The /images directory will store all our images, which we will need to upload 
first and /metadata will store all the JSON files for the tokens in your NFT
 contract and we will upload all of them at once as a compiled IPFS Car. 
 This ensures that they all have the same base endpoint with individual tokenIDs 
 appended at the end.

Had issues to upload and ifps-cars pack commands
need to update node to v16.x

#### CARS
A CAR is a Content Addressed Archive that allows you to pre-compute the root CID for your assets. You can pack your assets into a CAR with the ipfs-car cli or via https://car.ipfs.io.

Give your CAR filename the .car extention, and when
 it's uploaded to nft.storge your asset will be stored with the exact same root CID as defined in the CAR file.

- CID = content identifier | https://docs.ipfs.io/concepts/content-addressing/
- https://proto.school/anatomy-of-a-cid
- https://ipld.io/specs/transport/car/carv1/
- Meta data standard npmnpmhttps://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
````
>>npx ipfs-car --pack images --output images.car
root CID: bafybeihslhol5draa26unhhe7j2crwedr4tyfrvmba5qt3kyxbvb5olk4i
  output: images.car

>>npx ipfs-car --list  images.car
bafybeick4gmwjbto4yqvgvbx4hqrz6xubc55ibtv4ld4t5trqrmqzyesqu
bafybeick4gmwjbto4yqvgvbx4hqrz6xubc55ibtv4ld4t5trqrmqzyesqu/images
bafybeick4gmwjbto4yqvgvbx4hqrz6xubc55ibtv4ld4t5trqrmqzyesqu/images/krebs.png
bafybeick4gmwjbto4yqvgvbx4hqrz6xubc55ibtv4ld4t5trqrmqzyesqu/images/star.png
bafybeick4gmwjbto4yqvgvbx4hqrz6xubc55ibtv4ld4t5trqrmqzyesqu/images/wale.png


>>npx ipfs-car --pack metadata --output meta.car
root CID: bafybeiaytaii6cgozsnql6yduhf63bq7fyi5hjqtjzhqalsn5whpeutvla
  output: meta.car


> npx hardhat set-base-token-uri --base-url "https://bafybeif6iuokmmcuwj7jgscybx3gvlcwkb6ybspwcduivl7mbqmgmmxubi.ipfs.dweb.link/metadata/"
Transaction Hash: 0xdd9a44d4131ee48db493d0484b0b294bff8135b678fa0e029677d04e3683eca8

// tokenUrl = base-token-uri + tokenId (https://bafybeif6iuokmmcuwj7jgscybx3gvlcwkb6ybspwcduivl7mbqmgmmxubi.ipfs.dweb.link/metadata/1)

> npx hardhat mint --address 0xb9720BE63Ea8896956A06d2dEd491De125fD705E
Transaction Hash: 

> npx hardhat mint --address 0xb9720BE63Ea8896956A06d2dEd491De125fD705E
Transaction Hash: 


````

The json image link holds the img link uploaded for a particular img.

# Dezentralized File-Systems

Content based addressing is the key difference to traditional web2 systems where location based addressing is used.
- IPFS / HASH-Value
- FOLDER / FOLDER / FILE

web2: /img/jo.png if you change jo.png you still have the same address based on the naming (or serving of the file/router).
web3: /img/49499f999.png if you change it you´ll get a new address and therefore url is not the same anymore.
There are services to have the same URI.

If content moved in location based you get an 404 error.


## Metadata
- https://docs.opensea.io/docs/metadata-standards
- https://blog.chain.link/build-deploy-and-sell-your-own-dynamic-nft/


what is the difference between contractURI and tokenURI
- https://docs.opensea.io/docs/contract-level-metadata


node v12.18.3
