require("@nomiclabs/hardhat-waffle");
let secret = require("./secret");

module.exports = {
  solidity: "0.8.13",
  networks: {
    rinkeby: {
      url: secret.url,
      accounts: [secret.key]
    }
  }
};