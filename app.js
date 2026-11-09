"use strict";

// Исходные данные задания (сохранены без изменений).
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

function parseSource() {
  try {
    return JSON.parse(sourceJson);
  } catch (err) {
    return null;
  }
}

// Отчёт по выбранным услугам: filter -> map (деструктуризация, trim) -> reduce.
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked,
  };

  const items = services
    .filter((service) => selected[service.id])
    .map(({ title, price }) => ({ title: title.trim(), price }));

  const total = items.reduce((sum, { price }) => sum + price, 0);

  return { count: items.length, total, items };
}

const ui = {
  programButton: document.querySelector("#show-program"),
  program: document.querySelector("#program"),
  form: document.querySelector("#service-form"),
  guide: document.querySelector("#guide"),
  audio: document.querySelector("#audio"),
  catalog: document.querySelector("#catalog"),
  choiceError: document.querySelector("#choice-error"),
  dataError: document.querySelector("#data-error"),
  result: document.querySelector("#result"),
  reportJson: document.querySelector("#report-json"),
};

// Показ итога и JSON-строки, скрытие ошибки выбора.
function showResult(report) {
  const titles = report.items.map(({ title }) => title).join("<br>");
  ui.result.innerHTML =
    "Выбрано услуг: " +
    report.count +
    "<br>Итого: " +
    report.total +
    " руб.<br>" +
    titles;

  // JSON.stringify, проверка обратным JSON.parse
  ui.reportJson.textContent = JSON.stringify(
    JSON.parse(JSON.stringify(report)),
  );

  ui.choiceError.hidden = true;
  ui.result.hidden = false;
  ui.reportJson.hidden = false;
}

// Ошибка пустого выбора: итог и JSON скрыты.
function showChoiceError() {
  ui.choiceError.textContent = "Выберите хотя бы одну услугу.";
  ui.result.hidden = true;
  ui.reportJson.hidden = true;
  ui.choiceError.hidden = false;
}

function onShowProgramClick() {
  const data = parseSource();
  if (data === null) {
    return;
  }
  ui.program.innerHTML = data.event.meeting;
  ui.program.hidden = false;
}

function onFormSubmit(event) {
  event.preventDefault();

  const data = parseSource();
  if (data === null) {
    return;
  }

  const report = buildReport(
    data.services,
    ui.guide.checked,
    ui.audio.checked,
    ui.catalog.checked,
  );

  if (report.count === 0) {
    showChoiceError();
  } else {
    showResult(report);
  }
}

// Запуск: при повреждённом JSON — ошибка данных, при корректном — видна только форма.
const data = parseSource();

if (data === null) {
  ui.dataError.textContent = "Ошибка данных.";
  ui.dataError.hidden = false;
} else {
  ui.form.hidden = false;
}

ui.programButton.addEventListener("click", onShowProgramClick);
ui.form.addEventListener("submit", onFormSubmit);
