/*let element = document.getElementById('imageURL'); /*id wurde übernommen*
element.style.color = "purple"; 
element.value = "hey"; /*hey wird eingefügt*

let element3 = document.getElementById('Bearbeiten'); /*ID Bearbeiten übernommen*
element3.addEventListener ('click', onclick);
function onclick (event) {
    element3.style.color = "pink";
}

let element2 = document.querySelector(".entry-footer");
element2.innerHTML = "<p> What's up? </p>"; /*in dem html wird das ganze Text übernommen

let newelement = document.createElement("p");
newelement.textContent = "heyhey";
element2.append (newelement);*/


/*
let film = [{
    title: "Black Panther",
    beschreibung: "Black Panther is eine Science-Fiction-Actionfilm mit dem Hauptcharaketer T'Challa",
    genre: "Science-Fiction",
    notizen: "Ich mag diesen Film sehr, da sie die Kultur von...",
    stars: 5
}]

console.log(film);
let filmliste = document.querySelector (".entry-footer");
/*filmliste.innerHTML = "<h4>" + film.title + "</h4>" + "<p>" + film.beschreibung + "</p>"; /*ersetzt alles in dem entry-footer mit black panther*/

for (let h4 of film) {
    filmliste.innerHTML += "<h4>" + h4.title + "</h4>" + "<p>" + h4.beschreibung + "</p>"; 
    }

    for (let p of film) {
        let h4 = document.createElement("h4");
        h4.textContent = p.beschreibung;
        let pElement = document.createElement("p");
        pElement.textContent = p.beschreibung; 

        filmliste.append(h4, pElement);
    }

let filmJSON = JSON.stringify(film);
localStorage.setItem("film", filmJSON);

console.log("hi");
