const QUERY_ITEM_NAME = "unsplashQueryText";

// Saves options to chrome.storage
export const saveOptions = (ref) => {
    console.log("Saving options...");
    var queryText = ref.value;
    localStorage.setItem(QUERY_ITEM_NAME, queryText);
    localStorage.setItem("photos", "[]"); // clear the cache
}
  
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
export const restoreOptions = (ref) => {
    console.log("Restoring options...");
    var queryText = localStorage.getItem(QUERY_ITEM_NAME);
    if (!queryText) {
        queryText = "";
    }
    ref.value = queryText;
    console.log("Restored to", ref.value);
}