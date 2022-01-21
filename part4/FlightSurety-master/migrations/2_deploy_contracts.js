const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = function(deployer) {

    let firstAirline = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';
    deployer.deploy(FlightSuretyData)
    .then(() => {
        return deployer.deploy(FlightSuretyApp,
          //FlightSuretyData
          FlightSuretyData.address // parameter must set as an address
        )
                .then(() => {
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

                    // register first airline

                    // authorizeContract
                    //FlightSuretyData.authorizeContract(FlightSuretyApp.address);
                    //FlightSuretyData.registerAirline();
                    //flightSuretyData.authorizeContract(address(this));

                    fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                    fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                });
    });
}