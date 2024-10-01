// document and localStorage are property in window object.
// localStorage sets items in String format.
// localStorage returns items in String format.

function loadToDoList(){
    const todoArray = JSON.parse(localStorage.getItem("ToDos")) || [];
    return todoArray;
}

function addToDo(task){
    const todos = loadToDoList();
    todos.push(task);
    localStorage.setItem("ToDos",JSON.stringify(todos)); // add todotask to localStorage.
}

function trimtodoText(){
    const todoInput = document.querySelector("#inputList");
    todoInput.addEventListener("change",(event)=>{
        const todos = event.target.value;
        event.target.value = todos.trim(); // remove leading and trailing spaces.
    })
}

function refreshTodos(todos){
    localStorage.setItem("ToDos",JSON.stringify(todos));
}

function createToDoList(taskEntered){
    const tasks = document.getElementById("tasks");

    // Remove the "ToDo List is Empty." message if present
    const emptyMessage = document.getElementById("emptyMessage");
    if (emptyMessage) {
        emptyMessage.remove();
    }

    const litag = document.createElement("li");
    tasks.appendChild(litag);
    const taskDiv = document.createElement("div");
    litag.classList.add("litag"); // class of li tag.
    taskDiv.textContent = taskEntered.todoTask;
    litag.appendChild(taskDiv);    

    const divBtn = document.createElement("div");
    divBtn.classList.add("divBtn"); // class of div
    litag.appendChild(divBtn);
    // Adding edit, delete, and completed buttons
    // Same class for all the three buttons "listsBtns"
    const editBtn = document.createElement("button");
    editBtn.classList.add("listsBtns");
    editBtn.classList.add("editBtn");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("data-id",taskEntered.id);
    divBtn.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("listsBtns");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-id",taskEntered.id);
    divBtn.appendChild(deleteBtn);

    const completedBtn = document.createElement("button");
    completedBtn.classList.add("listsBtns");
    completedBtn.classList.add("completedBtn");
    completedBtn.textContent = (taskEntered.isComplete==false)?"Completed":"Reset";
    completedBtn.setAttribute("data-id",taskEntered.id);
    divBtn.appendChild(completedBtn);

    // CompletedBtn actionEvent
    const completedBtns = document.getElementsByClassName("completedBtn");
    for(const complete of completedBtns){
        complete.addEventListener("click",completedBtnFunc);
    }

    // DeletedBtn actionEvent
    const deleteBtns = document.getElementsByClassName("deleteBtn");
    for(const deleteBtn of deleteBtns){
        deleteBtn.addEventListener("click",deleteBtnFunc);
    }

    // EditBtn actionEvent
    const editBtns = document.getElementsByClassName("editBtn");
    for(const editBtn of editBtns){
        editBtn.addEventListener("click",editBtnFunc);
    }

}

function displayAllToDoList(){
    const tasks = document.getElementById("tasks");
    const allTodoList = loadToDoList();
    tasks.innerHTML = "";
    // Show the "ToDo List is Empty." message when there are no tasks
    if(allTodoList.length==0){
        const litag = document.createElement("li");
        litag.textContent = "ToDo List is Empty.";
        litag.id = "emptyMessage"; // Add an id for easy removal later
        tasks.appendChild(litag);
    }
    else{
        // Display all tasks from the local storage
        allTodoList.forEach(element => {
            createToDoList(element);
        });
    }
}

function filterButtonsFunc(event){
    const btnClicked = event.target;
    const btnClickedAttribute = btnClicked.getAttribute("data-filter");
    const tasks = document.getElementById("tasks");
    tasks.innerHTML = "";
    const allTodoList = loadToDoList();

    if(btnClickedAttribute=="all"){
        if(allTodoList.length == 0){
            const litag = document.createElement("li");
            litag.textContent = "ToDo List is Empty.";
            litag.id = "emptyMessage";
            tasks.appendChild(litag);
        }
        else{
            allTodoList.forEach((element)=>{
            createToDoList(element);
        })
    }
    }
    else if(btnClickedAttribute=="completed"){
        let check = 1; // 1 means no task is complete.
        allTodoList.forEach(element=>{
            if(element.isComplete==true){
                check = 0;
                createToDoList(element);
            }
        })
        if(check==1){
            const litag = document.createElement("li");
            litag.textContent = "None tasks are Complete.";
            litag.id = "emptyMessage";
            tasks.appendChild(litag);
        }
    }
    else{
        check = 1; // 1 means no task is pending.
        allTodoList.forEach(element=>{
            if(element.isComplete==false){
                check = 0;
                createToDoList(element);
            }
        })
        if(check==1){
            const litag = document.createElement("li");
            litag.textContent = "Hurray! all tasks are completed.";
            litag.id = "emptyMessage";
            tasks.appendChild(litag);
        }
    }
}

function completedBtnFunc(event){
    const clickedBtn = event.target;
    const idOfClickedBtn = clickedBtn.getAttribute("data-id");

    const allTodoList = loadToDoList();
    allTodoList.forEach((element)=>{
        if(idOfClickedBtn==element.id){
            element.isComplete = !element.isComplete;
        }
    })
    refreshTodos(allTodoList);
    displayAllToDoList();
}

function deleteBtnFunc(event){
    const clickedBtn = event.target;
    const idOfClickedBtn = clickedBtn.getAttribute("data-id");

    let allTodoList = loadToDoList();
    allTodoList = allTodoList.filter((todo)=>todo.id != idOfClickedBtn);
    refreshTodos(allTodoList);
    displayAllToDoList();
}

function editBtnFunc(event){
    const clickedBtn = event.target;
    const idOfClickedBtn = clickedBtn.getAttribute("data-id");
    const updatedText = prompt("Update the ToDoTask.");

    let allTodoList = loadToDoList();
    allTodoList.forEach((element)=>{
        if(element.id == idOfClickedBtn){
            element.todoTask = updatedText;
        }
    })
    refreshTodos(allTodoList);
    displayAllToDoList();
}

function recordTaskEntered(todoInput){
    const enteredTask = todoInput.value;
    if(enteredTask==""){
        alert("Enter a task.");
    }
    else{
        const allTodoList = loadToDoList();
        const id = allTodoList.length;
        const taskEntered = {todoTask:enteredTask,isComplete:false,id:id};
        addToDo(taskEntered);
        todoInput.value = "";
        createToDoList(taskEntered);
    }
}

// DOMContentLoaded - to only select html elements after DOM has successfully loaded.
document.addEventListener("DOMContentLoaded",()=>{

    const todoInput = document.querySelector("#inputList");
    const submitButton = document.querySelector(".listButton");
    const filtersBtns = document.getElementsByClassName("filterBtn");
    
    for(const filterBtns of filtersBtns){ // To traverse the filterBtns
        filterBtns.addEventListener("click",filterButtonsFunc);
    }

    trimtodoText();

    submitButton.addEventListener("click",()=>{
        recordTaskEntered(todoInput);
    })

    document.addEventListener("keydown",(event)=>{
        if(event.key=="Enter"){
            recordTaskEntered(todoInput);
        }
    })

    displayAllToDoList();
})