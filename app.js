const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

let data = null;
try {
  data = JSON.parse(sourceJson);
} catch (err) {
  data = null;
}

const showProgramButton = document.querySelector('#show-program');
const programBlock = document.querySelector('#program');
const serviceForm = document.querySelector('#service-form');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const resultBlock = document.querySelector('#result');
const reportJsonBlock = document.querySelector('#report-json');

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const flags = { guide: guideChecked, audio: audioChecked, catalog: catalogChecked };
  const chosen = services.filter(function (service) {
    return flags[service.id] === true;
  });
  const items = chosen.map(function ({ title, price }) {
    return { title: title.trim(), price: price };
  });
  const total = items.reduce(function (sum, { price }) {
    return sum + price;
  }, 0);
  return {
    count: items.length,
    total: total,
    items: items
  };
}

if (data === null) {
  dataError.hidden = false;
  serviceForm.hidden = true;
} else {
  serviceForm.hidden = false;

  showProgramButton.addEventListener('click', function () {
    programBlock.innerHTML = data.event.meeting;
    programBlock.hidden = false;
  });

  serviceForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const guideChecked = document.querySelector('#guide').checked;
    const audioChecked = document.querySelector('#audio').checked;
    const catalogChecked = document.querySelector('#catalog').checked;

    const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

    if (report.count === 0) {
      choiceError.hidden = false;
      resultBlock.hidden = true;
      reportJsonBlock.hidden = true;
      return;
    }

    choiceError.hidden = true;

    const lines = [
      'Выбрано услуг: ' + report.count,
      'Итого: ' + report.total + ' руб.'
    ];
    report.items.forEach(function (item) {
      lines.push(item.title);
    });
    resultBlock.innerHTML = lines.join('<br>');

    const jsonString = JSON.stringify(report);
    JSON.parse(jsonString);
    reportJsonBlock.textContent = jsonString;

    resultBlock.hidden = false;
    reportJsonBlock.hidden = false;
  });
}
