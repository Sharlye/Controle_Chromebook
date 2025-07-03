const form = document.getElementById('formulario');
const tabela = document.getElementById('tabelaRegistros');
const filtroEscola = document.getElementById('filtroEscola');
const filtroData = document.getElementById('filtroData');
const darkModeToggle = document.getElementById('darkModeToggle');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const novoRegistro = {
    escola: document.getElementById('escola').value,
    inep: document.getElementById('inep').value,
    modelo: document.getElementById('modelo').value,
    quantidade: parseInt(document.getElementById('quantidade').value),
    data: document.getElementById('dataEntrega').value,
  };

  await fetch('/api/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoRegistro),
  });

  form.reset();
  carregarRegistros();
});

async function carregarRegistros() {
  const resposta = await fetch('/api/registros');
  const dados = await resposta.json();

  const filtroNome = filtroEscola.value.toLowerCase();
  const filtroDataValor = filtroData.value;

  tabela.innerHTML = '';
  dados
    .filter(r =>
      r.escola.toLowerCase().includes(filtroNome) &&
      (!filtroDataValor || r.data === filtroDataValor)
    )
    .forEach(reg => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${reg.escola}</td>
        <td>${reg.inep}</td>
        <td>${reg.modelo}</td>
        <td>${reg.quantidade}</td>
        <td>${reg.data}</td>
      `;
      tabela.appendChild(row);
    });
}

filtroEscola.addEventListener('input', carregarRegistros);
filtroData.addEventListener('change', carregarRegistros);
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

carregarRegistros();
