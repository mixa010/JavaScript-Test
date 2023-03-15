const employeeList = document.getElementById("employee-list");
const addEmployeeButton = document.getElementById("add-employee-button");
const addEmployeeForm = document.getElementById("add-employee-form");

function createEmployeeCard(employee, types) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = employee.id;

  let idType = "";
  if (types && types.length > 0) {
    idType = types.find((type) => type.id === employee.id_type)?.name || "";
  }

  card.innerHTML = `
    <img class="card-img-top" src="${employee.picture}" alt="${employee.name} ${employee.last_name}">
    <div class="card-body">
      <h5 class="card-title">${employee.name} ${employee.last_name}</h5>
      <p class="card-text">Date of Birth: ${employee.date_of_birth}</p>
      <p class="card-text">Profession: ${idType}</p>
      <p id="id-text" class="card-text">ID: ${employee.id}      <button class="remove-button" onclick="removeCard(this)">X</button>
      </p>
    </div>
  `;

  return card;
}

function removeCard(button) {
  const card = button.closest(".card");
  const employeeId = card.dataset.id;

  fetch(`http://localhost:3000/employees/${employeeId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        card.classList.add("fade-out");

        setTimeout(() => {
          card.remove();
        }, 300);
      } else {
        console.error("Failed to remove employee from server.");
      }
    })
    .catch((error) => {
      console.error("Failed to remove employee from server.", error);
    });
}

function displayEmployees() {
  Promise.all([
    fetch("http://localhost:3000/employees"),
    fetch("http://localhost:3000/types"),
  ])
    .then(([employeesResponse, typesResponse]) =>
      Promise.all([employeesResponse.json(), typesResponse.json()])
    )
    .then(([employees, types]) => {
      employeeList.innerHTML = "";
      employees.forEach((employee) => {
        const card = createEmployeeCard(employee, types);
        employeeList.appendChild(card);
      });
    })
    .catch((error) => console.error(error));
}

const closeButton = document.getElementById("close-button");

closeButton.addEventListener("click", function () {
  addEmployeeForm.style.display = "none";
});

addEmployeeButton.addEventListener("click", () => {
  addEmployeeForm.style.display = "block";
});

addEmployeeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = event.target.name.value;
  const lastName = event.target.last_name.value;
  const dateOfBirth = event.target.date_of_birth.value;
  const idType = event.target.id_type.value;
  const picture = event.target.picture_url.value;

  const response = await fetch("http://localhost:3000/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      id_type: parseInt(idType),
      picture,
    }),
  });

  const newEmployee = await response.json();

  const newEmployeeCard = createEmployeeCard(newEmployee);

  employeeList.appendChild(newEmployeeCard);

  displayEmployees();

  addEmployeeForm.style.display = "none";
});

displayEmployees();
