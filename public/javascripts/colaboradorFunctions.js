function excluirColaborador() {
    fetch(`/colaboradores/`, { method: "DELETE" })
        .then(() => {
            // location.href = location.href;
            window.location.href = '/logout';
        })
        .catch((error) => {
            console.error(error);
        });
}

// function editarConta(id) {
//   window.location.href = `/perfil/editarConta/${id}`;
// }
