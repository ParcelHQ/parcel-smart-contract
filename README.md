
## Start Ganache-cli for mainnet fork in terminal1

ganache-cli --fork https://mainnet.infura.io/v3/--Infura-Key-- \
 --unlock 0xB045FA6893B26807298E93377Cbb92d7f37B19eB --allowUnlimitedContractSize

`0xB045FA6893B26807298E93377Cbb92d7f37B19eB: <- this address id of UNI rich holder address to impersonate`

## Running and Compiling tests in different terminal2

truffle compile
truffle test

## Deploy

### Polygon deploy
truffle deploy --network maticMainnet
