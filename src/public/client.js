let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),

    apod: "",
    rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
});

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
    const storeMap = store.merge(newState);

    render(root, storeMap);
};

const render = async (root, state, target) => {
    root.innerHTML = App(state, target);
};

// create content
const App = (state, target) => {
    return `
   
   <header>
   ${Greeting(state.get("user").get("name"))}
   <header>

        <main>
        
            <section>
                ${ImageOfTheDay(state.get("apod"), target, state)}
            </section>
        </main>
        <footer></footer>
        
    `;
};

const navItems = document.querySelectorAll("li");
const nav = document.querySelector("nav");
//create the dashbord(navBar)
function generetNavBar(state) {
    navItems.forEach((curr, i) => {
        curr.innerHTML = state.get("rovers").get(i);
        curr.classList.add(state.get("rovers").get(i));
    });
}
generetNavBar(store);
// listening for action  click event, so if the user choice and  click  rover button  the appliciton well start worikng
//listening for actions in navbar tiems

nav.addEventListener("click", (e) => {
    if (e.target.id === "item") {
        //if  what was clicked by the user is the navBar item, then start the action of the application

        root.innerHTML = "<h1>Loading...</h1>";
        const target = e.target.classList[0];

        render(root, store, target);
    }
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `;
    }

    return `
        <h1>Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod, target, state) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date();
    const photodate = new Date(apod.date);
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getDataOfAPI(store, target);
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
    } else {
        return `
        ${createCard(state)}
        `;
    }
};

// ------------------------------------------------------  API CALLS
const getDataOfAPI = (state, target) => {
    fetch(`http://localhost:3000/rovers/${target}`)
        .then((res) => res.json())
        .then((apod) => updateStore(state, { apod }));
};

//function for create card that has img and data about rover that user choised
function createCard(store) {
    let template = "";

    const ARRAY_API = store.get("apod").latest_photos.map((curr) => curr);
    ARRAY_API.forEach((curr) => {
        template += `<h1>${curr.rover.name}<h1>
       
        <div id=container>
        
       <img src="${curr.img_src}"/>
     
       <div id="details">
       <p>landing_date: ${curr.rover.landing_date}</p>
       <p>landing_date: ${curr.rover.launch_date}</p>
       <p>landing_date:&nbsp&nbsp${curr.rover.status}</p>
       </div>
        
       </div>
       <br><br>
      `;
    });
    return template;
}
