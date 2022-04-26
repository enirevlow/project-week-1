//Declarations
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const allList = document.querySelector('[data-all-lists]');
const listsContainer = document.querySelector('.list-container');
const taskTitle = document.querySelector('.task-title');


const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input');
const addTaskButton = document.getElementById('new-task-button');
const allTask = document.querySelector('[data-all-tasks');
const taskHeader = document.querySelector('task-header')
const clearAllButton = document.querySelector('.clear-all-button');


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
    if(e.target.tagName.toLowerCase() === 'button'){
        let toDeleteId = e.target.parentElement.dataset.listId;
        lists = lists.filter(list => list.id !== toDeleteId);
        if (lists.length >= 1) {
        selectedListId = lists[0].id;
        } else {
            selectedListId = null;
            taskTitle.innerText = 'Tasks';
            clearElements(allTask);
        }
        saveAndBuildLists();
    }
})

//add new task
addTaskButton.addEventListener('click', e => {
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

})

//complete task
allTask.addEventListener('change', e => {
    if(e.target.name === 'complete-checkbox') {
        let task = e.target.parentElement;
        let selectedList = lists.find(list => list.id === selectedListId);
        let selectedTask = selectedList.tasks.find(task => task.id === e.target.parentElement.id);
        selectedTask.complete = e.target.checked;
        saveAndBuildLists();
        }
})

//delete task
allTask.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'button') {
        let taskId = e.target.parentElement.id;
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
    taskTitle.innerText = selectedList.name;
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
        deleteButton.innerText = 'x'
        listDiv.appendChild(deleteButton);
        
    });

}

function createTask(name) {
    return {id: Date.now().toString(), name: name, complete: false};
}

function buildTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.id = task.id;
        allTask.appendChild(taskDiv);
        const completeCheckBox = document.createElement('input');
        completeCheckBox.setAttribute('type', 'checkbox');
        completeCheckBox.checked = task.complete;
        completeCheckBox.name = 'complete-checkbox';
        taskDiv.appendChild(completeCheckBox);
        const taskContent = document.createElement('li');
        taskContent.innerText = task.name;
        taskDiv.appendChild(taskContent);
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-task');
        deleteButton.id = 'delete' + task.id;
        deleteButton.innerText = 'x'
        taskDiv.appendChild(deleteButton);
    })
}

function clearElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

buildLists();