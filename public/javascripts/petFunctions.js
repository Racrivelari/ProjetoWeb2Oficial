function excluirPet(id, nome) {
    fetch(`/pets/${id}/${nome}`, { method: "DELETE" })
        .then(() => {
            location.href = location.href;
        })
        .catch((error) => {
            console.error(error);
        });
}

function editarPet(id) {
    window.location.href = `/pets/editarPet/${id}`;
}

function exportToPdf() {
    const tabelaPets = document.getElementById("tabela-pets");
    const rows = tabelaPets.getElementsByTagName("tr");

    // Cria um novo documento PDF
    const doc = new window.jspdf.jsPDF();

    // Define a posição inicial do conteúdo no PDF
    let y = 20;

    // Cria um array para armazenar os dados das células
    const tableData = [];

    // Itera sobre cada linha da tabela
    for (const row of rows) {
        const cells = row.getElementsByTagName("td");
        let includeCell = true;
        const rowData = [];

        for (let i = 0; i < cells.length - 1; i++) {
            const cell = cells[i];
            const cellText = cell.textContent.trim();
            rowData.push(cellText);
        }

        if (includeCell) {
            tableData.push(rowData);
        }
    }

    // Define a largura das colunas
    const columnWidths = [50, 25, 20, 25, 25, 20, 25];

    // Gera a tabela no PDF
    doc.autoTable({
        startY: y,
        head: [["ID", "Nome", "Idade", "Porte", "Tipo", "Peso", "Cliente"]],
        body: tableData,
        columnStyles: {
            0: { cellWidth: columnWidths[0] },
            1: { cellWidth: columnWidths[1] },
            2: { cellWidth: columnWidths[2] },
            3: { cellWidth: columnWidths[3] },
            4: { cellWidth: columnWidths[4] },
            5: { cellWidth: columnWidths[5] },
            6: { cellWidth: columnWidths[6] },
        },
        didDrawPage: function (data) {
            // Adiciona a largura da tabela ao PDF
            doc.setPage(data.pageCount);
            y = data.cursor.y + 10;
        }
    });

    // Salva o PDF e faz o download
    doc.save("Pets.pdf");
}