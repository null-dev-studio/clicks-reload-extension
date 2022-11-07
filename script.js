let btn = document.getElementById('btn');
let inWork = false;
let reloadTub = false;
let mainInterval;
let mainWndowId;
let tubNumber = 1;
let checkTubNumber = 1;

function checkLoaded(amount){
    if (Number(amount) > 0) {
        chrome.tabs.query({}, function(tabs) {
            chrome.tabs.executeScript(tabs[checkTubNumber].id, {"code": `
                document.getElementsByClassName('asb-flex-center asb-pos-stretch-main _asb_betslip-bet-messages-error--betslip-bet-messages-text _asb_betslip-bet-messages-text ').length
            `}, reload);
        }); 
    }
}

function reload(amount) {
    if (Number(amount) > 0) {
        console.log('reload tub '+String(checkTubNumber));
        chrome.tabs.query({}, function(tabs) {    
            chrome.tabs.executeScript(tabs[checkTubNumber].id, {"code": `location.reload();`});
        }); 

    }
}

function clickOnTub(amount, tubNumber) {
    if (Number(amount) > 0) {
        console.log('click on tub '+String(tubNumber));
        chrome.tabs.query({}, function(tabs) {
            chrome.tabs.executeScript(tabs[tubNumber].id, {"code": `
                document.getElementsByClassName('asb-text-center asb-pos-stretch-main _asb_simple-button _asb_simple-button-pointer  _asb_betslip-place-btns-bet')[0].click()
            `}); 
        }); 
    }
}

function main(interval) {
    mainInterval = setInterval(() => {
        if (inWork) {
            chrome.tabs.query({}, function(tabs) {
                let curentTubNumber = tubNumber
                chrome.tabs.executeScript(tabs[curentTubNumber].id, {"code": `
                    document.getElementsByClassName('asb-text-center asb-pos-stretch-main _asb_simple-button _asb_simple-button-pointer  _asb_betslip-place-btns-bet').length
                `}, (amount) => clickOnTub(amount, curentTubNumber));

                tubNumber = tubNumber + 1;
                if(tabs.length == tubNumber) {
                    tubNumber = 1;
                }
            }); 
        } else {
            clearInterval(mainInterval);
        }
    }, interval*1000);

    checkInterval = setInterval(() => {
        if (inWork) {
            chrome.tabs.query({}, function(tabs) {    
                chrome.tabs.executeScript(tabs[tubNumber].id, {"code": `
                    document.getElementsByClassName('container').length
                `}, checkLoaded);

                checkTubNumber = checkTubNumber + 1;
                if(tabs.length == checkTubNumber) {
                    checkTubNumber = 1;
                }
            }); 
        } else {
            clearInterval(checkInterval);
        }
    }, 500);
}

if(btn != null) {
    btn.onclick = (el) => {
        if (!inWork && document.getElementById('timer').value >= 0) {
            btn.innerText = "стоп";
            inWork = true;
            checkTubNumber = 1;
            tubNumber = 1;
            chrome.windows.getCurrent((win) => {
                mainWndowId = win.id;
            });
            main(document.getElementById('timer').value);
        } else {
            btn.innerText = "старт"
            inWork = false;
        }
    }
}