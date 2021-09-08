const AllowanceModule = artifacts.require("AllowanceModule");
const GELATO = "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
const GELATO_POKE_ME = "0xB3f5503f93d5Ef84b06993a1975B9D21B962892F"


module.exports = function(deployer, network, accounts) {
  console.log(network)
  deployer.then(async () => {
    await deployer.deploy(AllowanceModule, GELATO, GELATO_POKE_ME, {from: accounts[0]});
  })
};
