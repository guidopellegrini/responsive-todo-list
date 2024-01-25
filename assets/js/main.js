import { initialTasks } from "./tasks.js";

// Para fixear la diferencia de altura de pantalla en mobile
// cuando se abre/cierra el menu del navegador (en iOS/Android)
const appHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};
window.addEventListener("resize", appHeight);

appHeight();

// ---------------------------------------------
// ------------------ App ----------------------
// ---------------------------------------------

/*=============== DOM ===============*/

const wrapper = document.getElementById("wrapper");
const list = document.getElementById("list");

const addButton = document.getElementById("add-button");
const confirmButton = document.getElementById("confirm-btn");
const backButton = document.getElementById("back-btn");
const clearTasksButton = document.getElementById("clear-tasks-button");

const dayNameFirstElement = document.getElementById("day-name-first");
const dayNameSecondElement = document.getElementById("day-name-second");
const dayNumberFirstElement = document.getElementById("day-month-first");
const dayNumberSecondElement = document.getElementById("day-month-second");

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

/*=============== FLIP CARD ===============*/

addButton.addEventListener("click", () => {
  //Recuperamos la fecha actual y la seteamos en el input
  configDate();

  wrapper.classList.toggle("is-flipped");
});

/*=============== TASKS ===============*/

const createTask = (task) => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  //Transformo la fecha a formato corto
  let date = new Date(task.date);
  let day = date.getDate();
  let month = date.toLocaleString("default", { month: "short" }).toUpperCase();
  let newDate = `${day} ${month}`;

  const li = `
    <li class="list__item ${task.completed ? "completed" : ""}">
    <div class="item-date">${newDate}</div>
    <div class="details">
      <div class="description">${task.message}</div>
      <div class="hour"><span>${task.startHour} - ${task.endHour}</span></div>
    </div>
    <div class="action-icon">
      <i class="${task.completed ? "ri-checkbox-circle-fill" : "ri-close-circle-fill"}"></i>
    </div>
    </li>
  `;

  tasks.push(task);
  list.insertAdjacentHTML("beforeend", li);

  //Agregamos el evento al último item de la lista (el que acabamos de crear)
  const currentLastItem = list.querySelector(".list__item:last-child");

  if (currentLastItem) {
    currentLastItem.querySelector(".action-icon").addEventListener("click", (event) => {
      const clickedItem = event.currentTarget.parentElement;
      const icon = event.currentTarget;
      const tasks = JSON.parse(localStorage.getItem("tasks"));
      const index = Array.from(clickedItem.parentElement.children).indexOf(clickedItem);

      if (clickedItem.classList.contains("completed")) {
        icon.innerHTML = `<i class="ri-close-circle-fill"></i>`;
        clickedItem.classList.remove("completed");
      } else {
        icon.innerHTML = `<i class="ri-checkbox-circle-fill"></i>`;
        clickedItem.classList.add("completed");
      }

      tasks[index].completed = !tasks[index].completed;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });
  }
};

/*=============== RENDER TASKS ===============*/

const renderTasks = () => {
  //Obtenemos las tareas del localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks"));

  //Si no hay tareas en el localStorage, las creamos con el array de tareas inicial
  if (tasks === null || tasks === undefined || tasks.length === 0) {
    localStorage.setItem("tasks", JSON.stringify(initialTasks));
  }

  tasks = JSON.parse(localStorage.getItem("tasks"));

  //Recorremos las tareas y las mostramos en el DOM
  Object.values(tasks).forEach((task) => {
    createTask(task);
  });
};

renderTasks();

/*=============== DATE ===============*/

const daysOfTheWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thurday",
  5: "Friday",
  6: "Saturday",
};

const createDay = (day) => {
  const dayName = daysOfTheWeek[day.getDay()];
  const dayNumber = day.getDate();
  const month = day.toLocaleString("default", { month: "short" });

  let dayNameFirst;
  let dayNameSecond;

  dayNameFirst = dayName.slice(0, -3);
  dayNameSecond = "DAY";

  dayNameFirstElement.textContent = dayNameFirst.toUpperCase();
  dayNameSecondElement.textContent = dayNameSecond;
  dayNumberFirstElement.textContent = dayNumber;
  dayNumberSecondElement.textContent = month.toUpperCase();
};

const today = new Date();

createDay(today);

/*=============== CONFIRM & BACK ===============*/

confirmButton.addEventListener("click", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const message = document.getElementById("message").value;
  const date = document.getElementById("date").value;
  const startHour = document.getElementById("startHour").value;
  const endHour = document.getElementById("endHour").value;

  //Validamos que los campos no estén vacíos
  if (message === "" || date === "" || startHour === "" || endHour === "") {
    return;
  }

  task = {
    date: date,
    message: message,
    completed: false,
    startHour: startHour,
    endHour: endHour,
  };

  createTask(task);

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  clearInputs();
  wrapper.classList.toggle("is-flipped");
});

backButton.addEventListener("click", () => {
  clearInputs();
  wrapper.classList.toggle("is-flipped");
});

/* =============== CLEAR INPUTS =============== */

const clearInputs = () => {
  //Esperamos para que no desaparezca mientras se hace la animación
  setTimeout(() => {
    const message = document.getElementById("message");
    const date = document.getElementById("date");
    const startHour = document.getElementById("startHour");
    const endHour = document.getElementById("endHour");

    message.value = "";
    date.value = "";
    startHour.value = "";
    endHour.value = "";
  }, 500);
};

/* =============== CLEAR ALL TASKS =============== */

const clearAllTasks = () => {
  localStorage.clear();
  list.innerHTML = "";
};

clearTasksButton.addEventListener("click", () => {
  clearAllTasks();
});

/* =============== SET DEFAULT DATE =============== */

const configDate = () => {
  const dateElement = document.getElementById("date");

  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth() + 1;
  const day = todayDate.getDate();

  dateElement.value = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
};

/* =============== VALIDATE HOURS =============== */

//que la hora final no sea menor a la inicial
const validateHours = () => {
  const startHour = document.getElementById("startHour");
  const endHour = document.getElementById("endHour");

  if (startHour.value > endHour.value) {
    endHour.value = "";
  }
};

startHour.addEventListener("change", validateHours);
endHour.addEventListener("change", validateHours);

/* =============== VALIDATE DATE =============== */

//que la fecha no sea menor a la actual
const validateDate = () => {
  const date = document.getElementById("date");

  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth() + 1;
  const day = todayDate.getDate();

  const today = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

  if (date.value < today) {
    date.value = today;
  }
};

date.addEventListener("change", validateDate);
