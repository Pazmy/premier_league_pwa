import dotenv from dotenv
dotenv.config()

const league_id = 2021;
const token = process.env.API_TOKEN;
const base_url = "https://api.football-data.org/v2/";
const standing_url = `${base_url}competitions/${league_id}/standings`;
const team_url = `${base_url}teams/`;

const fetchApi = (url) => {
  return fetch(url, {
    mode: "cors",
    headers: { "X-Auth-Token": token },
  });
};

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}
function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

function getStandings() {
  fetchApi(standing_url)
    .then(status)
    .then(json)
    .then(function (data) {
      console.log(data);
      standingsHTML(data);
    })
    .catch(error);
}

function getTeamById() {
  return new Promise(function (resolve, reject) {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    const team_id_url = `${base_url}teams/${idParam}`;

    fetchApi(team_id_url)
      .then(status)
      .then(json)
      .then(function (data) {
        console.log(data);
        teamHTML(data);
        resolve(data);
      });
  }).catch(error);
}

function getSavedTeams() {
  getAll().then(function (teams) {
    console.log(teams);
    savedTeamHtml(teams);
  });
}

function getSavedTeambyId() {
  const idParam = new URLSearchParams(window.location.search).get("id");
  const m = Number(idParam);
  getById(m).then((data) => {
    teamHTML(data);
  });
}

function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        const tx = db.transaction("teams", "readonly");
        const store = tx.objectStore("teams");
        const a = store.get(id);
        console.log(a);
        return a;
      })
      .then(function (team) {
        console.log(team);
        resolve(team);
      });
  });
}

function getMatch() {
  const MatchUrl = "https://api.football-data.org/v2/competitions/2021/matches";
  fetchApi(MatchUrl)
    .then(status)
    .then(json)
    .then((data) => {
      matchComponent(data);
    });
}

function matchComponent(data) {
  let matchComponent = `<table style="font-size: 12px;" class=striped responsive-table>
      <thead>
      <tr>
      <td><h6>Date</h6></td>
      <td><h6>Home</h6></td>
      <td><h6>FT</h6></td>
      <td><h6>Away</h6></td></tr>
      </thead>
      <tbody>`;
  data.matches.forEach((match) => {
    matchComponent += `
        <tr>
        <td>${match.utcDate.substr(0, 16)}</td>
        <td>${match.homeTeam.name}</td>
        <td colspan="">${match.score.fullTime.homeTeam} ${
      match.score.fullTime.awayTeam
    }</td>
        
       
        
        <td> ${match.awayTeam.name}</td></tr>
       `;
  });
  console.log(data);
  matchComponent += ` </tbody>
      </table>`;
  document.getElementById("match").innerHTML = matchComponent;
}

function standingsHTML(data) {
  let standingsHTML = `
              <table style="font-size:12px;" class="striped">
                <thead>
                  <tr>
                    <th colspan="3">Club</th>
                    <th>MP</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
          `;
  data.standings["0"].table.forEach(function (item) {
    standingsHTML += `
                  <tr>
                    <td>${item.position}</td>
                    <td><a href="./team.html?id=${item.team.id}"><img style="width:25px;" src="${item.team.crestUrl}"></a></td>
                    <td><a href="./team.html?id=${item.team.id}">${item.team.name}</a></td>
                    <td>${item.playedGames}</td>
                    <td>${item.won}</td>
                    <td>${item.draw}</td>
                    <td>${item.lost}</td>
                    <td>${item.points}</td>
                  </tr>
          `;
  });
  standingsHTML += `</tbody>
              </table>`;
  document.getElementById("standings").innerHTML = standingsHTML;
}

function teamHTML(data) {
  let teamHTML = `
        <div class="row">
        <h4 class="light center grey-text text-darken-3"> <b>${data.name}</b></h4>
        <p align="center"><img style="width:60px;" src="${data.crestUrl}"></p>
        <p align="center">Founded : ${data.founded}<br>Club Colors : ${data.clubColors}<br>Ground : ${data.venue}</p>
        <div class="col m12 s12 center-align">
            <div class="card-panel center">
              <h5>Competitions</h5>
              <p>
                <ul>
        `;
  data.activeCompetitions.forEach(function (item) {
    teamHTML += `
                  <li>${item.name}</li>
                    `;
  });
  teamHTML += `
                  </ul>
                </p>
                </div>
              </div>
            </div>
            <div class="row">
            <div class="col m12 s12">
            <table class="striped ">
            <thead>
            <tr>
            <th title="Jersey Number">#</th>
            <th title="Name">Name</th>
            <th title="Position">Position</th>
            
            <th title="Role">Role</th>
            </tr>
            </thead>
            <tbody>
             
                    `;

  data.squad.forEach(function (item) {
    teamHTML += `<tr><td>${
      item.shirtNumber == null ? " " : item.shirtNumber
    }</td>
                          <td>${item.name}</td>
                          <td>${
                            item.position == null ? " " : item.position
                          }</td>
                         
                          <td>${item.role}</td>
                       </tr>`;
  });
  teamHTML += `
               
          </tbody>
          </table>
          </div>
        </div>
                    `;
  document.getElementById("body-content").innerHTML = teamHTML;
}

function savedTeamHtml(teams) {
  let teamHTML = `<div class="row">`;
  teams.forEach(function (team) {
    teamHTML += `
      <div class="col s12 m6">    
      <div class="card">
        <div class="card-image " style="padding: 10px;">
          <img  src="${team.crestUrl}" style="max-width:346px;max-height:346px;" />
          <button class="btn-floating  halfway-fab waves-effect waves-light black" onclick="deleteTeam(${team.id})"><i class="fas fa-minus"></i></button>
        </div>
      <div class="card-content"> <a href="./team.html?id=${team.id}&saved=true">
        <span class="card-title truncate">${team.name}</span> </a>
        
      </div>
    </div>
    </div>
    
    `;
  });
  teamHTML += `</div>`;
  // Sisipkan komponen card ke dalam elemen dengan id #body-content
  document.getElementById("body-content").innerHTML = teamHTML;
}
