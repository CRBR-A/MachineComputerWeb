
function populateNumbers() {
    var clock = document.getElementById("clock");
    var clockNumConstantTransforms = "translateX(calc(var(--clock-width)/2))";
    for(let i = 1; i <= 12; i++) {
        let div = document.createElement("div");
        div.classList.add("clock-num");
        let deg = i * 30;
        div.style.transform = `${clockNumConstantTransforms} rotate(${deg}deg) translateY(10px)`;
        let innerDiv = document.createElement("div");
        innerDiv.innerText = i.toString();
        innerDiv.style.transform = `rotate(${-deg}deg)`;
        let offsetX = i >= 3 && i <= 9 ? 5 : -5;
        innerDiv.style.translate = `${offsetX}px`;
        div.appendChild(innerDiv);
        clock.appendChild(div);
    }

    var clockGraduationConstantTransforms = "translate(calc(var(--clock-width)/2), 0px)";
    for(let i = 1; i <= 60; i++) {
        let div = document.createElement("div");
        div.classList.add("clock-graduation");
        let deg = i * 6;
        div.style.transform = `${clockGraduationConstantTransforms} rotate(${deg}deg)`;
        let innerDiv = document.createElement("div");
        if(i % 5 == 0) {
            innerDiv.style.width = '2.5px';
        }
        div.appendChild(innerDiv);
        clock.appendChild(div);
    }
}

function randRange(min, max) {
    return min + Math.random() * (max - min)
}

// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function updateHands(date) {
    var constantTransforms = "translate(calc(var(--clock-width)/2), calc(var(--clock-width)/2))";
    var initialDegree = -90;
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var hoursDegree = initialDegree + (hours + minutes / 60 + seconds / 3600) * 30;
    var minutesDegree = initialDegree + (minutes + seconds / 60) * 6;
    var secondsDegree = initialDegree + seconds * 6;
    var hourHand = document.getElementById("hour-hand");
    var minuteHand = document.getElementById("minute-hand");
    var secondHand = document.getElementById("second-hand");
    hourHand.style.transform = `${constantTransforms} rotate(${hoursDegree}deg)`;
    minuteHand.style.transform = `${constantTransforms} rotate(${minutesDegree}deg)`;
    secondHand.style.transform = `${constantTransforms} rotate(${secondsDegree}deg)`;

    if(hours == 0 && minutes == 0 && seconds == 0) {
        var clock = document.getElementById("clock");
        clock.style.filter = 'saturate(100) hue-rotate(100deg)';
        for(let i = 0; i < 50; i++) {
            let el = htmlToElement(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#8a0303" class="drop" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6zM6.646 4.646c-.376.377-1.272 1.489-2.093 3.13l.894.448c.78-1.559 1.616-2.58 1.907-2.87l-.708-.708z"/>
                </svg>`);
            el.style.position = 'absolute';
            let left = i * randRange(0, 6)
            el.style.left = `${left}%`;
            document.body.appendChild(el)
            el.animate(
                [
                    {
                        transform: 'translateY(0vh)'
                    },
                    {
                        transform: 'translateY(100vh)'
                    }
                ],
                {
                    duration: randRange(250, 500),
                    iterations: Infinity
                }
            );
            document.body.animate(
                [
                    {
                        backgroundColor: 'rgba(0,0,0,0)',
                        filter: 'contrast(0%)'
                    },
                    {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        filter: 'contrast(1000%)'
                    }
                ],
                {
                    duration: 1000,
                    iterations: 1,
                    fill: 'forwards'
                }
            );
        }
    }
}

function updateDisplay() {
    var date = new Date();
    updateHands(date);
}

populateNumbers();
updateDisplay();
var updateDisplayIntervalID  = setInterval(updateDisplay, 1000);
