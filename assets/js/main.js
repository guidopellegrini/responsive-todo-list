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

  //Transformamos la fecha a formato corto
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
  //Este evento nos permitira marcar la tarea como completada y viceversa
  const currentLastItem = list.querySelector(".list__item:last-child");

  currentLastItem.querySelector(".action-icon").addEventListener("click", (event) => {
    const clickedItem = event.currentTarget.parentElement;
    const icon = event.currentTarget;
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const index = Array.from(clickedItem.parentElement.children).indexOf(clickedItem);

    const listitem = clickedItem.parentElement.children[index];

    if (clickedItem.classList.contains("completed")) {
      icon.innerHTML = `<i class="ri-close-circle-fill"></i>`;
      clickedItem.classList.remove("completed");

      //Eliminamos el icono de eliminar
      listitem.removeChild(listitem.firstChild);
    } else {
      icon.innerHTML = `<i class="ri-checkbox-circle-fill"></i>`;
      clickedItem.classList.add("completed");

      //agregamos icono de eliminar
      const trashIcon = `<div class="action-icon delete-list-button"><i class="ri-delete-bin-line"></i></div>`;
      listitem.insertAdjacentHTML("afterbegin", trashIcon);

      //agrergamos evento al icono de eliminar para eliminar la tarea
      const deleteIcon = listitem.querySelector(".delete-list-button");

      deleteIcon.addEventListener("click", () => {
        //agregamos animation "fade-out 300ms ease forwards" al listitem
        listitem.style.animation = "fade-out 300ms ease forwards";

        setTimeout(() => {
          // Eliminamos la tarea del localStorage
          let listItems = Array.from(list.children);
          let tasks = JSON.parse(localStorage.getItem("tasks"));
          const index = listItems.indexOf(event.target);
          tasks.splice(index, 1);
          localStorage.setItem("tasks", JSON.stringify(tasks));

          // Eliminamos el elemento del DOM
          listitem.remove();
        }, 300);
      });
    }

    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  // Si la tarea está completada, agregamos el icono de eliminar
  if (task.completed) {
    const trashIcon = `<div class="action-icon delete-list-button"><i class="ri-delete-bin-line"></i></div>`;
    currentLastItem.insertAdjacentHTML("afterbegin", trashIcon);

    //agrergamos evento al icono de eliminar para eliminar la tarea
    const deleteIcon = currentLastItem.querySelector(".delete-list-button");

    deleteIcon.addEventListener("click", () => {
      //agregamos animation "fade-out 300ms ease forwards" al listitem
      currentLastItem.style.animation = "fade-out 300ms ease forwards";

      setTimeout(() => {
        // Eliminamos la tarea del localStorage
        let listItems = Array.from(list.children);
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        const index = listItems.indexOf(currentLastItem);
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Eliminamos el elemento del DOM
        currentLastItem.remove();
      }, 300);
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

  let task = {
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

// Volvemos a la pantalla principal sin agregar la tarea
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

// Iteramos sobre todos los elementos de la lista y los animamos uno por uno con un fade-out de 200ms y un delay de 200ms entre cada uno
const clearAllTasks = () => {
  const listItems = Array.from(list.children);

  listItems.forEach((listItem, index) => {
    let delay = 200 * index;
    listItem.style.animation = `fade-out 200ms ease forwards ${delay}ms`;

    setTimeout(() => {
      listItem.remove();
    }, delay + 200);
  });

  localStorage.clear();
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

//validamos que la hora final no sea menor a la inicial
const validateHours = () => {
  const startHour = document.getElementById("startHour");
  const endHour = document.getElementById("endHour");

  if (startHour.value > endHour.value) {
    if (endHour.value !== "") {
      alert("La hora final no puede ser menor a la inicial");
    }

    endHour.value = "";
  }
};

startHour.addEventListener("change", validateHours);
endHour.addEventListener("change", validateHours);

/* =============== VALIDATE DATE =============== */

//validamos que la fecha no sea menor a la actual
const validateDate = () => {
  const date = document.getElementById("date");

  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth() + 1;
  const day = todayDate.getDate();

  const today = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

  if (date.value < today) {
    alert("La fecha no puede ser menor a la actual");
    date.value = today;
  }
};

date.addEventListener("change", validateDate);
