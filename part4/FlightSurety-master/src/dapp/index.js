
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });



        // User-submitted transaction

        ////// Test setup + fetches

        DOM.elid('submit-initTestsetup').addEventListener('click', () => {
            contract.initializeTestSetup((error, result) => {
                display('Airline', 'Register Airline', [ { label: 'Fetch Flight Status', error: error, value:result} ]);
            });
        })

        DOM.elid('submit-fetchAllAirlines').addEventListener('click', () => {
            contract.getAllAirlines((error, result) => {
                console.log(error,result);
                display('All airlines', 'Fetches Airlines (' + contract.numOfAccounts + ')' , [ { label: 'Airlines', error: error, value: result} ]);
            });
        })
        DOM.elid('submit-getFlight').addEventListener('click', () => {
            contract.getFlight((error, result) => {
                console.log(error,result);
                display('Flights', 'Fetches firstFlight  (' + JSON.stringify(contract.firstFlight) + ')' , [ { label: 'Flight', error: error, value: result} ]);
            });
        })

        DOM.elid('submit-registerAllOracles').addEventListener('click', () => {
            contract.registerAllOracles((error, result) => {
                console.log(error,result);
                display('Oracles', 'register oracles' , [ { label: 'Oracles', error: error, value: result} ]);
            });
        })

        DOM.elid('submit-getPassenger').addEventListener('click', () => {
            contract.getPassenger((error, result) => {
                console.log(error,result);
                display('Passenger', 'Fetches Passenger' , [ { label: 'Passenger', error: error, value: result} ]);
            });
        })



        // User-submitted transaction
        DOM.elid('submit-fetchFlight').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: 'airline: ' + result.airline + ' name: ' + result.flight + ' timestamp: ' + new Date(result.timestamp*1000) + ' (' + result.timestamp + ')'} ]);
            });
        })
        // User-submitted transaction
        DOM.elid('submit-registerAirline').addEventListener('click', () => {
            let airline = DOM.elid('airline-index').value;
            // Write transaction
            contract.registerAirline(airline, (error, result) => {
                display('Airline', 'Register Airline', [ { label: 'Fetch Flight Status', error: error, value: JSON.stringify(result)} ]);
            });
        })
        // User-submitted transaction
        DOM.elid('submit-getAirline').addEventListener('click', () => {
            let airline = DOM.elid('airline-ind').value;
            // Write transaction

            contract.getAirline(airline, (error, result) => {
                display('Airline Details', '#Airline ' + airline + ' (' + contract.airlines[airline] + ')', [ { label: 'Fetch Airline', error: error, value: JSON.stringify(result)} ]);
            });
            /*
            contract.getAirline(1,(error, result) => {
                console.log(error,result);
                display('Airline Details', 'First Airline', [ { label: 'Airline', error: error, value: JSON.stringify(result)} ]);
            });
            */

        })
    });
    

})();


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







