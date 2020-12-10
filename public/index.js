document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems);
});

function createGame() {
    let elem = document.querySelector('select');
    let instance = M.FormSelect.init(elem);
    let opponent = instance.getSelectedValues()[0];
    console.log(opponent);
    if (opponent != "") {
        window.location.href = "/game?opponent=" + opponent;
    }
}  