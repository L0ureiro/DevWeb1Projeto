document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addMatchForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const matchName = document.getElementById('matchName').value;
        const playerName = document.getElementById('playerName').value;

        // Close the modal
        $('#addMatchModal').modal('hide');

        // Add the match to the list
        addMatchToList(matchName, playerName);
    });

    function addMatchToList(matchName, playerName) {
        const matchList = document.getElementById('matchList');
  
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
          <td>${matchName}</td>
          <td>${playerName}</td>
          <td>10</td>
        `;
  
        matchList.appendChild(tableRow);
      }
})

function confirmDelete() {
  if (confirm('Are you sure you want to delete your account?')) {
    document.getElementById('delete-profile-form').submit();
  }
}
