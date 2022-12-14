import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { 
  getFirestore, 
  doc, 
  deleteDoc, 
  collection,
  addDoc,
  setDoc 
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
initializeApp(firebaseConfig);

// init services
const auth = getAuth();

// DOM
const googlebutton = document.querySelector(".google-logo");
const loginForm: any = document.querySelector(".loginForm");
const registerFrom: HTMLFormElement = document.querySelector(".registerForm");
const loginToregisterButton = document.querySelector(
  ".login-page-register-button"
);
const registerPage = document.querySelector(".register-page");
const registerTologinButton = document.querySelector(
  ".register-page-login-button"
);
const loginPage = document.querySelector(".login");


const registerButton = document.querySelector(".register-button");
const loggedInOverview = document.querySelector(".loggedIn");
const divWrongEmailOrPass = document.querySelector(".divWrongEmailOrPass");
const logOutButton = document.querySelector(".logout")

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
      changeScreen(loginPage)
      loggedInOverview.classList.add("hidden")

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
    })
    .catch((err) => {
      console.log(err.message);
      console.log("try again");
    });
};
googlebutton.addEventListener("click", loginWithGoogle);

// put all the pages here
const pages = [registerPage, loginPage];
// function for navigating trough pages
const changeScreen = (destinationScreen: any) => {
  destinationScreen.classList.remove("hidden");

  pages.map((page) => {
    if (page !== destinationScreen) {
      page.classList.add("hidden");
    }
  });
};

// function to change between login and register page
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
  googlebutton.addEventListener("click", async function () {
    changeScreen(loggedInOverview);
  });
}

Changescreens()


// Initialize Firebase

export const fireStoreApp = initializeApp(firebaseConfig);


// get data from firestore
export const fireStoreDb = getFirestore(fireStoreApp);
export const addTodoFirebase = async(text: string, todoId: string) => {
  const cardsSnapShot = collection(fireStoreDb, `lists/${todoId}/cards`);
  
  const docRef = await addDoc(cardsSnapShot, {
    title: text,
    description: '',
    comments: []
    }
  );
  return docRef.id;
}

export const updateTodoFirebase = async(todoListId: string, id: string, attribute: string, value: string) => {
  console.log(todoListId, id, attribute, value);
  if(attribute === 'title'){
    const answer = await setDoc(doc(fireStoreDb, `lists/${todoListId}/cards`, id), {
      title: value
    }, { merge: true });
  }else{
    const answer = await setDoc(doc(fireStoreDb, `lists/${todoListId}/cards`, id), {
      description: value
    }, { merge: true });
  }
  
}


export const deleteTodoListFirebase = async(id: string) => {
  await deleteDoc(doc(fireStoreDb, "lists", id));
}

export const deleteCardFromFirebase = async(todoListId: string, id: string) => {
  await deleteDoc(doc(fireStoreDb, `lists/${todoListId}/cards`, id));
}