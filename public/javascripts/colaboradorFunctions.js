function excluirColaborador() {
    fetch(`/colaboradores/`, { method: "DELETE" })
        .then(() => {
            window.location.href = '/logout';
        })
        .catch((error) => {
            console.error(error);
        });
}

