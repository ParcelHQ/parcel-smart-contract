const AutomationModule = artifacts.require("AutomationModule");
const Resolver = artifacts.require("Resolver");
const GELATO = "0x0630d1b8c2df3f0a68df578d02075027a6397173"
const GELATO_POKE_ME = "0x8c089073a9594a4fb03fa99feee3efff0e2bc58a"


module.exports = function(deployer, network, accounts) {
  console.log(network)
  deployer.then(async () => {
    const automationModule = await deployer.deploy(AutomationModule, GELATO, GELATO_POKE_ME, {from: accounts[0], overWrite : true});
    console.log(automationModule.address, "automationModule address")
    const resolver = await deployer.deploy(Resolver, automationModule.address, {from: accounts[0],overWrite : true});
    console.log(resolver.address, "resolver address");
    await automationModule.setResolverAddress(resolver.address, {from: accounts[0]});
    console.log("Resolver set");
  })
};
