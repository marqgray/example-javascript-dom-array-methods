class Person {
  data: PersonJson;
  money: number = Math.floor(Math.random() * 1000000);

  constructor(data: PersonJson) {
    this.data = data;
  }

  get name() {
    return this.data.name;
  }

  static async getRandomPerson(): Promise<Person> {
    const res = await fetch("https://randomuser.me/api");
    const json: RandomUserMeResJson = await res.json();
    return new Person(json.results[0]);
  }
}

const app = new (class {
  main = document.getElementById("main");
  buttons = {
    buttonAddUser: <HTMLButtonElement>document.getElementById("add-user"),
    buttonDouble: <HTMLButtonElement>document.getElementById("double"),
    buttonShowMillionaires: <HTMLButtonElement>(
      document.getElementById("show-millionaires")
    ),
    buttonSort: <HTMLButtonElement>document.getElementById("sort"),
    buttonCalculateWealth: <HTMLButtonElement>(
      document.getElementById("calculate-wealth")
    ),
  };
  people: Person[] = [];

  addPerson(person: Person): void {
    this.people.push(person);
  }

  updateDOM(providedData = app.people): void {
    this.main.innerHTML = "<h2><strong>Person</strong> Wealth</h2>";
    providedData.forEach((person) => {
      const element = document.createElement("div");
      element.classList.add("person");
      element.innerHTML = `<strong>${person.name.first} ${
        person.name.last
      }</strong> ${this.formatMoney(person.money)}`;
      this.main.appendChild(element);
    });
  }

  formatMoney(number: number): string {
    return "$" + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
})();

const addRandomUser = () => {
  Person.getRandomPerson()
    .then((person) => app.addPerson(person))
    .then(() => {
      app.updateDOM();
    });
};

const doubleMoney = () => {
  app.people = app.people.map((person) => {
    let p = new Person({ ...person.data });
    p.money = person.money * 2;
    return p;
  });
  app.updateDOM();
};

const sortByRichest = () => {
  app.people.sort((a, b) => b.money - a.money);
  app.updateDOM();
};

const showMillionaires = () => {
  app.people = app.people.filter((person) => person.money >= 1000000);
  app.updateDOM();
};

const calculateWealth = () => {
  const wealth: number = app.people.reduce((a, b) => {
    const c = new Person({ ...a.data });
    c.money = a.money + b.money;
    return c;
  }).money;

  const wealthElement = document.createElement("div");
  wealthElement.innerHTML = `<h3>Total Wealth: <strong>${app.formatMoney(
    wealth
  )}</strong></h3>`;
  app.main.appendChild(wealthElement);
};

for (let i = 0; i < 3; i++) {
  addRandomUser();
}

app.buttons.buttonAddUser.addEventListener("click", addRandomUser);
app.buttons.buttonDouble.addEventListener("click", doubleMoney);
app.buttons.buttonSort.addEventListener("click", sortByRichest);
app.buttons.buttonShowMillionaires.addEventListener("click", showMillionaires);
app.buttons.buttonCalculateWealth.addEventListener("click", calculateWealth);
