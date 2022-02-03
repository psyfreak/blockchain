import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';
import Config from './config.json';

(async() => {

    let result = null;


    let contract = new Contract('localhost', () => {

        initializeUI(contract);


        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });



        // User-submitted transaction
        DOM.elid('clear-log').addEventListener('click', () => {
            DOM.elid('display-wrapper').innerHTML = "";
        })

        ////// Test setup + fetches

/*        DOM.elid('submit-initTestsetup').addEventListener('click', () => {
            contract.initializeTestSetup((error, result) => {
                display('Airline', 'Register Airline', [ { label: 'Fetch Flight Status', error: error, value:result} ]);
            });
        })*/

        DOM.elid('submit-registerAllOracles').addEventListener('click', () => {
            let value = prompt("Please enter the amount of oracles you want to register", "10");
            if(value) {
                contract.registerAllOracles(value, (error, result) => {
                    console.log(error,result);
                    display('Oracles', 'register oracles' , [ { label: 'Oracles', error: error, value: result} ]);
                });
            }


        });

        // Register airline
        DOM.elid('submit-registerAirline').addEventListener('click', () => {
            let airline = DOM.elid('airlines-selector').value;
            // Write transaction
            contract.registerAirline(airline, (error, result) => {
                display('Airline', 'Register Airline', [ { label: 'Fetch Flight Status', error: error, value: JSON.stringify(result)} ]);
            });
        });
        // Fund airline
        DOM.elid('submit-fundAirline').addEventListener('click', () => {
            let airline = DOM.elid('airlines-selector').value;
            // Write transaction
            let value = prompt("Please enter the amount for the registration fee in wei (or refund)", "10");
            if(value) {
                contract.fundAirline(airline, value, (error, result) => {
                    display('Airline', 'Fund Airline', [{label: 'Fund', error: error, value: JSON.stringify(result)}]);
                });
            }
        });
        // get Airline
        DOM.elid('submit-getAirline').addEventListener('click', () => {
            let airline = DOM.elid('airlines-selector').value;
            // Write transaction
            contract.getAirline(airline, (error, result) => {
                display('Airline', '#Details ' + result.id, [ { label: 'Get Airline', error: error, value: result} ]);
            });
            /*
            contract.getAirline(1,(error, result) => {
                console.log(error,result);
                display('Airline Details', 'First Airline', [ { label: 'Airline', error: error, value: JSON.stringify(result)} ]);
            });
            */
        });

        DOM.elid('submit-fetchAllAirlines').addEventListener('click', () => {
            contract.getAllAirlines((error, result) => {
                console.log(error,result);
                display('Airline', 'All Airlines (' + contract.numOfAccounts + ')' , [ { label: 'Airlines', error: error, value: result} ]);
            });
        })

        // get passenger
        DOM.elid('submit-getPassenger').addEventListener('click', () => {
            let passenger = DOM.elid('passengers-selector').value;
            contract.getPassenger(passenger, (error, result) => {
                console.log(error,result);
                display('Passenger', 'Fetches Passenger' , [ { label: 'Passenger', error: error, value: result} ]);
            });
        })


        // get passenger
        DOM.elid('submit-getFlight').addEventListener('click', () => {
            let flightObj = getFlightObj();
            contract.getFlight(flightObj, (error, result) => {
                display('Flight', 'getFlight  (' + JSON.stringify(contract.firstFlight) + ')' , [ { label: 'Flight', error: error, value: result} ]);
            });
        })


        DOM.elid('submit-registerFlight').addEventListener('click', () => {

            let flightObj = getFlightObj();
            // Write transaction
            contract.registerFlight(flightObj, (error, result) => {
                display('Flight', 'Register Flight', [ { label: 'Flight', error: error, value: JSON.stringify(result)} ]);
            });
        });



        DOM.elid('submit-fetchFlightStatus').addEventListener('click', () => {
            let flightObj = getFlightObj();
            // Write transaction
            contract.fetchFlightStatus(flightObj, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: 'airline: ' + result.airline + ' name: ' + result.name + ' timestamp: ' + new Date(result.timestamp*1000).toISOString() + ' (' + result.timestamp + ')'} ]);
            });
        });

        DOM.elid('submit-bookFlight').addEventListener('click', () => {
            let flightObj = getFlightObj();
            let passenger = DOM.elid('passengers-selector').value;
            // Write transaction
            contract.bookFlight(flightObj, passenger,(error, result) => {
                display('Flight', 'bookFlight', [ { label: 'bookFlight', error: error, value: 'airline: ' + result.airline + ' name: ' + result.name + ' timestamp: ' + new Date(result.timestamp*1000).toISOString() + ' (' + result.timestamp + ')'} ]);
            });
        });

        DOM.elid('submit-purchaseInsurance').addEventListener('click', () => {
            let flightObj = getFlightObj();
            let passenger = DOM.elid('passengers-selector').value;
            let value = prompt("Please enter the amount for the insurance fee in wei", "10");
            if(value) {
                // Write transaction
                contract.purchaseInsurance(flightObj, passenger,value,(error, result) => {
                    display('Flight Insurance', 'purchaseInsurance with value (wei):' + value + ' for passenger: ' + genReadableAddress(passenger), [ { label: ' for flight', error: error, value: 'airline: ' + result.airline + ' name: ' + result.name + ' timestamp: ' + new Date(result.timestamp*1000).toISOString() + ' (' + result.timestamp + ')'} ]);
                });
            }
        });

        // get passenger
        DOM.elid('submit-getInsurance').addEventListener('click', () => {
            let passenger = DOM.elid('passengers-selector').value;
            contract.getInsurance(passenger, (error, result) => {
                console.log(error,result);
                display('Flight Insurance', 'getInsurance for passenger' , [ { label: 'Passenger', error: error, value: result} ]);
            });
        })

    });

})();

function initializeUI(contract) {

    let ddl = DOM.elid("airlines-selector");
    for(let airline of Config.airlines) {
        let option = document.createElement("OPTION");
        option.innerHTML = airline.name + ' (' + genReadableAddress(airline.airline) + ')'
          option.value = airline.airline;
        ddl.options.add(option);
    }

    ddl = DOM.elid("passengers-selector");
    for(let passenger of contract.passengers) {
        let option = document.createElement("OPTION");
        option.innerHTML = passenger
        option.value = passenger;
        ddl.options.add(option);
    }

    ddl = DOM.elid("flights-selector");
    for(let flight of Config.flights) {
        let option = document.createElement("OPTION");
        option.innerHTML = genReadableFlight(flight);//JSON.stringify(flight);
        option.value = flight.airline + "|" + flight.name + "|" + flight.departure;
        ddl.options.add(option);
    }

}

function getFlightObj() {
    let flight = DOM.elid('flights-selector').value;
    let flightStrArray = flight.split('|');
    let flightObj = {
        airline: flightStrArray[0],
        name: flightStrArray[1],
        timestamp: flightStrArray[2]
    }
    return flightObj;
}

function genReadableFlight(flightObj) {
   return flightObj.name  + ' / ' + genReadableAddress(flightObj.airline) + ' / ' + new Date(flightObj.departure*1000).toISOString()
}

function genReadableAddress(adr) {
    return adr.substr(0, 10) + '...';
}

function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();

    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-3 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-9 field-value'}, result.error ? String(result.error) :  JSON.stringify(result.value) ));
        section.appendChild(row);
    })
    displayDiv.prepend(section);
    //displayDiv.append(section);
}







