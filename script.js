const form = document.querySelector("#requestForm");
const output = document.querySelector("#output");
const copyButton = document.querySelector("#copyButton");
const kakaoCopyButton = document.querySelector("#kakaoCopyButton");
const insurerCopyButton = document.querySelector("#insurerCopyButton");
const pdfButton = document.querySelector("#pdfButton");
const excelButton = document.querySelector("#excelButton");
const copyStatus = document.querySelector("#copyStatus");
const warningList = document.querySelector("#warningList");
const noticeList = document.querySelector("#noticeList");
const noticeTemplate = document.querySelector("#noticeTemplate");
const addNoticeButton = document.querySelector("#addNoticeButton");
const fiveYearDetails = document.querySelector("#fiveYearDetails");
const fiveYearList = document.querySelector("#fiveYearList");
const fiveYearTemplate = document.querySelector("#fiveYearTemplate");
const addFiveYearButton = document.querySelector("#addFiveYearButton");
const tenYearDetails = document.querySelector("#tenYearDetails");
const tenYearList = document.querySelector("#tenYearList");
const tenYearTemplate = document.querySelector("#tenYearTemplate");
const addTenYearButton = document.querySelector("#addTenYearButton");
const majorOtherToggle = document.querySelector("#majorOtherToggle");
const majorOther = document.querySelector("#majorOther");
const medicationDetails = document.querySelector("#medicationDetails");
const coverageOtherToggle = document.querySelector("#coverageOtherToggle");
const coverageOther = document.querySelector("#coverageOther");
const premiumCustom = document.querySelector("#premiumCustom");
const purposeOtherToggle = document.querySelector("#purposeOtherToggle");
const purposeOther = document.querySelector("#purposeOther");

const fields = {
  designNumber: document.querySelector("#designNumber"),
  customerName: document.querySelector("#customerName"),
  gender: document.querySelector("#gender"),
  birthDate: document.querySelector("#birthDate"),
  job: document.querySelector("#job"),

  insuredName: document.querySelector("#insuredName"),
  contractorName: document.querySelector("#contractorName"),
  legalGuardian: document.querySelector("#legalGuardian"),
  beneficiary: document.querySelector("#beneficiary"),
  relationship: document.querySelector("#relationship"),

  planType: document.querySelector("#planType"),

  requestItems: document.querySelector("#requestItems"),

  medDisease: document.querySelector("#medDisease"),
  medName: document.querySelector("#medName"),
  medPeriod: document.querySelector("#medPeriod"),
};

let noticeIdCounter = 0;
let fiveYearIdCounter = 0;
let tenYearIdCounter = 0;

function getCheckedValues(selector) {
  return [...document.querySelectorAll(selector)]
    .filter((item) => item.checked)
    .map((item) => item.value);
}

function selectedValue(container, selector) {
  return container.querySelector(`${selector}:checked`)?.value ?? "";
}

function splitLines(value) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinRequestItems() {
  return fields.requestItems.value.trim();
}

function toggleElement(element, visible) {
  element.classList.toggle("is-hidden", !visible);
}

function addNotice(prefill = {}) {
  const fragment = noticeTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".notice-card");
  const noticeId = ++noticeIdCounter;

  card.querySelectorAll('[data-notice-field="careType"]').forEach((radio) => {
    radio.name = `careType-${noticeId}`;
  });

  card.querySelectorAll('[data-notice-field="recovery"]').forEach((radio) => {
    radio.name = `recovery-${noticeId}`;
  });

  card.querySelector('[data-notice-field="disease"]').value = prefill.disease ?? "";
  card.querySelector('[data-notice-field="date"]').value = prefill.date ?? "";
  card.querySelector('[data-notice-field="visits"]').value = prefill.visits ?? 1;
  card.querySelector('[data-notice-field="memo"]').value = prefill.memo ?? "";

  if (prefill.careType) {
    const careType = card.querySelector(`[data-notice-field="careType"][value="${prefill.careType}"]`);
    if (careType) careType.checked = true;
  }

  if (prefill.recovery) {
    const recovery = card.querySelector(`[data-notice-field="recovery"][value="${prefill.recovery}"]`);
    if (recovery) recovery.checked = true;
  }

  if (prefill.treatments?.length) {
    prefill.treatments.forEach((treatment) => {
      const checkbox = card.querySelector(`[data-treatment][value="${treatment}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }

  if (prefill.otherTreatment) {
    card.querySelector("[data-treatment-other-toggle]").checked = true;
    card.querySelector("[data-treatment-other]").value = prefill.otherTreatment;
    toggleElement(card.querySelector("[data-treatment-other]"), true);
  }

  noticeList.append(card);
  refreshNoticeNumbers();
  renderOutput();
}

function refreshNoticeNumbers() {
  [...noticeList.querySelectorAll(".notice-card")].forEach((card, index) => {
    card.querySelector("[data-notice-number]").textContent = index + 1;
  });
}

function collectNotice(card) {
  const treatments = [...card.querySelectorAll("[data-treatment]:checked")].map((item) => item.value);
  const otherTreatment = card.querySelector("[data-treatment-other]").value.trim();

  if (otherTreatment) {
    treatments.push(otherTreatment);
  }

  return {
    disease: card.querySelector('[data-notice-field="disease"]').value.trim(),
    date: card.querySelector('[data-notice-field="date"]').value,
    careType: selectedValue(card, '[data-notice-field="careType"]'),
    visits: card.querySelector('[data-notice-field="visits"]').value.trim() || "1",
    treatments,
    recovery: selectedValue(card, '[data-notice-field="recovery"]'),
    memo: card.querySelector('[data-notice-field="memo"]').value.trim(),
  };
}

function collectNotices() {
  return [...noticeList.querySelectorAll(".notice-card")].map(collectNotice);
}

function addFiveYearNotice(prefill = {}) {
  const fragment = fiveYearTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".notice-card");

  card.dataset.fiveYearId = ++fiveYearIdCounter;
  card.querySelector('[data-five-field="type"]').value = prefill.type ?? "입원";
  card.querySelector('[data-five-field="disease"]').value = prefill.disease ?? "";
  card.querySelector('[data-five-field="date"]').value = prefill.date ?? "";
  card.querySelector('[data-five-field="state"]').value = prefill.state ?? "";
  card.querySelector('[data-five-field="detail"]').value = prefill.detail ?? "";

  fiveYearList.append(card);
  refreshFiveYearNumbers();
  renderOutput();
}

function addTenYearNotice(prefill = {}) {
  const fragment = tenYearTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".notice-card");

  card.dataset.tenYearId = ++tenYearIdCounter;
  card.querySelector('[data-ten-field="type"]').value = prefill.type ?? "암";
  card.querySelector('[data-ten-field="disease"]').value = prefill.disease ?? "";
  card.querySelector('[data-ten-field="date"]').value = prefill.date ?? "";
  card.querySelector('[data-ten-field="state"]').value = prefill.state ?? "";
  card.querySelector('[data-ten-field="detail"]').value = prefill.detail ?? "";

  tenYearList.append(card);
  refreshTenYearNumbers();
  renderOutput();
}

function refreshFiveYearNumbers() {
  [...fiveYearList.querySelectorAll(".notice-card")].forEach((card, index) => {
    card.querySelector("[data-five-number]").textContent = index + 1;
  });
}

function refreshTenYearNumbers() {
  [...tenYearList.querySelectorAll(".notice-card")].forEach((card, index) => {
    card.querySelector("[data-ten-number]").textContent = index + 1;
  });
}

function collectFiveYearNotice(card) {
  return {
    type: card.querySelector('[data-five-field="type"]').value,
    disease: card.querySelector('[data-five-field="disease"]').value.trim(),
    date: card.querySelector('[data-five-field="date"]').value,
    state: card.querySelector('[data-five-field="state"]').value.trim(),
    detail: card.querySelector('[data-five-field="detail"]').value.trim(),
  };
}

function collectTenYearNotice(card) {
  return {
    type: card.querySelector('[data-ten-field="type"]').value,
    disease: card.querySelector('[data-ten-field="disease"]').value.trim(),
    date: card.querySelector('[data-ten-field="date"]').value,
    state: card.querySelector('[data-ten-field="state"]').value.trim(),
    detail: card.querySelector('[data-ten-field="detail"]').value.trim(),
  };
}

function collectFiveYear() {
  if (selectedValue(document, 'input[name="fiveYearStatus"]') !== "yes") {
    return [];
  }

  return [...fiveYearList.querySelectorAll(".notice-card")].map(collectFiveYearNotice);
}

function collectTenYear() {
  if (selectedValue(document, 'input[name="tenYearStatus"]') !== "yes") {
    return [];
  }

  return [...tenYearList.querySelectorAll(".notice-card")].map(collectTenYearNotice);
}

function collectMedication() {
  const status = selectedValue(document, 'input[name="medicationStatus"]');
  return {
    status,
    disease: fields.medDisease.value.trim(),
    name: fields.medName.value.trim(),
    period: fields.medPeriod.value.trim(),
  };
}

function buildNoticeLines(notices) {
  if (!notices.length) {
    return ["[3개월 이내]", "고지사항 없음"];
  }

  const lines = ["[3개월 이내]"];

  notices.forEach((notice, index) => {
    lines.push("", `${index + 1}. ${notice.disease || "병명 미입력"}`, "");
    if (notice.date) lines.push(`* ${notice.date}`);
    lines.push(`* ${notice.careType} ${notice.visits}회`);
    if (notice.treatments.length) lines.push(`* ${notice.treatments.join(" / ")}`);
    if (notice.memo) lines.push(`* ${notice.memo}`);
    lines.push(`* ${notice.recovery}`);
  });

  return lines;
}

function buildFiveYearLines() {
  const lines = ["[5년 이내]"];
  const notices = collectFiveYear();

  if (!notices.length) {
    return [...lines, "고지사항 없음"];
  }

  notices.forEach((item, index) => {
    lines.push("", `${index + 1}. ${item.type} - ${item.disease || "병명 미입력"}`, "");
    if (item.date) lines.push(`* ${item.date}`);
    if (item.detail) lines.push(`* ${item.detail}`);
    if (item.state) lines.push(`* 현재상태: ${item.state}`);
  });

  return lines;
}

function buildTenYearLines() {
  const lines = ["[10년 이내]"];
  const notices = collectTenYear();

  if (!notices.length) {
    return [...lines, "고지사항 없음"];
  }

  notices.forEach((item, index) => {
    lines.push("", `${index + 1}. ${item.type} - ${item.disease || "진단명 미입력"}`, "");
    if (item.date) lines.push(`* ${item.date}`);
    if (item.detail) lines.push(`* ${item.detail}`);
    if (item.state) lines.push(`* 현재상태: ${item.state}`);
  });

  return lines;
}

function buildMedicationLine() {
  const medication = collectMedication();

  if (medication.status !== "yes") {
    return "약물 복용 없음";
  }

  const details = [medication.disease, medication.name, medication.period]
    .filter(Boolean)
    .join(" / ");

  return `약물 복용 있음${details ? `: ${details}` : ": 상세내용 확인 필요"}`;
}

function buildMajorDiseaseLine() {
  const diseases = getCheckedValues('input[name="majorDisease"]');
  const other = majorOther.value.trim();

  if (majorOtherToggle.checked && other) {
    diseases.push(other);
  }

  return diseases.length ? `중대질환 확인: ${diseases.join(", ")}` : "중대질환 해당 없음";
}

function collectDesignDirection() {
  const coverages = getCheckedValues('input[name="coverageFocus"]');
  const coverageOtherValue = coverageOther.value.trim();
  const purposes = getCheckedValues('input[name="designPurpose"]');
  const purposeOtherValue = purposeOther.value.trim();
  const premiumValue = selectedValue(document, 'input[name="premiumRange"]');

  if (coverageOtherToggle.checked && coverageOtherValue) {
    coverages.push(coverageOtherValue);
  }

  if (purposeOtherToggle.checked && purposeOtherValue) {
    purposes.push(purposeOtherValue);
  }

  return {
    coverages,
    premium: premiumValue === "custom" ? premiumCustom.value.trim() : premiumValue,
    purposes,
  };
}

function buildDesignDirectionLines() {
  const { coverages, premium, purposes } = collectDesignDirection();

  if (!coverages.length && !premium && !purposes.length) {
    return [];
  }

  const lines = ["[설계 요청사항]", ""];

  if (premium) {
    lines.push(`희망 보험료: ${premium}`, "");
  }

  if (coverages.length) {
    lines.push("아래 보장 위주", "");
    coverages.forEach((coverage) => lines.push(`* ${coverage}`));
    lines.push("");
  }

  if (purposes.length) {
    lines.push(`설계 방향: ${purposes.join(" + ")}`, "");
  }

  

  return lines;
}

function buildOutput({ insurerMode = false } = {}) {
  const lines = [];
  const designDirectionLines = buildDesignDirectionLines();

  if (fields.designNumber.value.trim()) lines.push(`설계번호 : ${fields.designNumber.value.trim()}`);
  lines.push(`고객명 : ${fields.customerName.value.trim()}`);

  if (fields.gender.value) lines.push(`성별 : ${fields.gender.value}`);
  if (fields.birthDate.value.trim()) lines.push(`생년월일 : ${fields.birthDate.value.trim()}`);
  if (fields.job.value.trim()) lines.push(`직업 : ${fields.job.value.trim()}`);
if (fields.insuredName?.value.trim())
  lines.push(`피보험자 : ${fields.insuredName.value.trim()}`);

if (fields.contractorName?.value.trim())
  lines.push(`계약자 : ${fields.contractorName.value.trim()}`);

if (fields.legalGuardian?.value.trim())
  lines.push(`친권자(법정대리인) : ${fields.legalGuardian.value.trim()}`);

if (fields.beneficiary?.value.trim())
  lines.push(`수익자 : ${fields.beneficiary.value.trim()}`);

if (fields.relationship?.value.trim())
  lines.push(`관계 : ${fields.relationship.value.trim()}`);
  const requestText = joinRequestItems();

  lines.push("");

  if (requestText) {
  lines.push(requestText, "");
}

  lines.push(
  ...designDirectionLines,
  ...(designDirectionLines.length ? [""] : []),
  "고지사항",
  "",
  buildMedicationLine(),
  "",
  ...buildNoticeLines(collectNotices()),
  "",
  ...buildFiveYearLines(),
  "",
  ...buildTenYearLines()
);

  return lines.join("\n");
}

function validateForm() {
  const warnings = [];
  const notices = collectNotices();

  if (!fields.customerName.value.trim()) warnings.push("고객명을 입력해주세요.");

  notices.forEach((notice, index) => {
    if (!notice.disease) warnings.push(`${index + 1}번 고지사항의 병명을 입력해주세요.`);
    if (!notice.date) warnings.push(`${index + 1}번 고지사항의 진료일을 선택해주세요.`);
  });

  if (collectMedication().status === "yes") {
    const medication = collectMedication();
    if (!medication.disease || !medication.name || !medication.period) {
      warnings.push("약 복용 정보의 질환명, 약물명, 복용기간을 모두 입력해주세요.");
    }
  }

  if (selectedValue(document, 'input[name="fiveYearStatus"]') === "yes" && !collectFiveYear().length) {
    warnings.push("5년 이내 고지사항을 추가해주세요.");
  }

  collectFiveYear().forEach((item, index) => {
    if (!item.disease) warnings.push(`5년 이내 ${index + 1}번 고지의 병명을 입력해주세요.`);
  });

  if (selectedValue(document, 'input[name="tenYearStatus"]') === "yes" && !collectTenYear().length) {
    warnings.push("10년 이내 고지사항을 추가해주세요.");
  }

  collectTenYear().forEach((item, index) => {
    if (!item.disease) warnings.push(`10년 이내 ${index + 1}번 고지의 진단명/질환명을 입력해주세요.`);
  });

  return warnings;
}

function showWarnings(warnings) {
  warningList.innerHTML = "";
  warnings.forEach((warning) => {
    const item = document.createElement("p");
    item.textContent = warning;
    warningList.append(item);
  });
}

function ensureValid() {
  const warnings = validateForm();
  showWarnings(warnings);

  if (warnings.length) {
    alert(warnings.join("\n"));
    return false;
  }

  return true;
}

function renderOutput() {
  output.textContent = buildOutput();
  showWarnings(validateForm());
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  copyStatus.textContent = successMessage;
  window.setTimeout(() => {
    copyStatus.textContent = "";
  }, 1800);
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function exportExcel() {
  if (!ensureValid()) return;

  const rows = [
    ["항목", "내용"],
    ["설계번호", fields.designNumber.value.trim()],
    ["고객명", fields.customerName.value.trim()],
    ["성별", fields.gender.value],
    ["생년월일", fields.birthDate.value.trim()],
    ["직업", fields.job.value.trim()],
    ["추가 요청사항", splitLines(fields.requestItems.value).join(", ")],
    ["설계 방향", buildDesignDirectionLines().join("\n")],
    ["중대질환", buildMajorDiseaseLine()],
    ["약 복용", buildMedicationLine()],
  ];

  collectNotices().forEach((notice, index) => {
    rows.push([
      `3개월 이내 고지사항 ${index + 1}`,
      [notice.disease, notice.date, `${notice.careType} ${notice.visits}회`, notice.treatments.join(" / "), notice.recovery, notice.memo]
        .filter(Boolean)
        .join(" / "),
    ]);
  });

  const fiveYearRows = collectFiveYear();
  if (fiveYearRows.length) {
    fiveYearRows.forEach((item) => {
      rows.push([`5년 이내 ${item.type}`, [item.disease, item.date, item.detail, item.state].filter(Boolean).join(" / ")]);
    });
  } else {
    rows.push(["5년 이내", "고지사항 없음"]);
  }

  const tenYearRows = collectTenYear();
  if (tenYearRows.length) {
    tenYearRows.forEach((item) => {
      rows.push([`10년 이내 ${item.type}`, [item.disease, item.date, item.detail, item.state].filter(Boolean).join(" / ")]);
    });
  } else {
    rows.push(["10년 이내", "고지사항 없음"]);
  }

  const content = "\ufeff" + rows.map((row) => row.map(escapeCell).join("\t")).join("\n");
  downloadFile(`보험설계_고지사항_${fields.designNumber.value.trim() || "export"}.xls`, content, "application/vnd.ms-excel;charset=utf-8");
}

function handleFormChange(event) {
  if (event.target === majorOtherToggle) {
    toggleElement(majorOther, majorOtherToggle.checked);
  }

  if (event.target === coverageOtherToggle) {
    toggleElement(coverageOther, coverageOtherToggle.checked);
  }

  if (event.target === purposeOtherToggle) {
    toggleElement(purposeOther, purposeOtherToggle.checked);
  }

  if (event.target.name === "premiumRange") {
    toggleElement(premiumCustom, event.target.value === "custom");
  }

  if (event.target.name === "medicationStatus") {
    toggleElement(medicationDetails, event.target.value === "yes");
  }

  if (event.target.name === "fiveYearStatus") {
    toggleElement(fiveYearDetails, event.target.value === "yes");

    if (event.target.value === "yes" && !fiveYearList.querySelector(".notice-card")) {
      addFiveYearNotice();
    }
  }

  if (event.target.name === "tenYearStatus") {
    toggleElement(tenYearDetails, event.target.value === "yes");

    if (event.target.value === "yes" && !tenYearList.querySelector(".notice-card")) {
      addTenYearNotice();
    }
  }

  if (event.target.matches("[data-treatment-other-toggle]")) {
    const card = event.target.closest(".notice-card");
    toggleElement(card.querySelector("[data-treatment-other]"), event.target.checked);
  }

  renderOutput();
}

noticeList.addEventListener("click", (event) => {
  if (!event.target.matches("[data-remove-notice]")) return;
  event.target.closest(".notice-card").remove();
  refreshNoticeNumbers();
  renderOutput();
});

fiveYearList.addEventListener("click", (event) => {
  if (!event.target.matches("[data-remove-five-year]")) return;
  event.target.closest(".notice-card").remove();
  refreshFiveYearNumbers();
  renderOutput();
});

tenYearList.addEventListener("click", (event) => {
  if (!event.target.matches("[data-remove-ten-year]")) return;
  event.target.closest(".notice-card").remove();
  refreshTenYearNumbers();
  renderOutput();
});

addNoticeButton.addEventListener("click", () => addNotice());
addFiveYearButton.addEventListener("click", () => addFiveYearNotice());
addTenYearButton.addEventListener("click", () => addTenYearNotice());
form.addEventListener("input", renderOutput);
form.addEventListener("change", handleFormChange);

copyButton.addEventListener("click", () => {
  if (!ensureValid()) return;
  copyText(buildOutput(), "복사 완료");
});

kakaoCopyButton.addEventListener("click", () => {
  if (!ensureValid()) return;
  copyText(buildOutput().replace(/\n{3,}/g, "\n\n"), "카카오톡용 복사 완료");
});

insurerCopyButton.addEventListener("click", () => {
  if (!ensureValid()) return;
  copyText(buildOutput({ insurerMode: true }), "보험사 제출용 복사 완료");
});

pdfButton.addEventListener("click", () => {
  if (!ensureValid()) return;
  window.print();
});

excelButton.addEventListener("click", exportExcel);

addNotice({
  disease: "눈 다래끼",
  date: "2026-05-02",
  careType: "통원",
  visits: "1",
  treatments: ["약처방"],
  recovery: "완치",
});
addNotice({
  disease: "발바닥 사마귀",
  date: "2026-05-02",
  careType: "통원",
  visits: "1",
  otherTreatment: "냉동치료",
  recovery: "완치",
});

renderOutput();
