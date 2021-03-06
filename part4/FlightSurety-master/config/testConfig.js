
const FlightSuretyApp = artifacts.require("FlightSuretyApp"),
    FlightSuretyData = artifacts.require("FlightSuretyData"),
    MultiSignatureWallet = artifacts.require("MultiSignatureWallet");

var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x69e1CB5cFcA8A311586e3406ed0301C06fb839a2",
        "0xF014343BDFFbED8660A9d8721deC985126f189F3",
        "0x0E79EDbD6A727CfeE09A2b1d0A59F7752d5bf7C9",
        "0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4",
        "0xa23eAEf02F9E0338EEcDa8Fdd0A73aDD781b2A86",
        "0x6b85cc8f612d5457d49775439335f83e12b8cfde",
        "0xcbd22ff1ded1423fbc24a7af2148745878800024",
        "0xc257274276a4e539741ca11b590b9447b26a8051",
        "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7"
    ];

    let timestamp = Math.floor(Date.now() / 1000);
    const flights =  [
        {
            name: "F-001",
            departure: timestamp
        },
        {
            name: "F-002",
            departure: timestamp
        },
        {
            name: "F-003",
            departure: timestamp
        },
    ];


    let owner = accounts[0];
    let firstAirline = accounts[1]; // see deployment script atm. firstAirline acc9

    const airlines = [
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
    ];


    //let flightSuretyData = await FlightSuretyData.new(firstAirline, {from: owner, value: 10});
    //let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address, {from: owner});

    // if initialize script is used we need this other wise our contract gets lost and we would need to the initialization in the test scripts.
    let flightSuretyData = await FlightSuretyData.deployed();
    let flightSuretyApp = await FlightSuretyApp.deployed();
    let multiSignatureWallet = await MultiSignatureWallet.deployed();
    
    return {
        owner: owner,
        firstAirline: firstAirline,
        airlines: airlines,
        flights: flights,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp,
        multiSignatureWallet: multiSignatureWallet
    };
}

module.exports = {
    Config: Config
};