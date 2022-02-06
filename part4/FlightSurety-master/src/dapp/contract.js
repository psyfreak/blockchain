import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        //this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        // this activates websockets and therefore listen to events
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

        this.owner = null;
        this.airlines = [];
        this.passengers = [];
        this.firstAirline = "";
        this.firstFlight = {};
        this.initialize(callback);

    }


    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
          this.numOfAccounts = 10;
            this.owner = accts[0];
            this.firstAirline = accts[1];

            this.firstFlight = {
                name: "first",
                timestamp: 1643869458, //Math.floor(Date.now() / 1000),
                airline: this.firstAirline
            };

            console.log("this.firstAirline", this.firstAirline)
            let counter = 1;
            //console.log("this.airlines", this.airlines)
            while(this.airlines.length < this.numOfAccounts) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < this.numOfAccounts) {
                this.passengers.push(accts[counter++]);
            }
/*
            this.flightSuretyApp.events.OracleRegistered({})
              .on('data', async function(event){
                  console.log(event.returnValues);
                  // Do something here
              })
              .on('error', console.error);
*/

            (this.flightSuretyApp.events.allEvents({
                filter: {
                    //fromBlock: 0, toBlock: 'latest'
                    // myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'
                }, // Using an array means OR: e.g. 20 or 23
                fromBlock: "latest"
            }, function(error, event){ console.info(event); })
              .on("connected", function(subscriptionId){
                  console.info(subscriptionId);
              })
              .on('data', function(event){
                  console.info(event); // same results as the optional callback above

              })
              .on('changed', function(event){
                  // remove event from local database
                  console.info(event);
              })
              .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                  console.info(error, receipt);
              }));


            callback();
        });

        this.web3.eth.getGasPrice().then(result=>{
            console.warn("result", result)
        })
    }

    initializeTestSetup(callback) {
        // register flight 1
        let self = this;
        let gas = 1000000;
        //added the 4th parameter zero, the owner is allowed to predefine one for testing purpose
        /*
        // TODO try out web3 batch processing
          // register passenger
          self.flightSuretyApp.methods
            .bookFlight(self.firstFlight.airline, self.firstFlight.name, self.firstFlight.timestamp)
            .send({ from:  self.passengers[0], gas: gas}, (error, result) => {
                callback(error, self.passengers[0]);




            });
        */
    };

    async registerAllOracles(countOracles, callback) {
        /*
        const userAction = async () => {
            const response = await fetch('http://example.com/movies.json');
            const myJson = await response.json(); //extract JSON from the http response
            // do something with myJson
        }*/
        let myJson, error;
        try {
            const response = await fetch('http://127.0.0.1:3000/api/oracles/' + countOracles, {
                method: 'POST',
                body: "", // string or object
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("response", response)
            myJson = await response.json(); //extract JSON from the http response
        } catch(e) {
            error = e;
        }
        // do something with myJson
        callback(error, myJson);
    }
    async getOracle(passengerAddress, callback) {

        let self = this;
        let payload = {
            passenger: passengerAddress
        }

        let result = await self.flightSuretyData.methods
          .balances(payload.passenger)
          .call({from: self.owner});

        let pasJson = {
            address: payload.passenger,
            balance: result.toString()
        };

        //let title = "id/isRegistered/registeredBy/status/passengers" + `${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']}`;
        //`Flight (id/isRegistered/registeredBy/status/passengers): ${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']} `;

        callback(null, pasJson)
    }

    async getOracleCount(callback) {

        let self = this;

        let result = await self.flightSuretyApp.methods
          .oracleCount()
          .call({from: self.owner});

        //let title = "id/isRegistered/registeredBy/status/passengers" + `${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']}`;
        //`Flight (id/isRegistered/registeredBy/status/passengers): ${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']} `;
        callback(null, result)
    }


    isOperational(callback) {
       let self = this;
       self.flightSuretyData.methods
            .isOperational()
            .call({from: self.owner}, callback);
    }

    async printAirline(airlineIndex, callback) {
        let self = this;
        self.flightSuretyApp.methods
          .getAirline(self.airlines[airlineIndex])
          .call({from: self.owner}, callback);
    }
    async getAirline(airlineAddress, callback) {
        let self = this;
        /*
        self.flightSuretyData.methods
          .getAirlineByAddress(self.airlines[airlineIndex])
          .call({from: self.owner}, callback);
        */

        let result,
          error,
          airlineJson;
        try {
            result = await self.flightSuretyApp.methods
              .getAirline(airlineAddress)
              .call({from: self.owner});

            airlineJson = {
                id: result['0'].toString(),
                name: result['1'].toString(),
                isRegistered: result['2'].toString(),
                registeredBy: result['3'].toString(),
                investment: result['4'].toString(),
                timestamp: new Date(result['5'] *1000).toISOString() + ' (' + result['5'].toString() + ')'
            };

        } catch(err) {
            error = err;
        }
        if(!callback) {
            return airlineJson;
        }
        callback(error, airlineJson)
    }
    async getAllAirlines(callback) {
        let self = this;
        let airlines = [];
        airlines.push({
            id: "",
            name: "",
            registered: "",
            registeredBy: "",
            investment: "",
            timestamp: ""
        })

        for(let acc of self.airlines) {
           let airline = await this.getAirline(acc)
            console.log("airline", airline)
            if(airline) {
                //airline['5'] = new Date(airline['5']*1000).toISOString();
                airlines.push(airline);
            }
        }
        callback(null, airlines)
    }

    async getFlight(flight, callback) {
        let self = this;

        let result,
          error,
          flightJson;
        try {
            result = await self.flightSuretyData.methods
              .getFlight(flight.airline, flight.name, flight.timestamp)
              .call({from: self.owner});

            flightJson = {
                id: result['0'].toString(),
                isRegistered: result['1'].toString(),
                registeredBy: result['3'].toString(),
                status: result['2'].toString(),
                passengers: result['4'].toString()
            };
        } catch(err) {
            error = err;
        }



        //let title = "id/isRegistered/registeredBy/status/passengers" + `${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']}`;
          //`Flight (id/isRegistered/registeredBy/status/passengers): ${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']} `;

        callback(error, flightJson)
    }

    async registerFlight(flight, callback) {
        let self = this;
        let gas = 1000000;
        console.warn("registerFlight", flight);
        let result,
          error;
        try {
            result =  await self.flightSuretyApp.methods
              .registerFlight(flight.name, flight.timestamp)
              .send({ from: flight.airline, gas: gas})
        } catch(err) {
            error = err;
        }

        callback(error, flight)
    }

    async getPassenger(passengerAddress, callback) {
        let self = this;
        let payload = {
            passenger: passengerAddress
        }

        let result,
          error;
        try {
            result = await self.flightSuretyData.methods
              .balances(payload.passenger)
              .call({from: self.owner});
        } catch(err) {
            error = err;
        }
        let pasJson = {
            address: payload.passenger,
            balance: result.toString()
        };

        //let title = "id/isRegistered/registeredBy/status/passengers" + `${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']}`;
        //`Flight (id/isRegistered/registeredBy/status/passengers): ${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']} `;

        callback(error, pasJson)
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: self.firstFlight.timestamp //Math.floor(Date.now() / 1000) //TODO selection
        }
        let sender = self.firstAirline, // if owner is used with an index then this one is used
            predefinedIndex = 0;
        //added the 4th parameter zero, the owner is allowed to predefine one for testing purpose
        self.flightSuretyApp.methods
            .fetchFlightStatus(flight.airline, flight.name, flight.timestamp, predefinedIndex)
            .send({ from: sender}, (error, result) => {
                console.warn("payload fetchFlightStatus", result)
                callback(error, flight);
            });
    }

    registerAirline(airline, airlineName, airlineFrom, callback) {
        let self = this;
        //await config.flightSuretyApp.registerAirline(newAirline, {from: registeredAirline});
        if(!airlineFrom) {
            airlineFrom = self.firstAirline;
        }
        //self.flightSuretyApp.methods
        let gas = 1000000;
        self.flightSuretyApp.methods
          .registerAirline(airline, airlineName)
          .send({from: airlineFrom, gas: gas}, (error, result) => {
              //.send({from: self.firstAirline}, (error, result) => {
              callback(error, airline);
          });

        /*
        self.flightSuretyData.methods
          .createAirline(self.airlines[3])
          .send({from: self.owner, gas: 3000000}, (error, result) => {
          //.send({from: self.firstAirline}, (error, result) => {
              callback(error, payload);
          });
         */
        /*
        self.flightSuretyApp.registerAirline(payload.newairline, {from: self.firstAirline}, (error, result) => {
            callback(error, payload);
        });
        */
    }

    async fundAirline(airline, value, callback) {
        let self = this,
            gas = 1000000,
            result,
            error;

        try {
            result = await self.flightSuretyApp.methods
              .fundAirline()
              .send({from: airline, gas: gas, value: value}, (error, result) => {
                  //.send({from: self.firstAirline}, (error, result) => {
                  callback(error, airline);
              });
        } catch(err) {
            error = err;
        }

        callback(error, airline)
    }

    async bookFlight(flight, passenger, callback) {
        console.log("bookFlight", flight, passenger)
        let self = this;
        let gas = 1000000;

        let result,
          error;
        try {
            result =  await self.flightSuretyApp.methods
              .bookFlight(flight.airline, flight.name, flight.timestamp)
              .send({ from:  passenger, gas: gas});
        } catch(err) {
            error = err;
        }

        callback(error, flight)
    }

    async purchaseInsurance(flight, passenger, value, callback) {
        let self = this;
        let gas = 1000000;
        /*
        let payload = {
            airline: self.firstFlight.airline,
            name: self.firstFlight.name,
            timestamp: self.firstFlight.timestamp
        }
        */
        let result,
          error;
        try {
            result =  await self.flightSuretyApp.methods
              .buyFlightInsurance(flight.airline, flight.name, flight.timestamp)
              .send({ from: passenger, gas: gas, value: value});

        } catch(err) {
            error = err;
        }

        callback(error, flight)
    }

    async getInsurance(flight, passenger, callback) {
        console.log("getInsurance", flight, passenger)
        let self = this;

        let result,
          error,
          insuranceJson;
        try {
            result = await self.flightSuretyApp.methods
              .getInsurance(flight.airline, flight.name, flight.timestamp)
              .call({from: passenger});
            console.log("result", result)
            insuranceJson = {
                passenger: result['0'].toString(),
                insurance: result['1'].toString(),
                deposited: result['2'].toString()
            };
        } catch(err) {
            error = err;
        }
        //let title = "id/isRegistered/registeredBy/status/passengers" + `${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']}`;
        //`Flight (id/isRegistered/registeredBy/status/passengers): ${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']} `;

        callback(error, insuranceJson)
    }

    async getInfo(passenger, callback) {

        let balanceApp = await this.web3.eth.getBalance(this.flightSuretyApp._address);
        let balanceData = await this.web3.eth.getBalance(this.flightSuretyData._address);

        let balanceAcc = 0;


        if (passenger) {
            balanceAcc = await this.web3.eth.getBalance(passenger);
        }
        let line1 = `Balances (App/Data/Account): ${balanceApp.toString()} / ${balanceData.toString()} / ${balanceAcc.toString()} `;

        let total = await this.flightSuretyData.methods.numOfAirlines().call();
        let registered = await this.flightSuretyData.methods.numOfRegisteredAirlines().call();
        let funded = await this.flightSuretyData.methods.numOfFundedAirlines().call();
        let line2 = `Airlines (total/registered/funded): ${total.toString()} / ${registered.toString()} / ${funded.toString()} `;

        callback(null, line1 +line2)

    }

}