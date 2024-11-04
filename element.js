let element = document.getElementById('imageURL'); /*id wurde übernommen*/
element.style.color = "purple"; 
element.value = "hey"; /*hey wird eingefügt*/

let element3 = document.getElementById('Bearbeiten'); /*ID Bearbeiten übernommen*/
element3.addEventListener ('click', onclick);
function onclick (event) {
    element3.style.color = "pink";
}


/*let element2 = document.querySelector(".entry-footer");
element2.innerHTML = "<p> What's up? </p>"; /*in dem html wird das ganze Text übernommen

let newelement = document.createElement("p");
newelement.textContent = "heyhey";
element2.append (newelement);*/