let TC = document.querySelector(".ticket-container");
let allFilters = document.querySelectorAll(".filter");
let modalVisible = false;

function loadTickets(color) { 
    let allTasks = localStorage.getItem("allTasks");
    if(allTasks != null) {
        allTasks = JSON.parse(allTasks);
        if(color) {
            allTasks = allTasks.filter(function(data){
                return data.priority == color;
            })
        }
        for(let i = 0; i < allTasks.length; i++) {
            let ticket = document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerHTML = `<div class = "ticket-color ticket-color-${allTasks[i].priority}"></div>
                                <div class = "ticket-id">#${allTasks[i].ticketId}</div>
                                <div class = "task">${allTasks[i].task}</div>`
            TC.appendChild(ticket);
            ticket.addEventListener("click", function(e){
                if(e.currentTarget.classList.contains("active")) {
                    e.currentTarget.classList.remove("active")
                } else{
                    e.currentTarget.classList.add("active");
                }
            });

        }
    }
}
loadTickets();

for(i = 0 ; i < allFilters.length ; i++){
    allFilters[i].addEventListener("click", filterHandler);
}

function filterHandler(e){
    // let span = e.currentTarget.children[0]; //e.currentTarget -> div class btn , + .children -> gives an array of children//
    // let style = getComputedStyle(span)
    // TC.style.backgroundColor = style.backgroundColor;
    TC.innerHTML = "";
    if(e.currentTarget.classList.contains("active")) {
        e.currentTarget.classList.remove("active"); //already has active class -> remove it
        loadTickets();
    } else {
        let activeFilter = document.querySelector(".filter.active");   // null if no btn as active class -> directly active class added to current target  
        if(activeFilter) {
            activeFilter.classList.remove("active");      //if any btn has active class -> remove it
        }
        e.currentTarget.classList.add("active");          // put active class on current target
        let ticketPriority = e.currentTarget.children[0].classList[0].split("-")[0];
        loadTickets(ticketPriority);
    }
}

let addBtn = document.querySelector(".add"); 
let deleteBtn = document.querySelector(".delete"); //to delete the ticket
deleteBtn.addEventListener("click", function(e){
    let selectedTickets = document.querySelectorAll(".ticket.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));
    for(i = 0; i < selectedTickets.length; i++) {
        selectedTickets[i].remove();
        let ticketID = selectedTickets[i].querySelector(".ticket-id").innerText;   //ticketId that needs to be deleted from allTasks
        allTasks = allTasks.filter(function(data){
            return(("#" + data.ticketId) != ticketID);
        })
    }
    localStorage.setItem("allTasks" , JSON.stringify(allTasks));
})

addBtn.addEventListener("click", showModal);

let selectedPriority;

function showModal(e) {
 if(!modalVisible) {

    // let modal = document.createElement("div");
    // modal.classList.add("modal");
    // modal.innerHTML = `<div class="task-to-be-added" contenteditable = "true"></div>
    //                      <div class="modal-priority-list">
    //                          <div class="modal-pink-filter modal-filter"></div>
    //                          <div class="modal-skyblue-filter modal-filter"></div>
    //                          <div class="modal-lightgreen-filter modal-filter"></div>
    //                          <div class="modal-yellow-filter modal-filter"></div>
    //                     </div>`;
    // TC.appendChild(modal);
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `<div class="task-to-be-added" data-typed = "false" contenteditable = "true">Enter your task here...</div>
        <div class="modal-priority-list">
             <div class="modal-pink-filter modal-filter active"></div>
             <div class="modal-skyblue-filter modal-filter"></div>
             <div class="modal-lightgreen-filter modal-filter"></div>
             <div class="modal-yellow-filter modal-filter"></div>
        </div>`;
    TC.appendChild(modal);
    selectedPriority = "pink";  //by default priority
    let taskModal = document.querySelector(".task-to-be-added");
    taskModal.addEventListener("click", function(e){
        if(e.currentTarget.getAttribute("data-typed") == "false") {
            e.currentTarget.innerText = "";
            e.currentTarget.setAttribute("data-typed", "true");
        }

    })
    modalVisible = true;
    taskModal.addEventListener("keypress", addTicket.bind(this, taskModal));
    let modalFilters = document.querySelectorAll(".modal-filter");
    for(i = 0; i < modalFilters.length; i++) {
        modalFilters[i].addEventListener("click", selectPriority.bind(this,taskModal));

         }
    }
}

function selectPriority(taskModal, e) {
    let activeFilter = document.querySelector(".modal-filter.active");
    activeFilter.classList.remove("active");
    selectedPriority = e.currentTarget.classList[0].split("-")[1];     //split -> create array
    e.currentTarget.classList.add("active");
    taskModal.click();
    taskModal.focus();
}

function addTicket(taskModal, e){
    if(e.key == "Enter" && e.shiftKey == false && taskModal.innerText.trim() != "" ){
        let task = taskModal.innerText;
        let id = uid();
        // let ticket = document.createElement("div");
        // ticket.classList.add("ticket");
        // ticket.innerHTML = `<div class = "ticket-color ticket-color-${selectedPriority}"></div>
        //                     <div class = "ticket-id">#${id}</div>
        //                     <div class = "task">${task}</div>`
        
        document.querySelector(".modal").remove();
        modalVisible = false;
        // TC.appendChild(ticket);
        // ticket.addEventListener("click", function(e){
        //     if(e.currentTarget.classList.contains("active")){
        //         e.currentTarget.classList.remove("active")
        //     } else{
        //         e.currentTarget.classList.add("active");
        //     }
        // });

    let allTasks = localStorage.getItem("allTasks");

       if(allTasks == null) {
            let data = [{"ticketId": id, "task": task, "priority": selectedPriority}];
            localStorage.setItem("allTasks", JSON.stringify(data));     //stringify -> converted object to string
        } else {
            let data = JSON.parse(allTasks);         // parse -> converted string to object
            data.push({"ticketId": id, "task": task, "priority": selectedPriority});
            localStorage.setItem("allTasks", JSON.stringify(data));
        }
        let activeFilter = document.querySelector(".filter.active");
        TC.innerHTML = "";
        if(activeFilter) {
            let priority = activeFilter.children[0].classList[0].split("-")[0];
            loadTickets(priority);
        } else {
            loadTickets();
        }
    } else if(e.key == "Enter" && e.shiftKey == false) {     // means string is empty
        e.preventDefault();
        alert("Error! You have not entered the task.")
    }
}


