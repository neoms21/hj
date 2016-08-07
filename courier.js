console.log(main(4,2, "1,2,3,2,3,2,4,1", "2,4"));


function main(nrNodes, nrClients, transmissionsString, incomeString) {
   var orderedTrArr = transmissionsString.split(',').map(Number).sort().reverse();
   
   var clients = [];
   var finalCosts = [];
   var costs =[];
   var revIncArr = reverse(incomeString).split(',').map(Number);
   var nodes = [];

   for (var i = 0; i < nrClients; i++) {
      clients.push(new Client(orderedTrArr[i], revIncArr[i]));
   }

   var transmissionArr = transmissionsString.split(',').map(Number);

   for (i = 1; i <= nrNodes; i++) {
      nodes.push(new Node(i));
   }

   var j = 0; var nodeIndex= 1;

   var allRoutes =[];

   while (transmissionArr.length !== 0) {
      var numOfRelatedNodes = parseInt(transmissionArr[j]);
      var itemsToAccess = numOfRelatedNodes * 2;
      var itemsForNode = transmissionArr.slice(1, itemsToAccess + 1);

      var trNode = new Node(nodeIndex, 0);	
      for(var k =0; k<itemsForNode.length; k+=2)
      {
      	var arr= [];

      	arr.push(itemsForNode[k]);
      	arr.push(itemsForNode[k+1]);

      	trNode.costs.push(arr);

      }	

    //  console.log(nodeIndex , itemsForNode);
      allRoutes.push(trNode);

      transmissionArr.splice(j, itemsToAccess + 1);
      nodeIndex++;
      // console.log(transmissionArr);

   }

    //console.log(JSON.stringify(allRoutes));
    findCost(allRoutes, clients, costs);
  	
  	for(var t =0;t<= costs.length-1; t++){
  		var finalClient = findById(clients, costs[t].id);
  		if(finalClient !== undefined)
  		{
  			finalCosts.push(costs[t]);
  		}
  	}

   	var totalIncome = getTotal(clients, 'income');
  	
  	var allowedLength = finalCosts.length;
  	var cost = getTotal( finalCosts, 'cost');
	var idx = 1;
  	while(cost > totalIncome){
  		allowedLength -= 1;
		finalCosts.splice(idx,1);
  		cost = getTotal( finalCosts, 'cost');
  		idx++;
  	}

  	return allowedLength;
}

function getTotal(array, prop){
var total = 0;
	for(var i= 0; i<= array.length - 1; i++){
		total += array[i][prop];
	}
	return total;
}

function findCost(routes, clients, finalCosts){

	for(var i = 0; i<= routes.length - 1 ; i++)
	{
		var costs = routes[i].costs;
		for(var j =0; j<= costs.length - 1; j++)
		{
			var clientId = costs[j][0];
			var clientCost = costs[j][1];
				if(i === 0){

					finalCosts.push({id:clientId, cost:clientCost});
				}
				else
				{
					var fromFinalCost = findById(finalCosts, routes[i].id);
					finalCosts.push({id:clientId, cost: j === 0 ? fromFinalCost.cost + clientCost: clientCost });	
				}
			
		}
	}
}



function Client(id, income) {
   this.id = id;
   this.income = income;
}

function Node(id) {
   this.id = id;
   this.costs = [];
}

function findById(array, id) {
	var x;
  	for(var i = 0; i<= array.length - 1; i++){
  		if(array[i].id === id)
  		{	
  			x = array[i];
  			break;	
  		}
  	}

  	return x;
}


function reverse(s) {
   return s.split('').reverse().join('');
}