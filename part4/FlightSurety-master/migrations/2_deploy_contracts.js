const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const MultiSignatureWallet = artifacts.require("MultiSignatureWallet");
const fs = require('fs');

module.exports = async function(deployer, network, accounts) {
  let firstAirline = accounts[1],
    FUNDING_AIRLINE = web3.utils.toWei('10', 'ether');// ether;
  await deployer.deploy(FlightSuretyData, firstAirline, {value: FUNDING_AIRLINE});
  let flightSuretyDataInstance = await FlightSuretyData.deployed();

  await deployer.deploy(MultiSignatureWallet, [firstAirline], 1);
  let multiSignatureWalletInstance = await MultiSignatureWallet.deployed();

  console.log("FlightSuretyData.address ", FlightSuretyData.address);
  //await deployer.deploy(FlightSuretyApp, FlightSuretyData.address); // parameter must set as an address, {value: 10});

  await deployer.deploy(FlightSuretyApp, FlightSuretyData.address, MultiSignatureWallet.address); // parameter must set as an address, {value: 10});
  let flightSuretyAppInstance = await FlightSuretyApp.deployed();

  await flightSuretyDataInstance.authorizeCaller(flightSuretyAppInstance.address); // app contract can call functions in data contract
  await flightSuretyDataInstance.authorizeCaller(multiSignatureWalletInstance.address); // multiSignatureWalletInstance contract can call functions in data contract
  await multiSignatureWalletInstance.authorizeCaller(flightSuretyAppInstance.address); // app contract contract can call functions in multiSignatureWallet contract

  let config = {
    localhost: {
      url: 'http://localhost:7545',
      url2: "ws://localhost:7545",
      dataAddress: FlightSuretyData.address,
      appAddress: FlightSuretyApp.address
    },
    oracles: {
      count: 20,
      predefinedIndex: 20,
      randomPerOracle: false,// true - every oracles return a different randomized statusCode | false all oracles return the identicial randomized statusCode.
      statusCodes: {
        STATUS_CODE_UNKNOWN: 0,
        STATUS_CODE_ON_TIME: 10,
        STATUS_CODE_LATE_AIRLINE: 20, // => payment process gets triggered
        STATUS_CODE_LATE_WEATHER: 30,
        STATUS_CODE_LATE_TECHNICAL: 40,
        STATUS_CODE_LATE_OTHER: 50
      }
    },
    fees: { // number should be stringify web3 works with string and big numbers
      registrationOracle: "1",
      registrationAirline: "10",
      capInsurance: "1"
    },
    airlines: [
      {
        airline: firstAirline,
        name: "Lufthansa"
      },
      {
        airline:  accounts[2],
        name: "IrishAir"
      },
      {
        airline:  accounts[3],
        name: "RyanAir"
      },
      {
        airline:  accounts[4],
        name: "TeslaAir"
      },
      {
        airline:  accounts[5],
        name: "NikeAir"
      },
      {
        airline:  accounts[6],
        name: "AustraliaAir"
      },
      {
        airline:  accounts[7],
        name: "Airsoft"
      }
    ],
    flights: [
      {
        airline: firstAirline,
        name: "F-001",
        departure: 1643869458
      },
      {
        airline: accounts[2],
        name: "F-002",
        departure: 1643869458
      },
      {
        airline:  firstAirline,
        name: "F-003",
        departure: 1643869458
      }
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