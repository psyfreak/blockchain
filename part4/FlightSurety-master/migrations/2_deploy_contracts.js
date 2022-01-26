const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = async function(deployer) {

    let firstAirline = '0x60f73337800add20c1a18540d085c2ECFA16B6dD';

/*
  let resultData = await deployer.deploy(FlightSuretyData);
  //FlightSuretyData.deployed()
  let resultDataApp = await deployer.deploy(FlightSuretyApp, FlightSuretyData.address); // parameter must set as an address

  await resultData.initialize(firstAirline)
  await resultData.fundAirline({from: firstAirline, value: 10});

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
*/

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
                    return resultData.fundAirline({from: firstAirline, value: 10}).then(function(result2) {
                      // Same transaction result object as above.
                      console.log("fundAirline trans ", result2);

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

}