import eventsData from "./eventsData.js";

const calendar = document.querySelector("#calendar");
const calendarHeaderData = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
const calendarDateArr = [29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1]
let selectedDt = null;
let selectedDateText = '';
let calendarData = "";

// modal
const modalContainer = document.querySelector('.modal-container');
const close = document.querySelector('.close-modal');

const openModal = (eventID) => {
    document.querySelector('body').style.overflow = 'hidden';
    modalContainer.querySelector('.modal').classList.remove("no-animation");
    modalContainer.querySelector('.modal-title').textContent = `Attend The ${eventsData.find(ev => ev.id == eventID).name}`;
    modalContainer.classList.add('active-modal');
}

const closeModal = () => {
    modalContainer.classList.remove('active-modal');
    document.querySelector('body').style.overflow = 'initial';
}
close.addEventListener('click', closeModal);

modalContainer.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const registerName = modalContainer.querySelector("form #name").value;
    alert(`You've successfully Registered, See you there ${registerName}.`);
    closeModal();
});
// modal end

calendarHeaderData.forEach((header) => {
    calendarData += `<li>${header}</li>`;
});

for (let i = 0; i < 35; i++) {
    calendarData += `<li ${(i < 3 || calendarDateArr[i] < 10) ? "class='old-date'" : "class='new-date'"} data-dt="${calendarDateArr[i]}">
                        ${calendarDateArr[i]}
                    </li>`;
};
calendar.insertAdjacentHTML("beforeend", calendarData);
calendar.querySelector("[data-dt='10']").classList.add('selected');

eventsData.forEach((ev) => {
    const dt = new Date(ev.date);
    const day = dt.getDate();
    const eventDayElement = [...document.querySelectorAll(".new-date")].find(el => el.dataset.dt == day);
    eventDayElement.classList.add("event-day");
});

calendar.querySelectorAll(".new-date").forEach(day => {
    day.addEventListener("click", e => {
        const currentSelectedDateElement = e.target;
        selectedDt = currentSelectedDateElement.innerText;
        const selectedDate = document.querySelector(".new-date.selected");
        selectedDate.classList.remove("selected");
        currentSelectedDateElement.classList.add("selected");

        selectedDateText = "";
        switch (selectedDt) {
            case "21":
            case "31":
                selectedDateText = selectedDt + "st";
                break;

            case "22":
                selectedDateText = selectedDt + "nd";
                break;

            case "23":
                selectedDateText = selectedDt + "rd";
                break;

            default:
                selectedDateText = selectedDt + "th";
                break;
        }
        document.querySelector(".events-per-date-container>p").innerHTML = selectedDateText;

        const eventsList = document.querySelector("#events-list");
        const noEventsText = '<span id="no-events-text">No Events</span>'
        const selectedEventsData = eventsData.filter(ev => new Date(ev.date).getDate() == selectedDt);

        if (selectedEventsData.length > 0) {
            eventsList.innerHTML = '';
            selectedEventsData.forEach(ev => {
                eventsList.innerHTML += `
                        <li id="${ev.id}">
                            <div id="event-card-img-container">
                                <img src="./images/${ev.imgSrc}" alt="${ev.name}">
                            </div>
                            <div id="event-card-details-container">
                                <h6>${ev.name}</h6>
                                <ul>
                                ${ev.tags.reduce((list, tag) => list += `<li>${tag}</li>`, '')
                    }
                                </ul>
                            </div>
                        </li>
                `;
            });

            eventsList.querySelectorAll("li").forEach(li => {
                li.addEventListener("click", (e) => {
                    const selectedEventID = e.currentTarget.id;
                    const event = eventsData.find(ev => ev.id == selectedEventID);
                    document.querySelector("#event-details-container")?.remove();

                    const eventDetailsHTML = `
                        <div id="event-details-container">
                            <div id="event-detail-image" style="background-image: url(./images/${event.imgSrc});">
                            </div>
                            <div id="event-header-container">
                                <h2>${event.name}</h2>
                                <h6>Aug ${selectedDateText}</h6>
                            </div>
                            
                            <ul>
                                ${event.tags.reduce((list, tag) => list += `<li>${tag}</li>`, '')}
                            </ul>
                            <p id="event-detail-desc">${event.description}</p>
                            <a class="button" id=${event.id}>Register Now</a>
                        </div>
                    `;

                    document.querySelector("main>section").insertAdjacentHTML("beforeend", eventDetailsHTML)
                    document.getElementById('event-details-container').scrollIntoView();

                    document.querySelector("#event-details-container a").addEventListener("click", (e) => {
                        openModal(e.target.id);
                    });
                });
            });

        } else {
            eventsList.innerHTML = noEventsText
        }
    });
});