class Event {
  constructor(name, date, seats, category) {
    this.name = name;
    this.date = date;
    this.seats = seats;
    this.category = category;
  }
  
  checkAvailability() {
    return this.seats > 0;
  }
}

let allEvents = [
  new Event("Baking Workshop", "2023-11-18", 20, "workshop"),
  new Event("Rock Concert", "2023-11-25", 100, "music"),
  new Event("Art Exhibition", "2023-12-02", 50, "art")
];

function renderEvents(events = allEvents) {
  const container = document.querySelector('#events-container');
  container.innerHTML = '';
  
  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h3>${event.name}</h3>
      <p>Date: ${event.date}</p>
      <p>Seats: ${event.seats}</p>
      <p>Category: ${event.category}</p>
      <button class="register-btn" data-event="${event.name}">Register</button>
    `;
    container.appendChild(card);
  });

  updateEventDropdown();
}

function updateEventDropdown() {
  const select = document.querySelector('#event-select');
  select.innerHTML = '<option value="">Select Event</option>';
  
  allEvents.forEach(event => {
    if (event.checkAvailability()) {
      const option = document.createElement('option');
      option.value = event.name;
      option.textContent = `${event.name} (${event.date})`;
      select.appendChild(option);
    }
  });
}

function registerForEvent(eventName, userName, userEmail) {
  const event = allEvents.find(e => e.name === eventName);
  if (event && event.seats > 0) {
    event.seats--;
    renderEvents();
    return true;
  }
  return false;
}

function filterEventsByCategory(category) {
  if (category === 'all') {
    renderEvents();
  } else {
    const filtered = allEvents.filter(event => event.category === category);
    renderEvents(filtered);
  }
}

function searchEvents(query) {
  const results = allEvents.filter(event => 
    event.name.toLowerCase().includes(query.toLowerCase())
  );
  renderEvents(results);
}

document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  
  document.addEventListener('click', e => {
    if (e.target.classList.contains('register-btn')) {
      const eventName = e.target.dataset.event;
      registerForEvent(eventName);
    }
  });
  
  document.querySelector('#category-filter').addEventListener('change', (e) => {
    filterEventsByCategory(e.target.value);
  });
  
  document.querySelector('#search').addEventListener('input', (e) => {
    searchEvents(e.target.value);
  });
  
  document.querySelector('#registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const eventName = document.querySelector('#event-select').value;
    
    if (registerForEvent(eventName, name, email)) {
      alert(`Successfully registered ${name} for ${eventName}`);
      e.target.reset();
    } else {
      alert("Registration failed. Please try again.");
    }
  });
});

async function fetchEvents() {
  document.querySelector('#loading-spinner').style.display = 'block';
  
  try {
    const response = await fetch('https://mockapi.io/events');
    const data = await response.json();
    allEvents = data.map(e => new Event(e.name, e.date, e.seats, e.category));
    renderEvents();
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    document.querySelector('#loading-spinner').style.display = 'none';
  }
}

window.addEventListener('load', () => {
  console.log("Welcome to the Community Portal");
  fetchEvents();
});