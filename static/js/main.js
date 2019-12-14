//BUDGET CONTROLLER 
//===============================================================================
let budgetController = (() => {
    
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
    };

    Expense.prototype.calculatePercentage = function(totalIncome) { //95
        if (totalIncome > 0) {    
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    },

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    },

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

    //****************************888888ALL PUBLIC METHODS
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

        deleteItem: (type, id) => { //91
            let ids, index;
            ids =  data.allItems[type].map((cur) => {
                return cur.id;
            });
            index = ids.indexOf(id);  
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: () =>{
            data.allItems.exp.forEach((cur) => {
                cur.calculatePercentage(data.totals.inc);
            })
        },

        getPercentages: () => {
            let allPerc = data.allItems.exp.map((cur) => {
                return cur.getPercentage();
            });
            return allPerc;
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



//UI CONTROLLER
//===============================================================================
let UIController = (() => {
    //CHANGED SELECTOR FOR CONVENIENCE 
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    let formatNumber = (num, type) => { //96
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    //********************ALL PUBLIC METHODS**********************
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: (selectorID) => {
            let el = document.getElementById(selectorID) 
            el.parentNode.removeChild(el);
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

        displayBudget: (obj) =>{  //87
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type); //takes
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');  //all
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalInc, 'exp'); //value
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'; //getBudget()
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        

        displayMonth: function () { //98
            let now = new Date();
            let year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months [month] + "-"+ year;
       },

       changedType: () => {
        let fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue);
        
        nodeListForEach(fields, function(cur) {
           cur.classList.toggle('red-focus'); 
        });
        
        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        
    },
        
    getDOMstrings: () => {
            return DOMstrings; //TO PASS IT OUTSIDE THE MODULE MUST RETURN 
        }
    };


})();
//===============================================================================
//**MAIN CONTROLLER */
let controller = ((budgetCtrl, UICtrl) => {
    let setupEventListeners = () => { 
        //in this function we take all data from UICtrl.DOMstrings 
        let DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem(); //this will fire if button is clicked or ENTER pressed
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    let updateBudget = () => {
        budgetCtrl.calculateBudget();
        let budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = () => {
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        console.log(percentages);
        UIController.displayPercentages(percentages);
    };

    
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
            updatePercentages();
        }
    };

    let ctrlDeleteItem = (even) =>{ //90
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-'); 
            type = splitID[0];
            ID =  parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    }

    return {
        init: () => {
            console.log('event started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();