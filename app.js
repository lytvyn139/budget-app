//**BUDGET CONTROLLER */
let budgetController = (() => {
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };
    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    let calculateTotal = (type) =>{ //86
         let sum = 0;
         data.allItems[type].forEach((cur) => {
            sum += cur.value;
         });
        data.totals[type] = sum;     
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 
    };

    return {
        addItem: (type, des, val) => {
            let newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Expense(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: () =>{
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);  
            } else {
                data.percentage = -1;
            }
            
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: () => {
            return data;
        }
    };

})();




//**UI CONTROLLER */
let UIController = (() => {
    //CHANGED SELECTOR FOR CONVENIENCE 
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };


    //ALL PUBLIC METHODS
    return {
        //READING OUT INPUT VALUES
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat (document.querySelector(DOMstrings.inputValue).value)
            };
        },
        //END: READING OUT INPUT

        addListItem: (obj, type) => {
            let html, newHtml, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        //WILL CLEAR INPUT FIELDS AFTER EACH USE
        clearFields: () => {
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' +DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); 
            fieldsArr.forEach( (current, index, array) =>{
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        getDOMstrings: () => {
            return DOMstrings; //TO PASS IT OUTSIDE THE MODULE MUST RETURN 
        }
    };

})();

//**MAIN CONTROLLER */
let controller = ((budgetCtrl, UICtrl) => {
    let setupEventListeners = () => {
        let DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem(); //this will fire if button is clicked or ENTER pressed
            }
        });
    };

    let updateBudget = () => {
        budgetCtrl.calculateBudget();
        let budget = budgetCtrl.getBudget();
        console.log(budget);
    }

    //getDOMstrings is called DOM here in this module
    //ctrlAddItem is fired then somebody hit's enter or add button
    let ctrlAddItem = () => {
        let input, newItem;
        input = UIController.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            //GETTING INPUT VALS FROM UIController MODULE
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
        }
    };

    return {
        init: () => {
            console.log('event started');
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();