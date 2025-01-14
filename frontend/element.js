

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

    // Lokaler Speicher für Einträge einmalig 
    //let entries = JSON.parse(localStorage.getItem("entries")) || []; //auskommentieren, um server mit fetch zuzugreifen
    //statt aus localstorage, mit fetch, im Web API gucken 

    // Einträge vom Server abrufen
    const fetchEntries = async () => {
    const response = await fetch("http://127.0.0.1:3000/film");
    entries = await response.json();
    displayEntries();
};

// Einträge anzeigen
const displayEntries = () => {
    // Alle vorhandenen Einträge löschen (außer dem "+ Hinzufügen"-Button)
    const allEntries = Array.from(grid.children);
    allEntries.forEach((child) => {
        if (child.id !== "addButton") {
            grid.removeChild(child);
        }
    });
      // Neue Einträge anzeigen
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
                <button class="edit" data-id="${entry._id}">Bearbeiten</button>
                <button class="delete" data-id="${entry._id}">Löschen</button>
            </div>
        `;
        grid.insertBefore(entryDiv, addButton);
    });
};

// Sterne-Bewertung generieren
const generateStarsHTML = (rating) => {
    let starsHTML = "";
    for (let i = 5; i > 0; i--) {
        starsHTML += `<label title="${i} stars">${i <= rating ? "★" : "☆"}</label>`;
    }
    return starsHTML;
};

// Eintrag hinzufügen
const addEntry = async (entry) => {
    const response = await fetch("http://127.0.0.1:3000/film", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
    });

    if (response.ok) {
        await fetchEntries(); // Neue Daten abrufen und anzeigen
    }
};

// Eintrag bearbeiten
const updateEntry = async (id, updatedEntry) => {
    const response = await fetch("http://127.0.0.1:3000/film", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updatedEntry }),
    });

    if (response.ok) {
        await fetchEntries(); // Neue Daten abrufen und anzeigen
    }
};

// Eintrag löschen
const deleteEntry = async (id) => {
    const response = await fetch(`http://127.0.0.1:3000/film?id=${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        await fetchEntries(); // Neue Daten abrufen und anzeigen
    }
};

// Popup-Felder leeren
const clearPopupFields = () => {
    popupFields.imageURL.value = "";
    popupFields.name.value = "";
    popupFields.description.value = "";
    popupFields.genre.value = "";
    popupFields.notes.value = "";
    popupFields.stars.forEach((star) => (star.checked = false));
};

// Popup-Fenster öffnen
addButton.addEventListener("click", () => {
    popup.style.display = "block";
});

// Popup-Fenster schließen und neuen Eintrag hinzufügen
popupSubmit.onclick = () => {
    const rating = Array.from(popupFields.stars).find((star) => star.checked)?.value || 0;
    const newEntry = {
        imageURL: popupFields.imageURL.value,
        name: popupFields.name.value,
        description: popupFields.description.value,
        genre: popupFields.genre.value,
        notes: popupFields.notes.value,
        rating: parseInt(rating),
    };
    addEntry(newEntry);
    clearPopupFields();
    popup.style.display = "none";
};

// Aktionen: Bearbeiten oder Löschen
grid.addEventListener("click", (event) => {
    const target = event.target;
    const id = target.dataset.id;

    if (target.classList.contains("delete")) {
        deleteEntry(id);
    } else if (target.classList.contains("edit")) {
        const entry = entries.find((entry) => entry._id === id);
        if (entry) {
            popupFields.imageURL.value = entry.imageURL;
            popupFields.name.value = entry.name;
            popupFields.description.value = entry.description;
            popupFields.genre.value = entry.genre;
            popupFields.notes.value = entry.notes;
            popupFields.stars.forEach((star) => (star.checked = star.value == entry.rating));

            popup.style.display = "block";

            popupSubmit.onclick = () => {
                const updatedEntry = {
                    imageURL: popupFields.imageURL.value,
                    name: popupFields.name.value,
                    description: popupFields.description.value,
                    genre: popupFields.genre.value,
                    notes: popupFields.notes.value,
                    rating: parseInt(
                        Array.from(popupFields.stars).find((star) => star.checked)?.value || 0
                    ),
                };
                updateEntry(id, updatedEntry);
                clearPopupFields();
                popup.style.display = "none";
                popupSubmit.onclick = null; // Event-Handler zurücksetzen
            };
        }
    }
});

// Initialisierung: Einträge abrufen und anzeigen
fetchEntries();
});
 
