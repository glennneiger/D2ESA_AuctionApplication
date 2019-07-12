var Web3 = require('web3');

var web3 = new Web3("http://localhost:8545");

var r = web3.eth.accounts.create();

  web3.eth.getAccounts().then(function(g)
{
  console.log(g);
})
