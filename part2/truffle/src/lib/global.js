let urlTestRinkeby = "https://rinkeby.infura.io/v3/d9e5d95ca8ab4661b173422d152485fd";

async function loadWeb3() {

  // here the connect is hold by metamask
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }

  // this works for reading but not for writing
  //window.web3 = new Web3(urlTestRinkeby);

}

async function loadContract(abi, contractAddress) {
  return await new window.web3.eth.Contract(abi, contractAddress);
}

export async function setMessageFunction() {
  let message = $("#userInput").val();
  const account = await getCurrentAccount();
  await window.contract.methods.setMessage(message).send({ from: account });
}

export async function getMessageFunction() {
  const account = await getCurrentAccount();
  await window.contract.methods.getMessage().call().then(function(x){
    alert(x);
  });
  // console.log(JSON.stringify(returnedMessage));
  // alert(JSON.stringify(returnedMessage));
}

export async function getCurrentAccount() {
  const accounts = await window.web3.eth.getAccounts();
  console.log("accounts", accounts)
  return accounts[0];
  //return web3.eth.defaultAccount;
}

export async function load(abi, contractAddress) {
  await loadWeb3();
  window.contract = await loadContract(abi, contractAddress);
}


export function testModule() {
 return "lo"
}

