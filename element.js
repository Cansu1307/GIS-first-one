/*async function requestTextWithGET(url) {
    const response = await fetch(url); //kommt in die Clientseite (clientseite ist HTML, CSS und Javascripts)
    console.log('Response:', response); // vollständiges Response-Objekt
    const text = await response.text();
    console.log('Response-Text:', text); // Text aus dem Response-Body
  }
  //fetch soll immer dann auftauchen sobald es im code auftaucht
  requestTextWithGET('http://127.0.0.1:3000');
  console.log('Zwischenzeitlich weiterarbeiten...');*/

document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("addButton");
    const popup = document.getElementById("popup");
    const popupSubmit = document.getElementById("popupSubmit");
    const grid = document.getElementById("grid");
    const createFolderBtn = document.getElementById("createFolderBtn");
    const folderPopup = document.getElementById("folderPopup");
    const folderPopupSave = document.getElementById("folderPopupSave");
    const folderPopupCancel = document.getElementById("folderPopupCancel");
    const popupFields = {
        imageURL: document.getElementById("popupImageURL"),
        name: document.getElementById("popupName"),
        description: document.getElementById("popupDescription"),
        genre: document.getElementById("popupGenre"),
        notes: document.getElementById("popupNotes"),
        stars: document.getElementsByName("popupRating"),
    };

    // Lokaler Speicher für Einträge
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
 
    // sollte eig popup für ordner zeigen, idk what happened
  createFolderBtn.addEventListener("click", () => {
    folderPopup.style.display = "block";
});

// Schließt Pop-up, wenn "Abbrechen" geklickt wird
folderPopupCancel.addEventListener("click", () => {
    folderPopup.style.display = "none";
});

// save the folder 
folderPopupSave.addEventListener("click", () => {
    const folderName = document.getElementById("folderNameInput").value;
    if (folderName) {
        alert(`Ordner "${folderName}" erstellt!`);
        folderPopup.style.display = "none";
    } else {
        alert("Bitte einen Ordnernamen eingeben!");
    }
});
    // Einträge anzeigen
    const displayEntries = () => {
        // Entferne mein Beispiele von black panther in HTML, außer dem "+ Hinzufügen"-Button
        const allEntries = Array.from(grid.children);
        allEntries.forEach(child => {
            if (child.id !== "addButton") {
                grid.removeChild(child);
            }
        });
        //soll anzegen
        entries.forEach((entry, index) => {
            const entryDiv = document.createElement("div");
            entryDiv.classList.add("entry-footer");
            entryDiv.innerHTML = `
                <img src="${entry.imageURL}" alt="Bild des Films" style="width: 100%; height: auto;">
                <h4>${entry.name}</h4>
                <p>${entry.description}</p>
                <p>${entry.genre}</p>
                <p>${entry.notes}</p>
                <div class="stars">${generateStarsHTML(entry.rating)}</div>
                <div class="actions">
                    <button class="edit" data-index="${index}">Bearbeiten</button>
                    <button class="delete" data-index="${index}">Löschen</button>
                </div>
            `;
            grid.insertBefore(entryDiv, addButton);
        });
    };

    // Sterne-Bewertung machen
    const generateStarsHTML = (rating) => {
        let starsHTML = "";
        for (let i = 5; i > 0; i--) {
            starsHTML += `<label title="${i} stars">${i <= rating ? "★" : "☆"}</label>`;
        }
        return starsHTML;
    };

    // Eintrag hinzufügen
    const addEntry = (entry) => {
        entries.push(entry);
        saveEntries();
        displayEntries();
    };

    // Einträge speichern hopefully, idk if it functions tbh
    const saveEntries = () => {
        localStorage.setItem("entries", JSON.stringify(entries));
    };

    // Popup-Felder leer damit man selbst einfuügen kann
    const clearPopupFields = () => {
        popupFields.imageURL.value = "";
        popupFields.name.value = "";
        popupFields.description.value = "";
        popupFields.genre.value = "";
        popupFields.notes.value = "";
        popupFields.stars.forEach(star => star.checked = false);
    };

    // Popup-Fenster soll sich öffnen
    addButton.addEventListener("click", () => {
        popup.style.display = "block";
    });

    // Popup-Fenster schließen und Eintrag hinzufügen
    popupSubmit.addEventListener("click", () => { //vor add. 
        const rating = Array.from(popupFields.stars).find(star => star.checked)?.value || 0;
        const newEntry = {
            imageURL: popupFields.imageURL.value, //einträge bleiben von oben eingegeben
            name: popupFields.name.value,
            description: popupFields.description.value,
            genre: popupFields.genre.value,
            notes: popupFields.notes.value,
            rating: parseInt(rating),
        };
        addEntry(newEntry); //neues hinzufügen feld erscheint
        clearPopupFields();
        popup.style.display = "none";
    });

    // Aktionen bearbeiten/löschen für Ordner... sollte funktionieren aber ich kann ordner nicht sehen
    grid.addEventListener("click", (event) => {
        const target = event.target;
        const index = target.dataset.index;
        if (target.classList.contains("delete")) {
            entries.splice(index, 1);
            saveEntries();
            displayEntries();
        } else if (target.classList.contains("edit")) {
            const entry = entries[index];
            popupFields.imageURL.value = entry.imageURL;
            popupFields.name.value = entry.name;
            popupFields.description.value = entry.description;
            popupFields.genre.value = entry.genre;
            popupFields.notes.value = entry.notes;
            popupFields.stars.forEach(star => star.checked = star.value == entry.rating);
            popup.style.display = "block";

            // Update-bearbeitung für Eintrag
            popupSubmit.onclick = () => {
                const rating = Array.from(popupFields.stars).find(star => star.checked)?.value || 0;
                entries[index] = {
                    imageURL: popupFields.imageURL.value,
                    name: popupFields.name.value,
                    description: popupFields.description.value,
                    genre: popupFields.genre.value,
                    notes: popupFields.notes.value,
                    rating: parseInt(rating),
                };
                saveEntries();
                displayEntries();
                clearPopupFields();
                popup.style.display = "none";
                popupSubmit.onclick = null; // muss man vlt ändern damit bearbeitetts gleiche stelle bleibt? nicht .onlick sondern event listen
            };
        }
    });

    // Initialisierung
    displayEntries();
});
