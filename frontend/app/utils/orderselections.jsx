
 //Adds a new analyte-method selection with turnaround and price
  //to the existing list stored in sessionStorage.
export function addSelectionToSession(analyteName, methodName, turnaround, price) {
  const key = "orderSelections";

  // Get existing selections of the analyte data
  const existing = JSON.parse(sessionStorage.getItem(key)) || [];

  // Create new data entry
  const newEntry = {
    analyte: analyteName,
    method: methodName,
    turnaround,
    price: parseFloat(price),
  };

  // Append to list and save
  const updated = [...existing, newEntry];
  sessionStorage.setItem(key, JSON.stringify(updated));
}


 //Retrieves all data saved from sessionStorage.
 //returnining {Array<Object>}
 
export function getSelectionsFromSession() {
  const key = "orderSelections";
  return JSON.parse(sessionStorage.getItem(key)) || [];
}


//Clears all saved selections from sessionStorage.
 
export function clearSelectionsFromSession() {
  sessionStorage.removeItem("orderSelections");
}