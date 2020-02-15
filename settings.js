const QUERY_ITEM_NAME = "unsplashQueryText";

// Saves options to chrome.storage
const save_options = () => {
    var queryText = document.getElementById('queryText').value;
    localStorage.setItem(QUERY_ITEM_NAME, queryText);
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
}
  
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restore_options = () => {
    var queryText = localStorage.getItem(QUERY_ITEM_NAME);
    if (!queryText) {
        queryText = "";
    }
    document.getElementById("queryText").value = queryText;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);