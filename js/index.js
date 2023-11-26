document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission
    document.getElementById('addMatchForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Get match and player names from the form
        const matchName = document.getElementById('matchName').value;
        const playerName = document.getElementById('playerName').value;

        // Close the modal
        $('#addMatchModal').modal('hide');

        // Add the match to the list
        addMatchToList(matchName, playerName);
    });

    function addMatchToList(matchName, playerName) {
        const matchList = document.getElementById('matchList');
  
        // Create a new table row
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
          <td>${matchName}</td>
          <td>${playerName}</td>
          <td>10</td>
        `;
  
        // Insert the new table row at the beginning of the match list
        matchList.appendChild(tableRow);
      }
});
