
//---------------------------------------------------------------------------------------
// utility functions
//---------------------------------------------------------------------------------------
    
    // returns grid index equivalent to the passed row, column coordinate
    function rcToIndex(row,col,size)
    {
        return parseInt((row*size) + col);
    }

    // returns row, column coordinate - as a 'pair' custom struct - equivalent to the passed grid index 
    function indexToRc(index,size)
    {
        let row = Math.floor(index / size);
        let col = index % size;
        ret = new pair(row,col);
        return ret;
    }

    // update the global 'grid' array 
    function updateGrid(cell)
    {
        let val = $(cell).hasClass('cell-selected');
        let rowSize = $(cell).parent().css('grid-template-columns').split(' ').length;
        let p = indexToRc( $(cell).index(), rowSize );
        grid[p.first][p.second] = (val == true) ? '#' : '.';
    }

    // update the start marker
    function updateStartMarker(){

        let row = parseInt( $('#row_start').val() );
        let col = parseInt( $('#col_start').val() );
        let rowSize = parseInt( $('.cell').parent().css('grid-template-columns').split(' ').length );
        let gridIndex = rcToIndex(row,col,rowSize);

        if (!$('.cell').eq(gridIndex).hasClass('cell-selected')  && (gridIndex != endMarker) )
        {
            $('.cell').eq(startMarker).html('');
            $('.cell').eq(gridIndex).html('<div class="marker_start bg-dark">S</div>'); 
    
            let prev = indexToRc(startMarker, rowSize);
            let next = indexToRc(gridIndex, rowSize);

            grid[prev.first][prev.second]   = '.';
            grid[next.first][next.second]   = 'S';

            startMarker = gridIndex;

            //disable relevant selection on the endMarker - prevents startMarker and endMarker residing in the same cell
            $("#row_start option").removeAttr("disabled");        // disable item from being selected 
            $("#row_start option").removeClass("disabledOption"); // apply the 'disabledOption' style
            $("#col_start option").removeAttr("disabled");
            $("#col_start option").removeClass("disabledOption");

            let rowEnd = parseInt( $('#row_end').val() );
            let colEnd = parseInt( $('#col_end').val() );

            if(row == rowEnd)
            {
                let $disableCol = $( "#col_start option:eq(" + colEnd + ")" );
                $disableCol.attr("disabled", "disabled");
                $disableCol.addClass("disabledOption");

                let $disableColEnd = $( "#col_end option:eq(" + col + ")" );
                $disableColEnd.attr("disabled", "disabled");
                $disableColEnd.addClass("disabledOption");
            }

            if(col == colEnd)
            {
                let $disableRow = $( "#row_start option:eq(" + rowEnd + ")" );
                $disableRow.attr("disabled", "disabled");
                $disableRow.addClass("disabledOption");

                let $disableRowEnd = $( "#row_end option:eq(" + row + ")" );
                $disableRowEnd.attr("disabled", "disabled");
                $disableRowEnd.addClass("disabledOption");
            }

        }else
        {
            alert(`Can't move the marker here as the cell is already used. Select an empty cell`);
        }
    }

    function updateEndMarker(){

        let row = parseInt( $('#row_end').val() );
        let col = parseInt( $('#col_end').val() );

        let rowSize = parseInt( $('.cell').parent().css('grid-template-columns').split(' ').length );
        let gridIndex = rcToIndex(row,col,rowSize);

        if ( !$('.cell').eq(gridIndex).hasClass('cell-selected')  && (gridIndex != startMarker)  )
        {
            $('.cell').eq(endMarker).html('');
            $('.cell').eq(gridIndex).html('<div class="marker_end bg-dark">E</div>'); 
            
            let prev = indexToRc(endMarker, rowSize);
            let next = indexToRc(gridIndex, rowSize);

            grid[prev.first][prev.second]   = '.';
            grid[next.first][next.second]   = 'E';

            endMarker = gridIndex;

            //disable relevant selection on the startMarker - prevents startMarker and endMarker residing in the same cell
            $("#row_end option").removeAttr("disabled");
            $("#row_end option").removeClass("disabledOption"); 
            $("#col_end option").removeAttr("disabled");
            $("#col_end option").removeClass("disabledOption");

            let rowStart = parseInt( $('#row_start').val() );
            let colStart = parseInt( $('#col_start').val() );

            if(row == rowStart)
            {
                let $disableCol = $( "#col_end option:eq(" + colStart + ")" );
                $disableCol.attr("disabled", "disabled");
                $disableCol.addClass("disabledOption");
            }

            if(col == colStart)
            {
                let $disableRow = $( "#row_end option:eq(" + rowStart + ")" );
                $disableRow.attr("disabled", "disabled");
                $disableRow.addClass("disabledOption");
            }

        }else
        {
            alert(`Can't move the marker here as the cell is already used. Select an empty cell`);
        }
    }

    function updateBoundary(cell)
    {
        let rowSize = cell.parent().css('grid-template-columns').split(' ').length;
        let gridIndex = cell.index();

        if(gridIndex != startMarker && gridIndex != endMarker)
        {
            let rcPair = indexToRc(gridIndex, rowSize);
            let row = rcPair.row;
            let col = rcPair.col;

            cell.toggleClass("cell-selected");
            
            updateGrid(cell);
        }
        else
        {
            alert(` Can'place a boundary at the start/end markers! Select a free location for a boundary `);
        }
    }
//---------------------------------------------------------------------------------------
// User Interface Elements
//---------------------------------------------------------------------------------------

$(document).ready(function(e) {

    // update the start/end markers on page load
    let done = false;
    if(done == false){
        updateStartMarker();
        updateEndMarker();
        done = true;
    }

    // update the coordinate data & UI if markers have changed
    $('#marker_start').change(updateStartMarker);
    $('#marker_end').change(updateEndMarker);

    // update the coordinate data & UI if boundary have updated
    $('.cell').click( function(){
        updateBoundary($(this));
    });
    
    // hover status
    $('.cell').hover( function(){
        $(this).toggleClass("cell-hover");
    });


 });




