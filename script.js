let btn = document.getElementById('btn');
let inWork = false;
let first_pass = false;
let mainInterval;
let mainWndowId;
let tubNumber = 1;
let reloadTubNumber = 1;

function main(interval) {
    mainInterval = setInterval(() => {
        if (inWork) {
            chrome.tabs.query({}, function(tabs) {
                if(first_pass === false) {
                    if(tubNumber < (tabs.length-1)/2+1) {
                        // click
                        chrome.tabs.executeScript(tabs[tubNumber].id, {"code": `
                            document.getElementsByClassName('asb-text-center asb-pos-stretch-main _asb_simple-button _asb_simple-button-pointer  _asb_betslip-place-btns-bet')[0].click()
                        `});
                    } else {
                        first_pass = true;
                        // click
                        chrome.tabs.executeScript(tabs[tubNumber].id, {"code": `
                            document.getElementsByClassName('asb-text-center asb-pos-stretch-main _asb_simple-button _asb_simple-button-pointer  _asb_betslip-place-btns-bet')[0].click()
                        `});
                        // reload
                        chrome.tabs.executeScript(tabs[reloadTubNumber].id, {"code": `location.reload();`});
                    }
                } else {
                    // click
                    chrome.tabs.executeScript(tabs[tubNumber].id, {"code": `
                        document.getElementsByClassName('asb-text-center asb-pos-stretch-main _asb_simple-button _asb_simple-button-pointer  _asb_betslip-place-btns-bet')[0].click()
                    `});
                    // reload
                    chrome.tabs.executeScript(tabs[reloadTubNumber].id, {"code": `location.reload();`});
                }
                if(first_pass) {
                    reloadTubNumber = reloadTubNumber + 1;
                    if(tabs.length == reloadTubNumber) {
                        reloadTubNumber = 1;
                    }
                }
                tubNumber = tubNumber + 1;
                if(tabs.length == tubNumber) {
                    tubNumber = 1;
                }
            }); 
        } else {
            clearInterval(mainInterval);
        }
    }, interval*1000)
}


if(btn != null) {
    btn.onclick = (el) => {
        if (!inWork && document.getElementById('timer').value >= 0) {
            btn.innerText = "стоп";
            inWork = true;
            first_pass = false;
            reloadTubNumber = 1;
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
