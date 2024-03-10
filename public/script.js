const registerform = document.querySelector(".container");
const loginform = document.querySelector(".login-form");
const showregister = () => {
    registerform.classList.add("register-form");
    console.log("clicked hai jii");
}
const showlogin = () => {
    loginform.classList.add("display");
    console.log("clicked hai jii");
}
const hideform = ()=>{
    registerform.classList.remove("display");
    loginform.classList.remove("display");
}
function filter(id) {
    const urlParams = new URLSearchParams(window.location.search);
    const locationValue = urlParams.get('location');
    const playersContainer = document.getElementById('containercard');
    const uid = id;
  
    fetch('/players?format=json')
      .then(response => response.json())
      .then(data => {
        // Check if data.players is an array
        if (Array.isArray(data.players)) {
          // Clear the existing content in the container
          playersContainer.innerHTML = '';
  
          data.players.forEach(player => {
          
           
            // Check if location and sports properties exist before accessing
            if (player.location && player.sports  && Array.isArray(player.sports)) {
              // Check if the location matches and "cricket" is in the sports array
             
              if (
                (player.location.toLowerCase() === locationValue.toLowerCase() ||
                player.state.toLowerCase() === locationValue.toLowerCase()
                
                ) &&
              player.sports.includes(uid)
                
              ) {
               
                // Append the player template to the container
                playersContainer.innerHTML += `
                  <div class="card">
                    <h2>${player.name}</h2>
                    <p>Sport: ${player.sports.join(', ')}</p>
                    <p>Location: ${player.location}, ${player.state}, ${player.city}</p>
                    <p>Experience: ${player.skills}</p>
                    <p>Gender: ${player.gender}</p>
                    <button>Chatnow</button>
                  </div>
                `;
              }
            }
          });
        } else {
          console.error('Invalid data format. Expected an array of players.');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }


  
  
  