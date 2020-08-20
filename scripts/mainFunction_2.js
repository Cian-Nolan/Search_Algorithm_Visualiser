//---------------------------------------------------------------------------------------
// global variables
//---------------------------------------------------------------------------------------

  // grid size
  let gridRowSize = 20;
  let gridColSize = 20;

  // char array used to identify the state of the cell - '.' == empty, "#" == boundary, 'S' == Start Point, "E" == End Point
  let grid = [];
  // bool array to indicate if a the cell has already been visited in the search 
  let vis = [];
  // int array to indicate the distance from the start cell to all cells on the grid 
  let dist = [];
  // pair array to indicate in the the shortest path from start to finish (Djikstra)
  let path = [];
  // pair array to store the visited nodes in order. For display 
  let steps = [];
  
  //misc 
  let startMarker = 0;
  let endMarker = 90;
  let pathSolved = false;   //set to true after an algorithm is complete - used as a flag to subseqent calls of the function to perform re-initialise 

  // initialise arrays
  for(let row = 0 ; row < gridRowSize; row++)
  {
    let gridRow = new Array();
    let visRow = new Array();
    let distRow = new Array();

    for(let col = 0 ; col < gridColSize; col++)
    {
      gridRow.push('.');
      visRow.push(false);
      distRow.push(0);
    }

    grid.push(gridRow);
    vis.push(visRow);
    dist.push(distRow);
  }

//---------------------------------------------------------------------------------------
// utility functions
//---------------------------------------------------------------------------------------

  // percentage to color - used to display a gradient along the search path as a percentage of red->green
  // Credit: Michele Locati (mlocati)
  function perc2color(perc) {
    var r, g, b = 0;
    if(perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    }
    else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }

  // check if point is in range of grid
  function isValid(p, grid) {
    let row = p.first;
    let col = p.second;
    let rowSize = grid.length;
    let colSize = grid[0].length;
    return (row >= 0 && row < rowSize && col >= 0 && col < colSize);
  }

//---------------------------------------------------------------------------------------
// Breadth First Search
//---------------------------------------------------------------------------------------
  function bfs(start, grid, vis) 
  {
      //initialise
      steps = [];
      let flagFound = false;
      let directions = new Array(new pair(1, 0), new pair(-1, 0), new pair(0, 1), new pair(0, -1)); //  explore up, down, left, right
      let q = new queue(); // custom 'queue' data type

      q.push(start);
      vis[start.first][start.second] = true;
      steps.push(start);

      while (!q.empty()) 
      {
        let curr = q.top();
        q.pop();

        // explore all valid neighbours
        for(let i = 0; i < directions.length; i++) 
        {
              let adjacent = new pair((curr.first + directions[i].first), (curr.second + directions[i].second));                        
              if (isValid(adjacent, grid)) 
              {
                  if (vis[adjacent.first][adjacent.second] == false && grid[adjacent.first][adjacent.second] != '#') // '#' indicates a boundary defined in the UI 
                  {
                    // if neighbour is valid and is not visited, add to queue and mark as visited
                    q.push(adjacent);
                    vis[adjacent.first][adjacent.second] = true;
                    steps.push(adjacent);

                    if (grid[adjacent.first][adjacent.second] == 'E') 
                    {
                        console.log("found end at " + adjacent.first + ", " + adjacent.second);
                        flagFound = true;
                        break;
                    }
                  }
              }
          }
          if(flagFound) 
          {
            pathSolved = true;
            break;
          }
      }
      if(!flagFound)
      {
        alert("End point not found! Try re-drawing the boundaries");
      }  
  }

//---------------------------------------------------------------------------------------
// Djikstra Search Algorithm
//---------------------------------------------------------------------------------------
  function djikstra(start, end, grid, vis) 
  {
    //initialise
    steps = [];
    let flagFound = false;
    let distanceFound = Number.MAX_SAFE_INTEGER;
    let directions = new Array(new pair(1, 0), new pair(-1, 0), new pair(0, 1), new pair(0, -1));
    let pq = new priorityQueue(); // custom data structure
    steps = [];
    
    // initialise the 'shortest distance' arr
    dist.forEach( function(row, rowIndex){
      if (Array.isArray(row)){
        row.forEach( function (colIndex, colIndex){
          dist[rowIndex][colIndex] = Number.MAX_SAFE_INTEGER;
        });
        }
    });
    dist[start.first][start.second] = 0;

    // initialise the priority queue
    // format: <pair<int,int> , int>;
    pq.push(new pair(start, dist[start.first][start.second]));
    vis[start.first][start.second] = true;
    steps.push(start);

    while (!pq.empty()) 
    {
      let currNode = pq.top().first; // 'pair' object
      let currDist = pq.top().second; // integer
      pq.pop();

      //optimisation: don't continue down a longer path than the already found path
      if(flagFound && currDist > distanceFound) break;

      vis[currNode.first][currNode.second] = true;
      steps.push(currNode);

      for(let i = 0; i < directions.length; i++) 
      {
          let nextNode = new pair((currNode.first + directions[i].first), (currNode.second + directions[i].second)); 
          let shortestDistancetoCurrent = dist[currNode.first][currNode.second];
          let tempDistance = shortestDistancetoCurrent +  1; // not weighted
          
          if (isValid(nextNode, grid)) 
          {
              if (vis[nextNode.first][nextNode.second] == false && grid[nextNode.first][nextNode.second] != '#')
              {
                if(tempDistance < dist[nextNode.first][nextNode.second])
                {
                  dist[nextNode.first][nextNode.second] = tempDistance;
                  pq.push(new pair(nextNode, dist[nextNode.first][nextNode.second]) );
                }
              }

              if (grid[nextNode.first][nextNode.second] == 'E') 
              {
                  console.log("found end at " + nextNode.first + ", " + nextNode.second);
                  flagFound = true;
                  distanceFound = tempDistance;
              }
          }
      }     
    }
    if(flagFound) {
      pathSolved = true;
    }else{
      alert("End point not found! Try re-drawing the boundaries");
    }

    // reconstruct the shortest path
    // initialise
    path = [];
    let currNode = nextNode = nextNodeTemp = end;

    // work back through the dist array
    while(! (currNode.first == start.first && currNode.second == start.second )) 
    {
      path.push(currNode);

      let minNeighbour = Number.MAX_SAFE_INTEGER; // smallest weighted neighbour
      for(let i = 0; i < directions.length; i++) 
      {
        let nextNode = new pair((currNode.first + directions[i].first), (currNode.second + directions[i].second)); 

        if (isValid(nextNode, grid) && grid[nextNode.first][nextNode.second] != '#') 
        {
          if(dist[nextNode.first][nextNode.second] < minNeighbour) //choose the shortest path
          {
            minNeighbour = dist[nextNode.first][nextNode.second];
            nextNodeTemp = nextNode;
          }
        }
      }
      currNode = nextNodeTemp;
    }
  }
 
//---------------------------------------------------------------------------------------
// Clean-up functions 
//---------------------------------------------------------------------------------------

  // delete all render from all cells
  function renderDeleteAll()
  {
      $('.cell').each(function(){
        $(this).removeClass("cell-selected"); // remove boundary
        $(this).removeClass("cell_active");  // remove path
        $(this).css("background-color",""); // setting a property = "" removes it from the object

        if( $(this).index() != startMarker &&  $(this).index() != endMarker )
        {
          $(this).html('');
        }
      })
  }

  //delete render related to a previously calculated path
  function renderDeletePath()
  {
      $('.cell').each(function(){
        if( !$(this).hasClass("cell-selected") )  
        {
          $(this).removeClass("cell_active"); // remove path
          $(this).css("background-color",""); // remove path
        }
        if( $(this).index() != startMarker &&  $(this).index() != endMarker )
        {
          $(this).html(''); // !!
        }
  
      })
  }

  // delete all solution data
  function solutionDeleteAll()
  {
        grid.forEach( function(row, rowIndex){
            if (Array.isArray(row)){
              row.forEach( function (colIndex, colIndex){
                if(grid[rowIndex][colIndex] != 'S' && grid[rowIndex][colIndex] != 'E')
                {
                  grid[rowIndex][colIndex] = '.';
                }
              });
            }
        });

        vis.forEach( function(row, rowIndex){
          if (Array.isArray(row)){
            row.forEach( function (colIndex, colIndex){
              vis[rowIndex][colIndex] = false;
            });
            }
        });

        dist.forEach( function(row, rowIndex){
          if (Array.isArray(row)){
            row.forEach( function (colIndex, colIndex){
              dist[rowIndex][colIndex] = 0;
            });
            }
        });
  }

  //delete solution data related to a previously calculated path
  function solutionDeletePath()
  {
    vis.forEach( function(row, rowIndex){
      if (Array.isArray(row)){
        row.forEach( function (colIndex, colIndex){
          vis[rowIndex][colIndex] = false;
        });
        }
    });

    dist.forEach( function(row, rowIndex){
      if (Array.isArray(row)){
        row.forEach( function (colIndex, colIndex){
          dist[rowIndex][colIndex] = 0;
        });
        }
    });
  }

  // draw the shortest path on the grid (Djikstra)
  function drawDjikstraPath()
  {
    for(let i = 1; i < path.length; i++)
    {
      let gridIndex  = rcToIndex(path[i].first, path[i].second , gridRowSize);
      $('.cell').eq(gridIndex).html('<div class="marker_path bg-dark"></div>'); 
    }

  }

  // re-render a percentage of the grid based on the slider UI element 
  function renderGrid(perc, opt) 
  {
    renderDeletePath();
    if(opt == 1) drawDjikstraPath();

    for(let i = 0; i < steps.length; i++)
    {
      let s = steps.length;
      let row = steps[i].first;
      let col = steps[i].second;
      let thisPercent = Math.floor(100 * (i/s) );
      if(thisPercent <= perc)
      {
        $('.cell').eq(rcToIndex(row, col, gridRowSize)).css("background-color", perc2color(thisPercent));
      }
    }
  }

//---------------------------------------------------------------------------------------
// User Interface Elements
//---------------------------------------------------------------------------------------
$(document).ready(function(e) {

  // solve button
  $('#solveExecute').click( function(){
    if(pathSolved == true)
    {
      renderDeletePath();
      solutionDeletePath();
    }
    let start_row = parseInt($('#row_start').val());
    let start_col = parseInt($('#col_start').val());
    let start = new pair(start_row, start_col);

    let end_row = parseInt($('#row_end').val());
    let end_col = parseInt($('#col_end').val());
    let end = new pair(end_row, end_col);

    let alg_id =  $("#algo_id").find(":selected").text();
    if(alg_id === "BFS")
    {
      bfs(start, grid, vis);
      renderGrid($('#replay_perc').val(), 0);
    }else{
      djikstra(start, end, grid, vis);
      renderGrid($('#replay_perc').val(), 1);
      drawDjikstraPath();
    }

  });

  // reset button
  $('#resetExecute').click( function(){
      solutionDeleteAll();
      renderDeleteAll();
  });

  // slider (progress/replay)
  $('#replay_perc').change( function(){
    let perc = $(this).val();
    $('#replay_perc_display').val(perc);

    let alg_id =  $("#algo_id").find(":selected").text();
    if(alg_id === "BFS")
    {
      renderGrid(perc, 0);
    }else{
      renderGrid(perc, 1);
    }
    
  });

});
