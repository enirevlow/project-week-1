//Declarations
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const allList = document.querySelector('[data-all-lists]');
const listsContainer = document.querySelector('[data-list-container]');
const taskTitle = document.querySelector('[data-task-title]');
const deleteList = document.querySelector('[data-delete-list]');


const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input');
const addTaskButton = document.getElementById('new-task-button');
const allTask = document.querySelector('[data-all-tasks');
const taskHeader = document.querySelector('[data-task-header]')
const clearAllButton = document.querySelector('[data-clear-all-btn]');



const bgModal = document.querySelector('[data-bg-modal]');
const addTaskModal = document.querySelector('[data-add-task-btn-modal]');
const closeModal = document.querySelector('[data-close-modal-box]');
const addTaskHeader = document.querySelector('[data-add-task-btn-header]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListID';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);



//Event Listeners
//selected list
allList.addEventListener ('click', e => {
    if (e.target.tagName.toLowerCase() === 'li'){
        let targetId = e.target.parentElement.dataset.listId;
        selectedListId = targetId;
        saveAndBuildLists();
    }
})

//add new list
newListForm.addEventListener('submit', e => {
    e.preventDefault();
    if (newListInput.value === '' || newListInput.value === null) {
        newListForm.reset();
    } else {
        let listname = newListInput.value.trim();
        const list = createList(listname);
        newListForm.reset();
        lists.push(list);
        selectedListId = lists[lists.length-1].id;
        saveAndBuildLists();
    }
})

//delete list
allList.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'i'){
        let toDeleteId = e.target.parentNode.parentNode.dataset.listId;
        lists = lists.filter(list => list.id !== toDeleteId);
        if (lists.length >= 1) {
        selectedListId = lists[0].id;
        } else {
            selectedListId = null;
            taskTitle.innerText = 'TASKS';
            clearElements(allTask);
        }
        saveAndBuildLists();
    }
})

//add new task
addTaskModal.addEventListener('click', e => {
    e.preventDefault();
    if (newTaskInput.value === '' || newTaskInput.value === null) {
        newTaskForm.reset();
    } else {
        let taskName = newTaskInput.value;
        let newTask = createTask(taskName);
        let selectedList = lists.find(list => list.id === selectedListId);
        selectedList.tasks.push(newTask);
        saveAndBuildLists();
        newTaskForm.reset();
    }
    closeNewTaskModal();

})

//complete task
allTask.addEventListener('change', e => {
    if(e.target.name === 'complete-checkbox') {
        let selectedList = lists.find(list => list.id === selectedListId);
        let selectedTask = selectedList.tasks.find(task => task.id === e.target.parentNode.parentNode.id);
        selectedTask.complete = e.target.checked;
        saveAndBuildLists();
        }
})

//delete task
allTask.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'i') {
        let taskId = e.target.parentNode.parentNode.parentNode.id;
        let selectedList = lists.find(list => list.id === selectedListId); 
        selectedList.tasks = selectedList.tasks.filter(task=> task.id !== taskId);
        saveAndBuildLists();
    }
})

//clear all task
clearAllButton.addEventListener('click', e => {
    let selectedList = lists.find(list => list.id === selectedListId); 
    selectedList.tasks.splice(0,selectedList.tasks.length);
    saveAndBuildLists();
})


//open new task modal
addTaskHeader.addEventListener('click', openNewTaskModal);


// //close new task modal
closeModal.addEventListener('click',closeNewTaskModal);

//Functions


function createList(name) {
    return {id: Date.now().toString(), name: name, tasks: [] };
} 

function saveAndBuildLists() {
 
    saveLocal();
    buildAll();
}

function saveLocal() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);

}


function buildAll() {
    clearElements(allList);
    buildLists();
    const selectedList = lists.find(list => list.id === selectedListId); 
    taskTitle.innerText = selectedList.name.toUpperCase() ;
    clearElements(allTask);
    buildTasks(selectedList);

}

function buildLists() {
    lists.forEach(list => {
        const listDiv = document.createElement('div');
        listDiv.classList.add('list');
        listDiv.dataset.listId = list.id;
        allList.appendChild(listDiv);
        const newList = document.createElement('li');
        if (listDiv.dataset.listId === selectedListId) {
            newList.classList.add('selected-list');
        }
        newList.innerText = list.name;
        listDiv.appendChild(newList);
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-list');
        deleteButton.id = 'delete' + list.id;
        deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
        listDiv.appendChild(deleteButton);
        
    });

}

function createTask(name) {
    return {id: Date.now().toString(), name: name, complete: false};
}

function buildTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        //create individual task container
        const taskDiv = document.createElement('div');
        taskDiv.id = task.id;
        taskDiv.classList.add('indv-taskcontainer');
        allTask.appendChild(taskDiv);
        //create task-left container
        const taskLeftDiv = document.createElement('div');
        taskLeftDiv.classList.add('taskleft-div');
        taskDiv.appendChild(taskLeftDiv);
        //create checkbox
        const completeCheckBox = document.createElement('input');
        completeCheckBox.setAttribute('type', 'checkbox');
        completeCheckBox.checked = task.complete;
        completeCheckBox.name = 'complete-checkbox';
        taskLeftDiv.appendChild(completeCheckBox);
        //create taskcontent
        const taskContent = document.createElement('li');
        taskContent.innerText = task.name;
        taskLeftDiv.appendChild(taskContent);
        //create task-right container
        const taskRightDiv = document.createElement('div');
        taskRightDiv.classList.add('taskright-div');
        taskDiv.appendChild(taskRightDiv);
        //create deletebutton
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-task');
        deleteButton.id = 'delete' + task.id;
        deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
        taskRightDiv.appendChild(deleteButton);
    })
}

function clearElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// close modal 
function closeNewTaskModal() {
    bgModal.style.display = 'none';
    newTaskForm.reset();
}

// open modal
function openNewTaskModal() {
    bgModal.style.display = 'flex';
}

buildLists();