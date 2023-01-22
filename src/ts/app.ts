/* QUERYSELECTORS */

const googlebutton = document.querySelector(".google-logo") as HTMLElement;
const githubButton = document.querySelector(".github-logo") as HTMLElement;
const loginForm: any = document.querySelector(".loginForm") as HTMLElement;
const registerFrom: any = document.querySelector(".registerForm");
const loginToregisterButton = document.querySelector(
  ".login-page-register-button"
) as HTMLElement;
export const registerPage = document.querySelector(
  ".register-page"
) as HTMLElement;
const registerTologinButton = document.querySelector(
  ".register-page-login-button"
) as HTMLElement;
const loginPage = document.querySelector(".login") as HTMLElement;

const registerButton = document.querySelector(
  ".register-button"
) as HTMLElement;
export const loggedInOverview = document.querySelector(
  ".loggedIn"
) as HTMLElement;
const divWrongEmailOrPass = document.querySelector(
  ".divWrongEmailOrPass"
) as HTMLElement;
const logOutButton = document.querySelector(".logout") as HTMLElement;
export const detailproject = document.querySelector(
  ".detailProjects"
) as HTMLElement;
const divAllProjects = document.querySelector(".projects") as HTMLElement;
const fromAddNewProject: any = document.querySelector(".addProject");
const detailPage = document.querySelector(".showDetailOfcard");
const detailPageLogout = document.querySelector(".logoutDetail");
const nameOnDetailPage = document.querySelector(".nameDetailPage");
const formAddNewCard: any = document.querySelector(".addCard");
const divAllCards: any = document.querySelector(".allCards");
const backToProjects: any = document.querySelector(".backToprojects");
;
/* FIREBASE*/

import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  deleteDoc,
  collection,
  addDoc,
  setDoc,
  where,
  query,
  DocumentData,
  onSnapshot,
  serverTimestamp,
  orderBy,
  limit,
  getDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";

// firebase config object (frontendobject) -> to connect to frontend to backend
const firebaseConfig = {
  apiKey: "AIzaSyB-wSWTKbXEU1iuR_2sR4elQJfcoZn_RJs",
  authDomain: "studanner.firebaseapp.com",
  projectId: "studanner",
  storageBucket: "studanner.appspot.com",
  messagingSenderId: "741229277735",
  appId: "1:741229277735:web:6b8fdcab542d46e1fb1402",
};

// tell function what project to use
// Initialize Firebase

export const fireStoreApp = initializeApp(firebaseConfig);

// init services
const auth = getAuth();
const db = getFirestore();

// collection ref
const colRefProjects = collection(db, "projects");
const colrefCards = collection(db, "cards");
const colrefTodo = collection(db, "todo");
/* FUNCTION TO NAVIGATE BETWEEN PAGES */
const pages = [registerPage, loginPage, loggedInOverview, detailPage];

const changeScreen = (destinationScreen: any) => {
  destinationScreen.classList.remove("hidden");

  pages.map((page) => {
    if (page !== destinationScreen) {
      page.classList.add("hidden");
    }
  });
};

function Changescreens() {
  loginToregisterButton.addEventListener("click", async function () {
    changeScreen(registerPage);
  });
  registerTologinButton.addEventListener("click", async function () {
    changeScreen(loginPage);
  });

  registerButton.addEventListener("click", async function () {
    changeScreen(loggedInOverview);
  });
  // pas aan
  githubButton.addEventListener("click", async function () {
    changeScreen(loggedInOverview);
  });
  backToProjects.addEventListener("click", async function () {
    changeScreen(loggedInOverview);
  });
}

Changescreens();

/* 1) AUTHENTICATIE & REGISTRATIE  */

// register user
registerFrom?.addEventListener("submit", (e: any) => {
  // console.log("test");
  // console.log(registerFrom);
  e.preventDefault();

  const email = registerFrom.email.value;
  const password = registerFrom.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created:", cred.user);
      registerFrom.reset();
    })
    .catch((err) => {
      console.log(err.message);
      let showErrorEmailAlreadyInUse = document.createElement("p");
      showErrorEmailAlreadyInUse.classList.add("error-messages");
      showErrorEmailAlreadyInUse.innerHTML = `<p> Sorry, this email is already in use</p>`;
      const divErrorMessage = document.querySelector(".error-message");
      divErrorMessage.appendChild(showErrorEmailAlreadyInUse);
    });
});

// logging in and out with email
loginForm.addEventListener("submit", (e: any) => {
  e.preventDefault();

  const email: string = loginForm.email.value;
  const password: string = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user logged in:", cred.user);
      // loginForm.reset();
      changeScreen(loggedInOverview);
      loginForm.reset();
      const { user } = cred;

      localStorage.setItem("user_Uid", user.uid);
      const userUid = localStorage.getItem("user_Uid");
      console.log(userUid);
    })
    .catch((err) => {
      console.log(err.message);
      let wrongEmailOrPass = document.createElement("p");
      wrongEmailOrPass.classList.add("wrong-email-or-pass");
      wrongEmailOrPass.innerHTML = `<p> Wrong email or password</p>`;
      divWrongEmailOrPass.appendChild(wrongEmailOrPass);
      loginForm.reset();
    });
});

// logging out
logOutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("user signed out");
      changeScreen(loginPage);
      loggedInOverview.classList.add("hidden");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

detailPageLogout.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("user signed out");
      window.location.reload();
      loggedInOverview.classList.add("hidden");
    })
    .catch((err) => {
      console.log(err.message);
    });
});
//signing up with google
let loginWithGoogle = () => {
  let provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      console.log("you are logged in with google");
      changeScreen(loggedInOverview);
    })
    .catch((err) => {
      console.log(err.message);
      console.log("try again");
    });
};
googlebutton.addEventListener("click", loginWithGoogle);

//signing up with github
let loginWithGithub = () => {
  let githubProvider = new GithubAuthProvider();
  signInWithPopup(auth, githubProvider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);

      const token = credential.accessToken;
      console.log(token);

      // The signed-in user info.
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      console.log(errorCode);
      const errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      const email = error.customData.email;
      console.log(email);
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      console.log(credential);
    });
};
githubButton.addEventListener("click", loginWithGithub);

// get the currently signed-in user

/* AGENDA (Een overview van alle projecten) + toevoegen van nieuwe projecten*/
onSnapshot(colRefProjects, (snapchot) => {
  let projects: any = [];

  snapchot.docs.forEach((doc) => {
    projects.push({ ...doc.data(), id: doc.id });
    divAllProjects.innerHTML = "";

    // Get a projects info
    projects.forEach((doc: any) => {
      const projectName = doc?.project_name;
      const projectId = doc?.id;
      localStorage.setItem("project_id", projectId);
      const uidUser = localStorage.getItem("user_Uid");

      // Show the projects to the viewer

      let newProject = document.createElement("p");
      newProject.classList.add("newProject");
      newProject.innerHTML = `Project: ${projectName}`;
      divAllProjects.appendChild(newProject);

      // navigate to detail page
      newProject.addEventListener("click", async function () {
        changeScreen(detailPage);
        console.log(projectId);
        console.log(projectName);
        /* PROJECTEN (De details van 1 project) + toevoegen van subtaken, ...*/

        let detailName = document.createElement("h3");
        detailName.classList.add("detail-projects");
        detailName.innerHTML = `${projectName}`;
        nameOnDetailPage.appendChild(detailName);

        // Add a new card
        formAddNewCard.addEventListener("submit", (e) => {
          e.preventDefault();

          addDoc(colrefCards, {
            card_name: formAddNewCard.card_name.value,
            card_uid: localStorage.getItem("user_Uid"),
            project_id: projectId,
          }).then(formAddNewCard.reset());
        });
        onSnapshot(colrefCards, (snapchot) => {
          let cards: any = [];
          snapchot.docs.forEach((doc) => {
            cards.push({ ...doc.data(), id: doc.id });
            divAllCards.innerHTML = "";

            // get card info
            cards.forEach((doc: any) => {
              const cardName = doc?.card_name;
              const cardprojectId = doc?.project_id;
              const cardId = doc?.id;
              const cardUid = localStorage.getItem("user_Uid");

              // show the cards to the user
              if (projectId == cardprojectId) {
                let newCard = document.createElement("p");
                newCard.classList.add("newCard");
                newCard.innerHTML = `${cardName} <form class="addToDo">
              <label for="todo_name"></label>
              <input type="text" class="comment" name="todo_name"/>
              <button class="btn-save-todo">Add New todo</button>
            </form><div class="allToDo"> </div>`;
                divAllCards.appendChild(newCard);
                const fromAddTodo: any = document.querySelector(".addToDo");
                console.log(fromAddTodo);
                const divAllTodo: any = document.querySelector(".allToDo")
                fromAddTodo.addEventListener("submit", (e) => {
                  e.preventDefault();

                  addDoc(colrefTodo, {
                    todo_name: fromAddTodo.todo_name.value,
                    todo_user_Uid: localStorage.getItem("user_Uid"),
                    todo_card_id: cardId,
                  }).then(fromAddTodo.reset());
                });
                onSnapshot(colrefTodo, (snapchot) => {
                  let todo: any = [];
                  snapchot.docs.forEach((doc) => {
                    todo.push({ ...doc.data(), id: doc.id });
                   // console.log(todo);
                   // divAllTodo.innerHTML = "";

                    // get todo info
                    todo.forEach((doc: any) => {
                      const todoName = doc?.todo_name;
                      console.log(todoName)
                      localStorage.setItem("todoname", todoName);
                      const todo_card_id = doc?.todo_card_id;
                      const todo_id = doc?.id;
                      const todoUid = localStorage.getItem("user_Uid");

                      // show todo to user
                      
                      let newTodo = document.createElement("p");
                      newTodo.classList.add("newTodo");
                      newTodo.innerHTML = `${todoName}`;
                      divAllTodo.appendChild(newTodo);
                    });
                  });
                });
              } else {
                console.log("niet dezelfde");
              }

              const todoname = localStorage.getItem("todoname");
            });
          });
        });
      });
    });
  });

  console.log(projects);
});

// Add a new project
fromAddNewProject.addEventListener("submit", (e) => {
  e.preventDefault(); // omdat de default betekend dat de pagina herlaad, dat willen we voorkomen

  addDoc(colRefProjects, {
    project_name: fromAddNewProject.project_name.value,
    uid_admin: localStorage.getItem("user_Uid"),
  }).then(fromAddNewProject.reset());
});

// Delete an existing project
