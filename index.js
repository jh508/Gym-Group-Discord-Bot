const axios = require ("axios")


exports.handler = async function(event, context){
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];


  var today = new Date();
  const url = await axios.get(
    "https://www.thegymgroup.com/BranchGymBusynessBlock/GetBusynessForBranch/?branchId="
  );



  const data = url.data;
  const dataTime = data.currentBranch.lastUpdated.split("T");
  const maxCapacity = 125;
  const capacityPercentage = data.currentBranch.capacity.split("%");
  if(!isNaN(capacityPercentage[0])){
    var people = Math.round((capacityPercentage[0] / 100) * maxCapacity);
  }
  else{
   people = "Data is not available due to an API outage";
  }

  const message =
    "Gym Location: " +
    data.currentBranch.name +
    "\n" +
    "Capacity: " +
    people +
    "\n" +
    "Last Updated: " +
    dataTime[1] + "\n" +
    "Day: " + days[today.getDay()];


  if (today.getHours() >= 11) {
        await axios.post(
        "webhookURL",
        { content: message }
      );
      
  }

  return message;
}