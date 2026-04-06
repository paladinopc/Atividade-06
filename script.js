let db = {};

// Carregar dados simulando fetch de API
async function loadData() {
    try {
        const response = await fetch('dados.json');
        db = await response.json();
        showSection('competidores'); // Tela inicial
    } catch (e) {
        console.error("Erro ao carregar JSON. Certifique-se de usar um servidor local (Live Server).", e);
    }
}

function showSection(section) {
    const main = document.getElementById('content');
    main.innerHTML = `<h2>${section.toUpperCase()}</h2>`;

    if (section === 'competidores') {
        renderForm('Cadastrar Competidor', ['nome'], (data) => {
            db.competidores.push({ id: Date.now(), ...data });
            showSection('competidores');
        });
        renderTable(db.competidores, ['id', 'nome']);
    } 
    
    else if (section === 'times') {
        renderForm('Cadastrar Time', ['nome'], (data) => {
            db.times.push({ id: Date.now(), nome: data.nome, membros: [] });
            showSection('times');
        });
        renderTable(db.times, ['id', 'nome']);
    }

    else if (section === 'jogos') {
        renderForm('Cadastrar Jogo', ['nome'], (data) => {
            db.jogos.push({ id: Date.now(), ...data });
            showSection('jogos');
        });
        renderTable(db.jogos, ['id', 'nome']);
    }

    else if (section === 'confrontos') {
        renderConfrontoForm();
        renderConfrontosTable();
    }
}

function renderForm(title, fields, onSubmit) {
    const container = document.getElementById('content');
    const form = document.createElement('form');
    form.innerHTML = `<h3>${title}</h3>`;
    
    fields.forEach(f => {
        form.innerHTML += `<input type="text" id="${f}" placeholder="${f}" required>`;
    });

    const btn = document.createElement('button');
    btn.innerText = "Salvar";
    btn.className = "save";
    btn.type = "submit";
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const data = {};
        fields.forEach(f => data[f] = document.getElementById(f).value);
        onSubmit(data);
    };

    form.appendChild(btn);
    container.appendChild(form);
}

function renderTable(data, keys) {
    const table = document.createElement('table');
    table.innerHTML = `<thead><tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr></thead>`;
    const tbody = document.createElement('tbody');
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = keys.map(k => `<td>${item[k]}</td>`).join('');
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    document.getElementById('content').appendChild(table);
}

function renderConfrontoForm() {
    const container = document.getElementById('content');
    const div = document.createElement('div');
    div.className = "card";
    div.innerHTML = `
        <h3>Registrar Confronto</h3>
        <select id="jogoId">${db.jogos.map(j => `<option value="${j.id}">${j.nome}</option>`)}</select>
        <select id="timeA">${db.times.map(t => `<option value="${t.id}">${t.nome}</option>`)}</select>
        <input type="number" id="placarA" placeholder="Placar Time A">
        <span> VS </span>
        <input type="number" id="placarB" placeholder="Placar Time B">
        <select id="timeB">${db.times.map(t => `<option value="${t.id}">${t.nome}</option>`)}</select>
        <button class="save" onclick="saveConfronto()">Registrar Resultado</button>
    `;
    container.appendChild(div);
}

function saveConfronto() {
    const c = {
        id: Date.now(),
        idJogo: parseInt(document.getElementById('jogoId').value),
        idTimeA: parseInt(document.getElementById('timeA').value),
        idTimeB: parseInt(document.getElementById('timeB').value),
        placarA: parseInt(document.getElementById('placarA').value),
        placarB: parseInt(document.getElementById('placarB').value)
    };
    c.vencedor = c.placarA > c.placarB ? c.idTimeA : (c.placarB > c.placarA ? c.idTimeB : null);
    db.confrontos.push(c);
    showSection('confrontos');
}

function renderConfrontosTable() {
    const container = document.getElementById('content');
    const table = document.createElement('table');
    table.innerHTML = `<thead><tr><th>Jogo</th><th>Confronto</th><th>Placar</th><th>Vencedor</th></tr></thead>`;
    
    db.confrontos.forEach(conf => {
        const jogo = db.jogos.find(j => j.id === conf.idJogo)?.nome;
        const timeA = db.times.find(t => t.id === conf.idTimeA)?.nome;
        const timeB = db.times.find(t => t.id === conf.idTimeB)?.nome;
        const vencedor = conf.vencedor ? db.times.find(t => t.id === conf.vencedor)?.nome : 'Empate';
        
        const row = document.createElement('tr');
        row.innerHTML = `<td>${jogo}</td><td>${timeA} vs ${timeB}</td><td>${conf.placarA} x ${conf.placarB}</td><td><strong>${vencedor}</strong></td>`;
        table.appendChild(row);
    });
    container.appendChild(table);
}

loadData();