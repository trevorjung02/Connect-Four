// Initializes the materialize select elements 
document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems);
});

// Takes form values and redirects to game page with query parameters.
function createGame() {
    let elem = document.querySelector('select');
    let instance = M.FormSelect.init(elem);
    let opponent = instance.getSelectedValues()[0];
    console.log(opponent);
    if (opponent != "") {
        window.location.href = "/game?opponent=" + opponent;
    }
}  