# Family-Contract
> ERC721 token contract with tokens that represent humans.

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Room for Improvement](#room-for-improvement)
* [Contact](#contact)



## General Information
- User can mint MAN token.
- If user already have MAN token, then second mint would be WOMEN token
- User can breed MAN and WOMEN tokens and mint new KID token


## Technologies Used
- Solidity
- Hardhat
- Ethers


## Features
- User can mint 2 tokens(MAN, WOMEN)
- After that user is able to giveThemSomePrivacy and create KID token
- KID token at mint time have 0 y.o, but each real day is equal 1 year in contract and when KID has 18 y.o, this token is able for new reproducing
- The contract has been properly reviewed.


## Setup
Just run "npm isntall" to install all dependencies and you will be able to run tests and test by yourself
```
npm install
```


## Room for Improvement

- Create more complex contract with Human DNA
- Implement user friendly UI
- Give every ERC721 token different unique shape
- It can be improved by NFT marketplace. I've alredy did something similar in my [TechNoirClub](https://github.com/ILESKOV/TechnoirClubBeta) project.
- Also it can be improved by importing randomness outside the blockchain using Oralces. For this contract purposes at this moment of building it's 
not neccesary needed, but in case contract will be impoved it might be good idea to consider useing this technology. Using Chainlink Oracles by me you 
can find in my [Lottery](https://github.com/ILESKOV/Lottery-) contract



## Contact
Created by [@LESKOV](https://www.linkedin.com/in/ivan-lieskov-4b5664189/) - feel free to contact me!
