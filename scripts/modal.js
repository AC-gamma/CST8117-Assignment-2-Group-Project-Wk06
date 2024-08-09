import eventsData from "./eventsData.js";

const modalContainer = document.querySelector('.modal-container');
const modalCloseBtns = document.querySelectorAll('.close-modal');
const loginNavBtn = document.querySelector("#login-btn");
const registerNavBtn = document.querySelector("#register-btn");
const extraLoginBtn = document.querySelector("#extra-login-btn");
const extraRegisterBtn = document.querySelector("#extra-register-btn");
const signoutBtn = document.querySelector("#signout-btn");

// localStorage check
const user = localStorage.getItem("userData");
const userData = JSON.parse(user)
if(user && userData?.logged == 1) {
    document.querySelector("#user-logged li").innerHTML = `Hi there, ${userData.name}`

    document.querySelector("#user-not-logged").classList.add("d-none");
    document.querySelector("#user-logged").classList.remove("d-none");
} else {
    document.querySelector("#user-not-logged").classList.remove("d-none");
    document.querySelector("#user-logged").classList.add("d-none");
}
// localStorage check end

const changeUserLoginStatus = (isLogged) => {
    const user = JSON.parse(localStorage.getItem("userData"));
    user.logged = isLogged;
    localStorage.setItem("userData", JSON.stringify(user));
    location.reload();
}

export const openModal = (modalType, eventID = '1') => {
    modalContainer.classList.add('active-modal');
    document.querySelector('body').style.overflow = 'hidden';
    modalContainer.querySelector(`.modal#${modalType}`).classList.remove("no-animation", "disabled");

    if(modalType == "event-register") {
        modalContainer.querySelector('.modal-title').textContent = `Attend The ${eventsData.find(ev => ev.id == eventID).name}`;
    }
}

const closeModal = () => {
    modalContainer.classList.remove('active-modal');
    modalContainer.querySelectorAll(`.modal`).forEach(md => {
        setTimeout(() => {
            md.classList.add("disabled");
        }, 500);
    });
    document.querySelector('body').style.overflow = 'initial';
}
modalCloseBtns.forEach(btn => btn.addEventListener("click", closeModal));

modalContainer.querySelector("form#event-register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const registerName = modalContainer.querySelector("#event-register-name").value;
    alert(`You've successfully Registered, See you there ${registerName}.`);
    closeModal();
});

loginNavBtn.addEventListener("click", (e) => {
    openModal("user-login")
});

registerNavBtn.addEventListener("click", (e) => {
    openModal("user-register")
});

extraLoginBtn.addEventListener("click", () => {
    closeModal();
    setTimeout(() => openModal("user-login"), 500);
});

extraRegisterBtn.addEventListener("click", () => {
    closeModal();
    setTimeout(() => openModal("user-register"), 500);
});

modalContainer.querySelector("form#user-register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pass1 = e.target.pass1.value;
    const pass2 = e.target.pass2.value;

    if(pass2 != pass1) {
        alert("Please make sure that the confirmed password matches the entered password.");
        return;
    };

    const enteredUserData = {};
    for (const [name,value] of new FormData(e.target)) {
        if(name != "pass2") {
            enteredUserData[name] = value;
        }
    }
    enteredUserData["logged"] = 1;

    localStorage.setItem("userData", JSON.stringify(enteredUserData));
    location.reload();
});

modalContainer.querySelector("form#user-login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = localStorage.getItem("userData");
    const userData = JSON.parse(user);

    const enteredUserEmail = e.target.email.value;
    const enteredUserPass = e.target.pass.value;
    
    if(userData) {
        if(userData.email == enteredUserEmail && userData.pass1 == enteredUserPass) {
            changeUserLoginStatus(1);
        } else {
            alert("Invalid email or password!")
        }
    } else {
        alert("Please register first!");
    }
});

signoutBtn.addEventListener("click", (e) => {
    changeUserLoginStatus(0);
});
