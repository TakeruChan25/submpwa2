var base_url = "https://api.football-data.org/v2/";
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json
function getStandings() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/2014/standings").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var tblRow = "";
          data.standings[0].table.forEach(function(teams) {
            tblRow += `
                  <tr>
                    <td>${teams.position}</td>
                    <td><img src="${teams.team.crestUrl}" alt="${teams.team.name}" width="25" height="25"> </td>
                    <td>${teams.team.name}</td>
                    <td>${teams.playedGames}</td>
                    <td>${teams.won}</td>
                    <td>${teams.draw}</td>
                    <td>${teams.lost}</td>
                    <td>${teams.goalsFor}</td>
                    <td>${teams.goalsAgainst}</td>
                    <td>${teams.goalDifference}</td>
                    <td>${teams.points}</td>
                  </tr>
                `;
                
          });
          document.getElementById("esp-standings-body").innerHTML = tblRow;
        })
      }
    })
  }
    fetch(base_url + "competitions/2014/standings", {
      headers: {
        "X-Auth-Token" : "540454e6f6714ff88b99c1fcd56026ef",
      }
    })
    .then(json)
    .then(data => data.standings[0].table)
    .then(function(data) {
      var tblRow = "";
      data.forEach(function(teams) {
        tblRow += `
        <tr>
          <td>${teams.position}</td>
          <td><img src="${teams.team.crestUrl}" alt="${teams.team.name}" width="25" height="25"> </td>
          <td>${teams.team.name}</td>
          <td>${teams.playedGames}</td>
          <td>${teams.won}</td>
          <td>${teams.draw}</td>
          <td>${teams.lost}</td>
          <td>${teams.goalsFor}</td>
          <td>${teams.goalsAgainst}</td>
          <td>${teams.goalDifference}</td>
          <td>${teams.points}</td>
        </tr>
                `;
      });
      
      document.getElementById("esp-standings-body").innerHTML = tblRow;
      
    })
    .catch(function(error) {
      console.log(error)
    });
}
// Blok kode untuk melakukan request data json
function getTeams() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/2014/standings").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var tblRow = "";
          data.standings[0].table.forEach(function(teams) {
            tblRow += `
            <tr>
              <td>${teams.position}</td>
              <td><img src="${teams.team.crestUrl}" alt="${teams.team.name}" width="40" height="40"> </td>
              <td>${teams.team.name}</td>
              <td>
                <a href="detailteam.html?id=${teams.team.id}" class="btn halfway-fab waves-effect waves-light red"><i class="material-icons">list</i></a>
                <a class="btn halfway-fab waves-effect waves-light red"><i class="material-icons">favorite</i></a>
              </td>
            </tr>
                `;
          });

          document.getElementById("listTeams").innerHTML = tblRow;
        })
      }
    })
  }

    fetch(base_url + "competitions/2014/standings", {
      headers: {
        "X-Auth-Token" : "540454e6f6714ff88b99c1fcd56026ef",
      }
    })
    .then(json)
    .then(data => data.standings[0].table)
    .then(function(data) {
      var tblRow = "";
      data.forEach(function(teams) {
        tblRow += `
            <tr>
              <td>${teams.position}</td>
              <td><img src="${teams.team.crestUrl}" alt="${teams.team.name}" width="40" height="40"> </td>
              <td>${teams.team.name}</td>
              <td>
                <a href="detailteam.html?id=${teams.team.id}" class="btn halfway-fab waves-effect waves-light red"><i class="material-icons">list</i></a>
                <button class="btn halfway-fab waves-effect waves-light red fav-button" onclick='saveTeams(${JSON.stringify(teams.team)})'><i class="material-icons">favorite</i></button>
              </td>
            </tr>
                `;
      });
      
      document.getElementById("listTeams").innerHTML = tblRow;
      
    })
    .catch(function(error) {
      console.log(error)
    });
}

function getSavedTeams() {
  getAllSavedTeams().then(function(data) {
    var tblRow = "";
    var count = 1;
    //menyusun komponen card artikel secara dinamis
    data.forEach(function(teams) {
      tblRow += `
          <tr>
            <td>${count++}</td>
            <td><img src="${teams.crestUrl}" alt="${teams.name}" width="40" height="40"> </td>
            <td>${teams.name}</td>
            <td>
              <a href="detailteam.html?id=${teams.id}" class="btn halfway-fab waves-effect waves-light red"><i class="material-icons">list</i></a>
              <button onclick="deleteTeamById(this)" data-id="${teams.id}" class="btn halfway-fab waves-effect waves-light red"><i class="material-icons">delete</i></button>
            </td>
          </tr>
              `;
    });

    // // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("listTeams").innerHTML = tblRow;
  });
}

function deleteTeamById(row) {
  var id = row.getAttribute('data-id');
  
  deleteTeam(id);
  deleteRow(row);
}


function getTeamById() {
  // Ambil nilai query parameter (?id=)
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");

  if ("caches" in window) {
    caches.match(base_url + "teams/" + idParam).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var title = `${data.name}`;
          var cardContent = `<p class="text-center"><img src="${data.crestUrl}" alt="${data.name}"></p>`;
          var detail = `
              <table class="highlight details">
                <tbody>
                  <tr>
                    <td><span class="text-bold">Name</span></td>
                    <td>${data.name}</td>
                  </tr>
                  <tr>
                    <td><span class="text-bold">Short Name</span></td>
                    <td>${data.shortName}</td>
                  </tr>
                  <tr>
                    <td><span class="text-bold">Address</span></td>
                    <td>${data.address}</td>
                  </tr>
                  <tr>
                    <td><span class="text-bold">Website</span></td>
                    <td>${data.website}</td>
                  </tr>
                  <tr>
                    <td><span class="text-bold">Email</span></td>
                    <td>${data.email}</td>
                  </tr>
                  <tr>
                    <td><span class="text-bold">Founded</span></td>
                    <td>${data.founded}</td>
                  </tr>
                  <tr>
                    <td><span class="text-bold">Club Colors</span></td>
                    <td>${data.clubColors}</td>
                  </tr>
                  <tr>
                    <td><span class="text-bold">Venue</span></td>
                    <td>${data.venue}</td>
                  </tr>
                </tbody>
              </table>
            `;
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("details").innerHTML = detail;
          document.getElementById("card-content").innerHTML = cardContent;
          document.getElementById("title").innerHTML = title;
          tabInit();
        });
      }
    });
  }

  fetch(base_url + "teams/" + idParam, {
    headers: {
      "X-Auth-Token" : "540454e6f6714ff88b99c1fcd56026ef",
    }
  })
    .then(status)
    .then(json)
    .then(function(data) {
      var title = `${data.name}`;
          var cardContent = `<p class="text-center"><img src="${data.crestUrl}" alt="${data.name}"></p>`;
          var detail = `
            <table class="highlight details">
              <tbody>
                <tr>
                  <td><span class="text-bold">Name</span></td>
                  <td>${data.name}</td>
                </tr>
                <tr>
                  <td><span class="text-bold">Short Name</span></td>
                  <td>${data.shortName}</td>
                </tr>
                <tr>
                  <td><span class="text-bold">Address</span></td>
                  <td>${data.address}</td>
                </tr>
                <tr>
                  <td><span class="text-bold">Website</span></td>
                  <td>${data.website}</td>
                </tr>
                <tr>
                  <td><span class="text-bold">Email</span></td>
                  <td>${data.email}</td>
                </tr>
                <tr>
                  <td><span class="text-bold">Founded</span></td>
                  <td>${data.founded}</td>
                </tr>
                <tr>
                  <td><span class="text-bold">Club Colors</span></td>
                  <td>${data.clubColors}</td>
                </tr>
                <tr>
                  <td><span class="text-bold">Venue</span></td>
                  <td>${data.venue}</td>
                </tr>
              </tbody>
            </table>
          `;

          var players = "";
          data.squad.forEach(function(squad) {
            players += `
              <tr>
                <td><span class="text-bold">${squad.position}</span></td>
                <td>${squad.name}</td>
              </tr>
              `;
          })
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("details").innerHTML = detail;
        document.getElementById("card-content").innerHTML = cardContent;
        document.getElementById("title").innerHTML = title;
        document.getElementById("squadList").innerHTML = players;

        tabInit();
    });

}


// Blok kode untuk melakukan request data json
function getMatches() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/2014/matches?status=SCHEDULED").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var tblRow = "";
          data.matches.forEach(function(teams) {
            tblRow += `
                <tr>
                  <td align="left">${teams.homeTeam.name}</td>
                  <td>
                    <p>${getDate(teams.utcDate)[0]}</p>
                    <p>${getDate(teams.utcDate)[1]}</p>
                    <button class="btn bg-purple halfway-fab waves-effect waves-light red mt-1" onclick='saveSchedule(${JSON.stringify(teams)})'><i class="material-icons">add</i></button>
                  </td>
                  <td align="right">${teams.awayTeam.name}</td>
                </tr>
                    `;
          });

          document.getElementById("schedule-teams").innerHTML = tblRow;
        })
      }
    })
  }

  fetch(base_url + "competitions/2014/matches?status=SCHEDULED", {
    headers: {
      "X-Auth-Token" : "540454e6f6714ff88b99c1fcd56026ef",
    }
  })
  .then(json)
  .then(data => data.matches)
  .then(function(data) {
    var tblRow = "";
    data.forEach(function(teams) {
      tblRow += `
          <tr>
            <td align="left">${teams.homeTeam.name}</td>
            <td>
              <p>${getDate(teams.utcDate)[0]}</p>
              <p>${getDate(teams.utcDate)[1]}</p>
              <button class="btn bg-purple halfway-fab waves-effect waves-light red mt-1" onclick='saveSchedule(${JSON.stringify(teams)})'><i class="material-icons">add</i></button>
            </td>
            <td align="right">${teams.awayTeam.name}</td>
          </tr>
              `;
    });
    
    document.getElementById("schedule-teams").innerHTML = tblRow;
  })
  .catch(function(error) {
    console.log(error)
  });
}

function getSavedSchedule() {
  getAllSavedSchedule().then(function(data) {
    var tblRow = "";

    //menyusun komponen card artikel secara dinamis
    data.forEach(function(teams) {
      tblRow += `
          <tr>
            <td align="left">${teams.homeTeam.name}</td>
            <td>
              <p>${getDate(teams.utcDate)[0]}</p>
              <p>${getDate(teams.utcDate)[1]}</p>
              <button class="btn bg-purple halfway-fab waves-effect waves-light red mt-1" onclick="deleteScheduleById(this)" data-id="${teams.id}"><i class="material-icons">delete</i></button>
            </td>
            <td align="right">${teams.awayTeam.name}</td>
          </tr>
              `;
    });

    // // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("schedule-teams").innerHTML = tblRow;
  });
}

function deleteScheduleById(row) {
  var id = row.getAttribute('data-id');
  

  deleteSchedule(id);
  deleteRow(row);
}

function tabInit() {
  $('ul.tabs').tabs();

  $('.tabs').tabs('select','details');
}


function getImage(id) {
  var image = "";
  fetch(base_url + "teams/" + id, {
    headers: {
      "X-Auth-Token" : "540454e6f6714ff88b99c1fcd56026ef",
    }
  })
  .then(json)
  .then(function(data) {
    image = data.crestUrl;
  })
  .catch(function(error) {
    console.log(error)
  })

  return image;
}

function deleteRow(o) {
  var p=o.parentNode.parentNode;
      p.parentNode.removeChild(p);
}

function getDate(isoDate) {
  var date = new Date(isoDate);
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var dt = date.getDate();
  var minutes = date.getMinutes();
  var hour = date.getHours();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  var dateTime = [dt+'/' + month + '/'+year, pad(hour, 2) + ":" + pad(minutes, 2)];
  
  return dateTime;
}

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}