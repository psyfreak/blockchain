const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const MultiSignatureWallet = artifacts.require("MultiSignatureWallet");
const fs = require('fs');

module.exports = async function(deployer, network, accounts) {
  let firstAirline = accounts[9];
  await deployer.deploy(FlightSuretyData, firstAirline, {value: 10});
  let flightSuretyDataInstance = await FlightSuretyData.deployed();

  await deployer.deploy(MultiSignatureWallet, [firstAirline, accounts[8],  accounts[7]], 2);
  let multiSignatureWalletInstance = await MultiSignatureWallet.deployed();

  console.log("FlightSuretyData.address ", FlightSuretyData.address);
  //await deployer.deploy(FlightSuretyApp, FlightSuretyData.address); // parameter must set as an address, {value: 10});

  await deployer.deploy(FlightSuretyApp, FlightSuretyData.address, MultiSignatureWallet.address); // parameter must set as an address, {value: 10});
  let flightSuretyAppInstance = await FlightSuretyApp.deployed();

  await flightSuretyDataInstance.authorizeCaller(flightSuretyAppInstance.address); // app contract can call functions in data contract
  await flightSuretyDataInstance.authorizeCaller(multiSignatureWalletInstance.address); // multiSignatureWalletInstance contract can call functions in data contract

  let config = {
    localhost: {
      url: 'http://localhost:7545',
      dataAddress: FlightSuretyData.address,
      appAddress: FlightSuretyApp.address
    },
    flights: [
      {
        name: "test1",
        departure: ""
      },
      {
        name: "test2",
        departure: ""
      },
      {
        name: "test3",
        departure: ""
      }
    ],
    airlines: [

    ]
  };
  fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
  fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');

  /*
  // with then
   deployer.deploy(FlightSuretyData, firstAirline, {value: 10})
     .then((flightSuretyDataInstance) => {
       //FlightSuretyData first airline
       //(FlightSuretyApp.address);
       //web3.utils.toWei(1, "ether")
       console.log("FlightSuretyData.address ", FlightSuretyData.address)
       return deployer.deploy(FlightSuretyApp,
         //FlightSuretyData
         FlightSuretyData.address // parameter must set as an address
       )
         .then((flightSuretyAppInstance) => {
           return flightSuretyDataInstance.authorizeCaller(flightSuretyAppInstance.address)
             .then(() => {
               //return flightSuretyDataInstance.initialize(firstAirline).then(function(result)
               // authorize app contract
               //return flightSuretyDataInstance.authorizeCaller(flightSuretyAppInstance.address)
               // here we might register the first airline
               let config = {
                 localhost: {
                   url: 'http://localhost:7545',
                   dataAddress: FlightSuretyData.address,
                   appAddress: FlightSuretyApp.address
                 },
                 flights: [
                   {
                     name: "test1",
                     departure: ""
                   },
                   {
                     name: "test2",
                     departure: ""
                   },
                   {
                     name: "test3",
                     departure: ""
                   }
                 ],
                 airlines: [

                 ]
               };
               fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
               fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');

             });

         });
     });
 */

// deploy M
    //await deployer.deploy(MultiSignatureWallet, [firstAirline, accounts[8],  accounts[7]], 1);
/*
  // migration with init script
    deployer.deploy(FlightSuretyData)
    .then((resultData) => {
      //FlightSuretyData first airline
        //(FlightSuretyApp.address);
      //web3.utils.toWei(1, "ether")
        console.log("FlightSuretyData.address ", FlightSuretyData.address)
        return deployer.deploy(FlightSuretyApp,
          //FlightSuretyData
          FlightSuretyData.address // parameter must set as an address
        )
                .then(() => {

                  return resultData.initialize(firstAirline).then(function(result) {
                    // Same transaction result object as above.
                    console.log("result ", result)
                    return resultData.fundAirline(firstAirline,{from: firstAirline, value: 10}).then(function(result2) {
                      // Same transaction result object as above.

                      //console.log("fundAirline trans ", result2);

                      // here we might register the first airline
                      //FlightSuretyApp.registerAirline()
                      // registerAirlineByAddress
                      let config = {
                        localhost: {
                          url: 'http://localhost:7545',
                          dataAddress: FlightSuretyData.address,
                          appAddress: FlightSuretyApp.address
                        },
                        flights: [
                          {
                            name: "test1",
                            departure: ""
                          },
                          {
                            name: "test2",
                            departure: ""
                          },
                          {
                            name: "test3",
                            departure: ""
                          }
                        ],
                        airlines: [

                        ]
                      };

                      fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                      fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');


                    });
                  });

                });
    });

 */

}