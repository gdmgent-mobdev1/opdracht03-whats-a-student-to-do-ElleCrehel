import { v4 as uuidv4 } from "uuid";
import {
  where,
  Query,
  DocumentData,
  query,
  getFirestore,
  collection
} from "firebase/firestore";

const db = getFirestore();
// const colRef = collection(db, "cards");

import { dragoverHandler, dropHandler } from "../Lib/dragAndDrop";
import { addTodoFirebase, deleteTodoListFirebase, detailproject, loggedInOverview} from "../lib/firebase-init";
// eslint-disable-next-line import/no-cycle
import Card from "./Card";

export default class TodoList {
  place: HTMLElement;

  title: string;

  cards_user_uid: string = localStorage.getItem("user_Uid");

  cardArray: Card[];

  input?: HTMLInputElement;

  div?: HTMLDivElement;

  h2?: HTMLHeadingElement;

  button?: HTMLButtonElement;

  deleteButton?: HTMLButtonElement;

  todoListElement?: string | HTMLElement | any ;

  id: string;
  detail: HTMLButtonElement;
  constructor(
    place: HTMLElement,
    title = "to-do list",
    id = "_" + uuidv4(),
  ) {
    this.id = id;
    this.place = place;
    this.title = title;
    console.log(title);
    this.cardArray = [];
    this.id = id;
    //console.log(this.cards_user_uid);
   // console.log(localStorage.getItem("user_Uid"))
    this.render();
  }
  
  async addToDo() {
    if (
      this.input instanceof HTMLInputElement &&
      this.div instanceof HTMLDivElement
    ) {
      const text = this.input.value;
      const cardId = await addTodoFirebase(text, this.id);
      const newCard = new Card(text, this.div, this, cardId, this.id);
      this.cardArray.push(newCard);
     
    }
  }

  render(): void {
    this.createToDoListElement();
    if (this.todoListElement instanceof HTMLElement) {
      this.todoListElement.addEventListener("drop", dropHandler);
      this.todoListElement.addEventListener("dragover", dragoverHandler);
      this.place.append(this.todoListElement);
    }
  }
  // todoListElement(todoListElement: any) {
  //   throw new Error("Method not implemented.");
  // }

  // q: Query<DocumentData> = query(colRef,where("cards_user_uid", "==", localStorage.getItem("user_Uid")));

  createToDoListElement(): void {
    // Create elements
   // console.log(this.cards_user_uid);
    //console.log(localStorage.getItem("user_Uid"));
    
      this.h2 = document.createElement("h2");
      this.h2.innerText = this.title;
      this.input = document.createElement("input");
      this.input.classList.add("comment");
      this.button = document.createElement("button");
      this.button.innerText = "Add";
      this.button.classList.add("btn-save");
      this.button.id = "to-do-list-button";
      this.div = document.createElement("div");
      this.deleteButton = document.createElement("button");
      this.deleteButton.classList.add("delete-btn");
      this.todoListElement = document.createElement("div");
      this.todoListElement.id = this.id;
      this.detail = document.createElement("button");
      this.detail.innerText = "detail";
      this.detail.classList.add('detail');
      
      // Add Event listener
      this.button.addEventListener("click", () => {
        if (this.input !== null && this.input?.value !== "") {
          this.addToDo.call(this);
          this.input!.value = "";
        }
      });

      this.deleteButton.addEventListener("click", () => {
        deleteTodoListFirebase(this.id);
        document.querySelector(`#${this.id}`)?.remove();
      });

    
     
      // Append elements to the to-do list element
      this.todoListElement.append(this.h2);
      this.todoListElement.append(this.detail);
      this.todoListElement.append(this.input);
      this.todoListElement.append(this.button);
      this.todoListElement.append(this.div);
      this.todoListElement.append(this.deleteButton);
      this.todoListElement.classList.add("todoList");
   
      this.detail.addEventListener("click", async function () {
        changeScreen(detailproject);

        /*DETAILPAGINE */
      const cardElement: any = document.querySelector(".todoList")
       // getToDetail
      cardElement.classList.remove("todoList")
       cardElement.classList.add("hidden")
        loggedInOverview.classList.add("hidden")

      });
  }
}


const pages = [detailproject];

const changeScreen = (destinationScreen: any) => {
  destinationScreen.classList.remove("hidden");

  pages.map((page) => {
    if (page !== destinationScreen) {
      page.classList.add("hidden");
    }
  });
};

