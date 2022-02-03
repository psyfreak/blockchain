import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
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

            (this.flightSuretyApp.events.allEvents({
                filter: {
                    //fromBlock: 0, toBlock: 'latest'
                    // myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'
                }, // Using an array means OR: e.g. 20 or 23
                fromBlock: 0
            }, function(error, event){ console.log(event); })
              .on("connected", function(subscriptionId){
                  console.log(subscriptionId);
              })
              .on('data', function(event){
                  console.log(event); // same results as the optional callback above
              })
              .on('changed', function(event){
                  // remove event from local database
                  console.log(event);
              })
              .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                  console.log(error, receipt);
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
        // TODO try out web3 batch processing
        self.flightSuretyApp.methods
          .registerFlight(this.firstFlight.name, this.firstFlight.timestamp)
          .send({ from: this.firstFlight.airline, gas: gas}, (error, result) => {
              callback(error, self.firstFlight);

              // register passenger
              self.flightSuretyApp.methods
                .bookFlight(self.firstFlight.airline, self.firstFlight.name, self.firstFlight.timestamp)
                .send({ from:  self.passengers[0], gas: gas}, (error, result) => {
                    callback(error, self.passengers[0]);

                    // register passenger
                    self.flightSuretyApp.methods
                      .buyFlightInsurance(self.firstFlight.airline, self.firstFlight.name, self.firstFlight.timestamp)
                      .send({ from:  self.passengers[0], gas: gas, value: 10}, (error, result) => {
                          callback(error, self.passengers[0]);

                      });


                });
          });
    };

    async registerAllOracles(callback) {
        /*
        const userAction = async () => {
            const response = await fetch('http://example.com/movies.json');
            const myJson = await response.json(); //extract JSON from the http response
            // do something with myJson
        }*/
        const response = await fetch('http://127.0.0.1:3000/api/oracles', {
            method: 'POST',
            body: "", // string or object
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("response", response)
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson
        callback(null, myJson);
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyData.methods
            .isOperational()
            .call({from: self.owner}, callback);
    }

    async printAirline(airlineIndex, callback) {
        let self = this;
        self.flightSuretyData.methods
          //.getAirlineByAddress(self.firstAirline)
          .getAirlineByAddress(self.airlines[airlineIndex])
          .call({from: self.owner}, callback);
    }
    async getAirline(airlineAddress, callback) {
        let self = this;
        /*
        self.flightSuretyData.methods
          //.getAirlineByAddress(self.firstAirline)
          .getAirlineByAddress(self.airlines[airlineIndex])
          .call({from: self.owner}, callback);
        */
        let airline = await self.flightSuretyData.methods
          //.getAirlineByAddress(self.firstAirline)
          .getAirlineByAddress(airlineAddress)
          .call({from: self.owner});
        console.warn("airline", airline)
        return airline;
    }
    async getAllAirlines(callback) {
        let self = this;
        let airlines = [];
        airlines.push({
            id: "",
            registered: "",
            registeredBy: "",
            investment: "",
            timestamp: ""
        })

        for(let acc of self.airlines) {
           let airline = await this.getAirline(acc)
            //airline
            airline['4'] = new Date(airline['4']*1000);
            airlines.push(airline);
        }
        callback(null, airlines)
    }

    async getFlight(callback) {
        let self = this;
        let payload = {
            airline: self.firstFlight.airline,
            name: self.firstFlight.name,
            timestamp: self.firstFlight.timestamp
        }
        console.warn(payload);
        console.warn("after", self.firstFlight.timestamp);

        let result = await self.flightSuretyData.methods
          .getFlight(payload.airline, payload.name, payload.timestamp)
          .call({from: self.owner});

        let flightJson = {
            id: result['0'].toString(),
            isRegistered: result['1'].toString(),
            registeredBy: result['3'].toString(),
            status: result['2'].toString(),
            passengers: result['4'].toString()
        };

        //let title = "id/isRegistered/registeredBy/status/passengers" + `${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']}`;
          //`Flight (id/isRegistered/registeredBy/status/passengers): ${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']} `;

        callback(null, flightJson)
    }

    async getPassenger(callback) {
        let self = this;
        let payload = {
            passenger: self.passengers[0]
        }
        console.warn(payload);

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

    fetchFlightStatus(flight, callback) {
        console.log(this.airlines[0])
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
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp, predefinedIndex)
            .send({ from: sender}, (error, result) => {
                console.warn("payload fetchFlightStatus", result)
                callback(error, payload);
            });
    }

    registerAirline(airlineIndex, callback) {
        let self = this;
        let payload = {
            newairline: self.airlines[airlineIndex]
        }
        //await config.flightSuretyApp.registerAirline(newAirline, {from: registeredAirline});

        //self.flightSuretyApp.methods
        let gas = 1000000;
        self.flightSuretyApp.methods
          .registerAirline(self.airlines[1])
          .send({from: self.firstAirline, gas: gas}, (error, result) => {
              //.send({from: self.firstAirline}, (error, result) => {
              callback(error, payload);
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


}