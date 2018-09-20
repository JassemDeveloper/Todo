// M => Module 
function Module(name) {

    //helper functions
    //f=>function
    let f = {
        allFunc: function() {
            return Object.getOwnPropertyNames(M.f).slice(1);
        },
        _createUID: function() {
            return Math.random().toString(12).substr(2, 3);
        },
        _isObject: function(arg) {
            return Object.prototype.toString.call(arg) === '[object Object]';
        },
        _isArray: function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        },
        _isString: function(arg) {
            return typeof arg === "string";
        },
        _isFunction: function(arg) {
            return typeof arg === "function";
        },
        _checkFO: function(data, cb) {

            if (!cb) {
                throw new Error("Call back is required");
            }

            if (!f._isFunction(cb)) {
                throw new Error(" Must be a function");
            }

            if (!f._isObject(data)) {
                cb('data should be an object', null);
                return;
            }
        },
        _checkF: function(cb) {
            if (!cb) {
                throw new Error("Call back is required");
            }

            if (!f._isFunction(cb)) {
                throw new Error(" Must be a function");
            }
        },
        _checkFS: function(id, cb) {
            if (!cb) {
                throw new Error("Call back is required");
            }

            if (!f._isFunction(cb)) {
                throw new Error(" Must be a function");
            }

            if (!f._isString(id)) {
                cb('id should be a string', null);
                return;
            }
        }
    }

    //constructor

    if (!name) {
        throw new Error("name is required");
    } else if (!f._isString(name)) {
        throw new Error("name must be string");
    } else {
        this.name = name;
    }

    //manipulate DOM
    //d=> DOM
    let d = {
        createEl: function(el, id, clas) {
            let c = document.createElement(el);
            c.id = id;
            c.className = clas;
            document.getElementById('cover').appendChild(c);

        },
        removeEl: function() {
            let div = document.getElementById(id);
            div.parentNode.removeChild(div);
        }
    }

    // main functions 
    let todo = {
        display: function() {
            console.log(name);
        },
        checkLocalStorage: function() {
            try {
                console.log("Started");
                localStorage.setItem(1, "Jassem");
                console.log("Test : " + localStorage.getItem(1));
            } catch (e) {
                throw new Error("not Supported");
                console.log(e);
            }

        },
        save: function(data, cb) {
            let items = [];
            let storedItems = localStorage.getItem(name);

            f._checkFO(data, cb);

            if (!storedItems) {
                Object.defineProperty(data, 'id', {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: f._createUID()
                });

                items.push(data);
                localStorage.setItem(name, JSON.stringify(items));
                cb(null, data);
            } else {

                items = JSON.parse(storedItems);
                Object.defineProperty(data, 'id', {
                    enumerable: true,
                    configurable: false,
                    writable: false,
                    value: f._createUID()
                });

                items.push(data);
                localStorage.setItem(name, JSON.stringify(items));
                cb(null, data);
            }


        },
        findAll: function(cb) {
            let storedItems = localStorage.getItem(name);

            f._checkF(cb);


            if (!storedItems) {
                cb("No  Items in the collections", null);
            } else {
                d.createEl("div", "items", "items");
                cb(null, storedItems);
            }


        },
        findById: function(id, cb) {

            let storedItems = JSON.parse(localStorage.getItem(name));
            let items;

            f._checkFS(id, cb);

            if (f._isArray(storedItems) && storedItems.length) {
                items = storedItems.filter(function(item) {
                    return item.id === id;
                });
            }

            if (items && items.length) {
                cb(null, items[0]);
            } else {
                cb('no such id' + id, null);
            }
        },
        update: function(data, cb) {
            let storedItems = localStorage.getItem(name);
            let items;
            let updated;

            f._checkF(cb);

            if (!f._isObject(data)) {
                cb('data must be an object', null);
                return;
            } else if (!data.id) {
                cb('data must have a valid id', null);
                return;
            } else {
                updated = data;
            }



            if (!storedItems) {
                cb("No  Items in the collections", null);
            } else {
                items = JSON.parse(storedItems);
            }

            if (f._isArray(items) && items.length) {

                items.forEach(function(item, index) {
                    if (item.id === updated.id) {
                        items.splice(index, 1, updated);
                    }
                });
            }



            localStorage.setItem(name, JSON.stringify(items));
            cb(null, updated);
        },
        remove: function(id, cb) {
            let storedItems = JSON.parse(localStorage.getItem(name));
            let len;

            f._checkFS(id, cb);

            if (!storedItems) {
                cb('no such item', null);
            } else {
                if (f._isArray(storedItems)) {
                    len = storedItems.length;
                } else {
                    len = 0;
                }
            }

            if (len > 0) {
                storedItems.forEach(function(item, index) {
                    if (item.id === id) {
                        storedItems.splice(index, 1);
                        localStorage.setItem(name, JSON.stringify(storedItems));
                    }
                });
            }
            if (len > storedItems.length) {
                cb(null, 'The object with ' + id + 'is removed');
            } else {
                cb('no item ', null);
            }
        }
    }


    return todo;
};

let tasks = new Module("tasks");

tasks.findAll(function(err, res) {
    if (err) {
        console.log(err);
    } else {
        let r = JSON.parse(res);
        findAll(r);
    }
});

function cancelB() {
    let div = document.getElementById('model');
    let divC = document.getElementById('model-content');
    divC.classList.add("ns-hide");
    setTimeout(function() {
        div.parentNode.removeChild(div);
    }, 250);
}

function yesB(id) {
    tasks.remove(id, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            let div = document.getElementById('model');
            div.parentNode.removeChild(div);
            createModelSuccess("Your Task was removed successfully");
            tasks.findAll(function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    let r = JSON.parse(res);
                    findAll(r);
                }
            });

            //console.log(res);
        }

    });
}


function findAll(r) {
    let data = "";
    data += "<div class='header'> <u>Task Name:</u></div>"
    data += "<table class='tasks'>";
    if (r.length > 0) {
        for (let i = 0; i < r.length; i++) {
            let forModelUpdate = 'createFormModel(formModelUpdate("' + r[i].name + '","' + r[i].id + '"))';
            data += "<tr>";
            data += "<td class='taskN'>";
            data += (i + 1) + "- " + r[i].name;
            data += "</td>";
            data += "<td>";
            data += "<span onclick='createModel(this);' data-id='" + r[i].id + "' class='action' > &#10060; </span>";
            data += "<span onclick='createFormModel(formModelUpdate(\"" + r[i].name + "\",\"" + r[i].id + "\"));' data-name='" + r[i].name + "' class='action update' > &#x270e; </span>";
            //data += "<span onclick='"+ forModelUpdate +"' data-name='" + r[i].name + "' class='action update' > &#x270e; </span>";
            data += "</td>";
            data += "</tr>";
        }
    } else {
        data += "<tr><td> No Tasks have been added to the list  yet</td></tr>";
    }
    data += "</table>";
    document.getElementById("items").innerHTML = data;
}

function formModelAdd() {
    let data = "<br/>";
    data += "<p>Add New Task To list</p>";
    data += "<form>";
    data += "<input type='text' class='taskName' id='taskName' placeholder='Task Name'/>";
    data += "</form>";
    data += '<button id="addTaskB" class="addTaskB button green" onclick="addTask()" > Add Task </button>';
    data += "<button id='cancelB' class='cancelB button blue' onclick='cancelB();'> Cancel </button>";
    return data;
}

function formModelUpdate(name, id) {
    let data = "<br/>";
    data += "<p>Update Task</p>";
    data += "<form>";
    data += "<input type='text' class='taskName' id='taskName' placeholder='" + name + "'>";
    data += "</form>";
    data += '<button id="addTaskB" class="addTaskB button green" onclick="updateTask(\'' + id + '\')" > Update Task </button>';
    data += "<button id='cancelB' class='cancelB button blue' onclick='cancelB();'> Cancel </button>";
    return data;
}

function modelConfirm(message, id) {
    let data = "<br/><br/>";
    data += "<p>" + message + "</p>";
    data += '<button id="yesB" class="yesB button red" onclick="yesB(\'' + id + '\')"> Yes </button>';
    data += "<button id='cancelB' class='cancelB button blue' onclick='cancelB();'> Cancel </button>";
    return data;
}

function modelSuccess(message) {
    let data = "";
    data += '<svg class="checkmark" viewBox="0 0 52 52">';
    data += '<circle class="checkmark-circle" fill="none" cx="26" cy="26" r="25" />';
    data += '<path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>';
    data += '</svg>';
    data += "<p>" + message + "</p>";
    return data;
}

function createModel(e) {
    let id = e.getAttribute('data-id');
    let cd = document.createElement('div');
    let d = document.createElement('div');
    let data = modelConfirm("Are you sure ?", id);
    cd.id = "model";
    cd.className = "model";
    d.id = 'model-content';
    d.className = 'model-content';
    cd.appendChild(d);
    // document.body.appendChild(cd);
    document.getElementById('cover').appendChild(cd);
    document.getElementById("model-content").innerHTML = data;
}

function createFormModel(func) {
    let cd = document.createElement('div');
    let d = document.createElement('div');
    let data = func;
    cd.id = "model";
    cd.className = "model";
    d.id = 'model-content';
    d.className = 'model-content';
    cd.appendChild(d);
    document.getElementById('cover').appendChild(cd);
    document.getElementById("model-content").innerHTML = data;
}


function createModelSuccess(message) {
    let cd = document.createElement('div');
    let d = document.createElement('div');
    let data = modelSuccess(message);
    cd.id = "model";
    cd.className = "model";
    d.id = 'model-content';
    d.className = 'model-content';
    cd.appendChild(d);
    // document.body.appendChild(cd);
    document.getElementById('cover').appendChild(cd);
    document.getElementById("model-content").innerHTML = data;
    let div = document.getElementById('model');
    let divC = document.getElementById('model-content');
    setTimeout(function() {
        divC.classList.add("ns-hide");
        setTimeout(function() {
            div.parentNode.removeChild(div);
        }, 250);
    }, 3000);

}


function addTask() {
    let taskName = document.getElementById('taskName').value;

    if (taskName.length > 0) {
        let data = {
            name: taskName
        };
        tasks.save(data, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                let div = document.getElementById('model');
                div.parentNode.removeChild(div);
                createModelSuccess("Your Task was added successfully");
                tasks.findAll(function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        let r = JSON.parse(res);
                        findAll(r);
                    }
                });

            }

        });
    } else {
        alert('Task Name is empty');
    }

}


function updateTask(id) {
    let taskName = document.getElementById('taskName').value;

    if (taskName.length > 0) {
        let data = {
            name: taskName
        };
        let item;

        tasks.findById(id, function(err, res) {

            if (err) {
                console.log(err);
            } else {
                item = res;
                item.name = document.getElementById('taskName').value;
                tasks.update(item, function(err, res) {

                    if (err) {
                        console.log(err);
                    } else {

                        let div = document.getElementById('model');
                        div.parentNode.removeChild(div);
                        createModelSuccess("Your Task was updated successfully");
                        tasks.findAll(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                let r = JSON.parse(res);
                                findAll(r);
                            }
                        });
                    }

                });


            }

        });


    } else {
        alert('Task Name is empty');
    }

}