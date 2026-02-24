document.addEventListener("DOMContentLoaded", () => {
    listarFruteiras();

    document.getElementById("formFruteira").addEventListener("submit", function (e) {
        e.preventDefault();

        let fruteiras = JSON.parse(localStorage.getItem("fruteiras")) || [];

        const id = document.getElementById("idFruteira").value;

        if (id) {
            // EDITAR
            fruteiras = fruteiras.map(f => {
                if (f.id == id) {
                    f.nomePopular = document.getElementById("nomePopular").value;
                    f.nomeCientifico = document.getElementById("nomeCientifico").value;
                    f.producao = document.getElementById("producao").value;
                    f.dataPlantio = document.getElementById("dataPlantio").value;
                }
                return f;
            });
        } else {
            // NOVO CADASTRO
            const fruteira = {
                id: Date.now(),
                nomePopular: document.getElementById("nomePopular").value,
                nomeCientifico: document.getElementById("nomeCientifico").value,
                producao: document.getElementById("producao").value,
                dataPlantio: document.getElementById("dataPlantio").value
            };
            fruteiras.push(fruteira);
        }

        localStorage.setItem("fruteiras", JSON.stringify(fruteiras));
        document.getElementById("formFruteira").reset();
        document.getElementById("idFruteira").value = "";

        listarFruteiras();

        let modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastro'));
        modal.hide();
    });
});

function calcularIdade(dataPlantio) {
    const plantio = new Date(dataPlantio);
    const hoje = new Date();

    let meses = (hoje.getFullYear() - plantio.getFullYear()) * 12;
    meses += hoje.getMonth() - plantio.getMonth();

    return meses;
}

function listarFruteiras() {
    const lista = document.getElementById("listaFruteiras");
    lista.innerHTML = "";

    let fruteiras = JSON.parse(localStorage.getItem("fruteiras")) || [];

    if (fruteiras.length === 0) {
        lista.innerHTML = `
            <div class="text-center mt-5">
                <h5 class="text-muted">Nenhuma fruteira cadastrada.</h5>
            </div>
        `;
        return;
    }

    fruteiras.forEach(fruteira => {
        lista.innerHTML += `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm border-0">
                <div class="card-body">
                    <h5 class="card-title text-success fw-bold">${fruteira.nomePopular}</h5>
                    <p class="card-text">
                        <strong>ID:</strong> ${fruteira.id}<br>
                        <strong>Nome Científico:</strong> ${fruteira.nomeCientifico}<br>
                        <strong>Produção:</strong> ${fruteira.producao} Kg<br>
                        <strong>Plantio:</strong> ${fruteira.dataPlantio}<br>
                        <strong>Idade:</strong> ${calcularIdade(fruteira.dataPlantio)} meses
                    </p>

                    <div class="d-flex justify-content-between">
                        <button class="btn btn-warning btn-sm" onclick="editarFruteira(${fruteira.id})">
                            ✏ Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="excluirFruteira(${fruteira.id})">
                            🗑 Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
}

function editarFruteira(id) {
    let fruteiras = JSON.parse(localStorage.getItem("fruteiras")) || [];
    const fruteira = fruteiras.find(f => f.id == id);

    document.getElementById("idFruteira").value = fruteira.id;
    document.getElementById("nomePopular").value = fruteira.nomePopular;
    document.getElementById("nomeCientifico").value = fruteira.nomeCientifico;
    document.getElementById("producao").value = fruteira.producao;
    document.getElementById("dataPlantio").value = fruteira.dataPlantio;

    new bootstrap.Modal(document.getElementById('modalCadastro')).show();
}

function excluirFruteira(id) {
    if (confirm("Deseja realmente excluir esta fruteira?")) {
        let fruteiras = JSON.parse(localStorage.getItem("fruteiras")) || [];
        fruteiras = fruteiras.filter(f => f.id != id);
        localStorage.setItem("fruteiras", JSON.stringify(fruteiras));
        listarFruteiras();
    }
}