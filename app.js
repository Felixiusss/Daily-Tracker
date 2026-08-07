const liste = document.querySelector('.goals-ul')
const addButton = document.querySelector('.js-add-btn')
const titelInput = document.getElementById('titel')
const goalInput = document.getElementById('goal')
const hamburgerBtn = document.querySelector('.js-hamburger-btn')
const menuOverlay = document.querySelector('.js-menu-overlay');

const userId = localStorage.getItem('userId')
const username = localStorage.getItem('username')

const history = document.getElementById('history')
const start = document.getElementById('start')
const goalsPage = document.getElementById('goals-page');
const historyPage = document.getElementById('history-page');

const viewFilterButtons = document.querySelectorAll('.filter-btn');
const viewFilterContainer = document.querySelector('.view-filter-container');

const timeBtns = document.querySelectorAll('.time-btn')
const detailsBtn = document.getElementById('js-details-btn')
const übersichtBtn = document.getElementById('js-übersicht-btn')
const historyListe = document.querySelector('.history-ul')

const heatMapContainer = document.getElementById('view-heatmap')
const detailContainer = document.getElementById('view-detail')

const allFilter = document.querySelector('.js-all')
const weekFilter = document.querySelector('.js-week')
const monthFilter = document.querySelector('.js-month')
const threeMonthFilter = document.querySelector('.js-three-month')

const timeFilter = document.querySelector('.js-time-filter')

console.log(userId)
console.log(username)

const API_URL = ' https://daily-tracker-exl8.onrender.com'

import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1/+esm'

const today = dayjs()
console.log(today)

async function ladeZiele() {
  const antwort = await fetch(`${API_URL}/daily-tracker/${userId}`)

  const ziele = await antwort.json()
  console.log(ziele)

  liste.innerHTML = ''

  ziele.forEach((ziel) => {
    const liElem = document.createElement('li')
    const percent = Math.min((ziel.achieved / ziel.goal) * 100, 100)
    liElem.dataset.id = ziel.id
    ziel.done = ziel.achieved >= ziel.goal ? true : false
  liElem.className = ziel.done ? 'done' : ''
  liElem.innerHTML = `
  <span class="goal-titel">${ziel.titel}</span>
  <div class="progress-bar-wrap">
    <div class="progress-bar-fill" style="width: ${percent}%"></div>
  </div>
  <span class="goal-progress"><span>${ziel.achieved}</span> / ${ziel.goal}</span>

  <span class="delete-goal"><img class="js-delete-btn" alt="" 
  src="delete.svg"></span>

  <span class="edit-goal"><img class="js-edit-btn" alt="" 
  src="edit.svg"></span>
`
    liste.append(liElem)
  })

  const deleteBtns = document.querySelectorAll('.js-delete-btn')

  deleteBtns.forEach( (deleteBtn) => {
    deleteBtn.addEventListener('click', async (e) => {
    const target = e.target.parentElement.parentElement
    console.log(target)

    const id = target.dataset.id
    try{
      const response = await fetch(`${API_URL}/daily-tracker/${id}/${userId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
        console.log('Erfolgreich gelöscht')
      } else {
        console.error('Server konnte nicht löschen:', response.status)}
      
        ladeZiele()
    }
    
    catch (error){
      console.error('Netzwerkfehler beim Löschen:', error)
    }
  })
  })

  const editBtns = document.querySelectorAll('.js-edit-btn')

  editBtns.forEach((editBtn) => {
    editBtn.addEventListener('click', async (e) => {
    const target = e.target.parentElement
    const id = target.parentElement.dataset.id
    
    target.innerHTML = `<input class="update-input" type="number"> <button class="update-goal"><img alt="" src="accept.svg"> </button>`

    target.classList.add('edited')

    const updateBtn = document.querySelector('.update-goal')
    const updateInput = document.querySelector('.update-input')

    updateBtn.addEventListener('click', async () => {
      const achieved = Number(updateInput.value)
      console.log(achieved)

      console.log('id:', id)
      console.log('target dataset:', target.dataset)

      await fetch(`${API_URL}/daily-tracker/${id}/${userId}`, {
      method: 'PATCH',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({achieved: achieved})
      })

      target.innerHTML = '<img class="js-edit-btn" alt="" src="edit.svg">'

      target.classList.remove('edited')

      ladeZiele()

    })
  })
  })
}

addButton.addEventListener('click', async () => {
  const titel = titelInput.value.trim()
  const goal = goalInput.value.trim()

  console.log(titel)
  console.log(goal)

  if(titel == '' || goal == ''){return}

  titelInput.value = ''
  goalInput.value = ''

  await fetch(`${API_URL}/daily-tracker/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({titel, goal})
  })

  ladeZiele()
})

hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('is-active')
  menuOverlay.classList.toggle('is-active');
})

history.addEventListener('click', async () => {
  const antwort = await fetch(`${API_URL}/history/${userId}`)
  const ziele = await antwort.json()
  console.log(ziele)

  goalsPage.classList.add('hidden')
  historyPage.classList.remove('hidden')

  menuOverlay.classList.remove('is-active');
  hamburgerBtn.classList.remove('is-active');
})

start.addEventListener('click',() => {
  goalsPage.classList.remove('hidden')
  historyPage.classList.add('hidden')

  menuOverlay.classList.remove('is-active');
  hamburgerBtn.classList.remove('is-active');
})

viewFilterButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    viewFilterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    if (index === 1) {
      viewFilterContainer.classList.add('show-details');
    } else {
      viewFilterContainer.classList.remove('show-details');
    }
  });
});

timeBtns.forEach((btn) => {
  btn.addEventListener('click',(event) => {
    timeBtns.forEach((btn) => {
      btn.classList.remove('active')
    })
    console.log(event.target)
    event.target.classList.add('active')
  })
})

// async function ladeHistory(){
//   const antwort = await fetch(`${API_URL}/history/${userId}`)

//   const ziele = await antwort.json()
//   console.log(ziele)

//   historyListe.innerHTML = ''

//   if(ziele.length > 5){
//     ziele.splice(5)
//   }

//   ziele.forEach((ziel) => {
//     const liElem = document.createElement('li')
//      const percent = Math.min((ziel.achieved / ziel.goal) * 100, 100)

//      const zielDatum = dayjs(ziel.date).format('YYYY-MM-DD')
   
//     liElem.dataset.id = ziel.id
//     ziel.done = ziel.achieved >= ziel.goal ? true : false
//   liElem.className = ziel.done ? 'done' : ''
//   liElem.innerHTML = `
//   <span class="goal-titel">${ziel.titel}</span>
//   <div class="progress-bar-wrap">
//     <div class="progress-bar-fill" style="width: ${percent}%"></div>
//   </div>
//   <span class="goal-progress"><span>${ziel.achieved}</span> / ${ziel.goal}</span>
  
//   <span class ="date">${zielDatum}<span>
// `
//     historyListe.append(liElem)
//   })
// }

async function ladeHistory(anzahl, art) {
  const antwort = await fetch(`${API_URL}/history/${userId}`);
  const ziele = await antwort.json();
  // if(ziele.length > 20){
  //   ziele.splice(20)
  // }
  console.log(ziele);

  historyListe.innerHTML = '';

  let zeitZiele = []

  const gruppierteZiele = {};

  if(art == 'alle'){
    zeitZiele = ziele
  } else{
    ziele.forEach((ziel) => {
    const dayJsTime = dayjs(ziel.date)
    const grenzdatum = dayjs().subtract(anzahl,art)

    console.log(dayJsTime)
    console.log(grenzdatum)

    if(dayJsTime.isAfter(grenzdatum)){
      zeitZiele.push(ziel)
      console.log(zeitZiele)
    }
  });
  }

  zeitZiele.forEach((ziel) => {
    const datumSchluessel = dayjs(ziel.date).format('dddd, D. MMMM YYYY');

    if (!gruppierteZiele[datumSchluessel]) {
      gruppierteZiele[datumSchluessel] = [];
    }
    gruppierteZiele[datumSchluessel].push(ziel);
  })

  Object.keys(gruppierteZiele).forEach((datum) => {
    const gruppenDiv = document.createElement('div');
    gruppenDiv.className = 'history-date-group';

    const titelElem = document.createElement('h3');
    titelElem.className = 'history-date-title';
    titelElem.innerText = datum;
    gruppenDiv.append(titelElem);

    const ulElem = document.createElement('ul');
    ulElem.className = 'history-cards-list';

    // Cards für diesen Tag erstellen
    // gruppierteZiele[datum].forEach((ziel) => {
    //   const liElem = document.createElement('li');
    //   liElem.dataset.id = ziel.id;

    //   const percent = Math.min((ziel.achieved / ziel.goal) * 100, 100);
    //   const isDone = ziel.achieved >= ziel.goal;

    //   liElem.className = `history-card ${isDone ? 'is-done' : ''}`;

    //   liElem.innerHTML = `
    //     <span class="history-card-title">${ziel.titel}</span>
        
    //     <div class="history-card-right">
    //       <div class="history-progress-wrap">
    //         <div class="history-progress-fill" style="width: ${percent}%"></div>
    //       </div>
    //       <span class="history-progress-text">
    //         <span class="history-achieved">${ziel.achieved}</span> / <span class="history-goal">${ziel.goal}</span>
    //       </span>
    //     </div>
    //   `;
    //   ulElem.append(liElem);
    // });

    // Für jedes Ziel in der Gruppe:
gruppierteZiele[datum].forEach((ziel) => {
  const liElem = document.createElement('li');
  const percent = Math.min((ziel.achieved / ziel.goal) * 100, 100);

 
  let statusKlasse = 'status-empty'; 
  if (ziel.achieved >= ziel.goal) {
    statusKlasse = 'status-done';     
  } else if (ziel.achieved > 0) {
    statusKlasse = 'status-progress'; 
  }

 
  liElem.className = `history-card ${statusKlasse}`;

  liElem.innerHTML = `
    <span class="history-card-title">${ziel.titel}</span>
    
    <div class="history-card-right">
      <div class="history-progress-wrap">
        <div class="history-progress-fill" style="width: ${percent}%"></div>
      </div>
      <span class="history-progress-text">
        <span class="history-achieved">${ziel.achieved}</span> / <span class="history-goal">${ziel.goal}</span>
      </span>
    </div>
  `;
  
  ulElem.append(liElem);
});

    gruppenDiv.append(ulElem);
    historyListe.append(gruppenDiv);
  });
}

detailsBtn.addEventListener('click',async () => {
  console.log('Button clicked')
  heatMapContainer.classList.add('hidden')
  detailContainer.classList.remove('hidden')
  ladeHistory(0, 'alle')
  timeFilter.classList.remove('hidden')
}) 

übersichtBtn.addEventListener('click',async () => {
  heatMapContainer.classList.remove('hidden')
  detailContainer.classList.add('hidden')
  timeFilter.classList.add('hidden')

  const antwort = await fetch(`${API_URL}/history/${userId}`);
  const ziele = await antwort.json();
  rendereHeatmap(ziele)
}) 

allFilter.addEventListener('click', () => {
  ladeHistory(0, 'alle')
})

weekFilter.addEventListener('click', () => {
  ladeHistory(7, 'day')
})

monthFilter.addEventListener('click', () => {
  ladeHistory(1, 'month')
})

threeMonthFilter.addEventListener('click', () => {
  ladeHistory(3, 'month')
})

function rendereHeatmap(ziele, anzahlMonate = 4) {
  const container = document.getElementById('heatmap-months-container');
  if (!container) return;

  container.innerHTML = '';

  // 1. Erreichte Ziele pro Tag zählen
  const erfolgeProTag = {};
  ziele.forEach((ziel) => {
    if (ziel.achieved >= ziel.goal) {
      const tagKey = dayjs(ziel.date).format('YYYY-MM-DD');
      erfolgeProTag[tagKey] = (erfolgeProTag[tagKey] || 0) + 1;
    }
  });

  const heute = dayjs();

  // 2. Für die letzten X Monate jeweils einen Block erstellen
  for (let m = anzahlMonate - 1; m >= 0; m--) {
    const monatDatum = heute.subtract(m, 'month');
    const monatsName = monatDatum.format('MMM'); // z. B. "Jan", "Feb"

    const monatBlock = document.createElement('div');
    monatBlock.className = 'heatmap-month-block';

    const titel = document.createElement('div');
    titel.className = 'heatmap-month-title';
    titel.innerText = monatsName;
    monatBlock.appendChild(titel);

    const grid = document.createElement('div');
    grid.className = 'heatmap-month-grid';

    // Tage des Monats berechnen
    const tageImMonat = monatDatum.daysInMonth();
    const ersterTagDesMonats = monatDatum.startOf('month');

    // Offset für Wochentag des 1. des Monats (0 = Mo, 6 = So)
    let startWochentag = ersterTagDesMonats.day() - 1;
    if (startWochentag === -1) startWochentag = 6; // Sonntag auf 6 anpassen

    // Leere Felder auffüllen, falls der Monat nicht am Montag beginnt
    for (let e = 0; e < startWochentag; e++) {
      const emptyBox = document.createElement('div');
      emptyBox.style.visibility = 'hidden';
      grid.appendChild(emptyBox);
    }

    // Für jeden Tag im Monat ein Quadrat bauen
    for (let d = 1; d <= tageImMonat; d++) {
      const tagDatum = ersterTagDesMonats.date(d);
      const tagKey = tagDatum.format('YYYY-MM-DD');
      const anzahl = erfolgeProTag[tagKey] || 0;

      const box = document.createElement('div');
      box.className = 'heatmap-box';

      // Stufe berechnen (0 - 4)
      let level = 0;
      if (anzahl === 1) level = 1;
      else if (anzahl === 2) level = 2;
      else if (anzahl === 3) level = 3;
      else if (anzahl >= 4) level = 4;

      box.classList.add(`level-${level}`);
      box.title = `${tagDatum.format('DD.MM.YYYY')}: ${anzahl} Ziel(e) erreicht`;

      grid.appendChild(box);
    }

    monatBlock.appendChild(grid);
    container.appendChild(monatBlock);
  }
}


ladeZiele()