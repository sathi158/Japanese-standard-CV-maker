/* =========================================
   DOM Elements
========================================= */

const educationEditor = document.getElementById("educationEditor");
const workEditor = document.getElementById("workEditor");
const qualificationEditor = document.getElementById("qualificationEditor");

const sameAddress = document.getElementById("sameAddress");
const differentAddress = document.getElementById("differentAddress");
const contactAddressGroup = document.getElementById(
  "contactAddressGroup"
);
const contactAddress = document.getElementById("contactAddress");
const previewContactAddress = document.getElementById(
  "previewContactAddress"
);

/* =========================================
   Fields saved in localStorage
========================================= */

const fieldIds = [
  "submissionDate",
  "fullName",
  "furigana",
  "birthDate",
  "gender",
  "nationality",
  "postalCode",
  "address",
  "contactAddress",
  "phone",
  "email",
  "commuteHour",
  "commuteMinute",
  "dependents",
  "visaStatus",
  "japaneseLevel",
  "skills",
  "motivation",
  "preferences"
];

/* =========================================
   Repeating Editor Rows
========================================= */

function createRow(container, values = {}) {
  if (!container) {
    return;
  }

  const row = document.createElement("div");
  row.className = "repeat-row";

  row.innerHTML = `
    <input
      class="year"
      type="text"
      maxlength="4"
      placeholder="年"
    >

    <input
      class="month"
      type="text"
      maxlength="2"
      placeholder="月"
    >

    <input
      class="detail"
      type="text"
      placeholder="内容"
    >

    <button type="button">×</button>
  `;

  row.querySelector(".year").value = values.year || "";
  row.querySelector(".month").value = values.month || "";
  row.querySelector(".detail").value = values.detail || "";

  row.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", updatePreview);
  });

  row.querySelector("button").addEventListener("click", () => {
    row.remove();
    updatePreview();
  });

  container.appendChild(row);
}

function getRows(container) {
  if (!container) {
    return [];
  }

  return [...container.querySelectorAll(".repeat-row")].map(
    (row) => ({
      year: row.querySelector(".year")?.value || "",
      month: row.querySelector(".month")?.value || "",
      detail: row.querySelector(".detail")?.value || ""
    })
  );
}

/* =========================================
   Preview Table Rows
========================================= */

function createPreviewRow(
  year = "",
  month = "",
  detail = "",
  isTitle = false
) {
  const row = document.createElement("tr");

  const yearCell = document.createElement("td");
  const monthCell = document.createElement("td");
  const detailCell = document.createElement("td");

  yearCell.textContent = year;
  monthCell.textContent = month;
  detailCell.textContent = detail;

  if (isTitle) {
    detailCell.style.textAlign = "center";
    detailCell.style.fontWeight = "bold";
  }

  row.appendChild(yearCell);
  row.appendChild(monthCell);
  row.appendChild(detailCell);

  return row;
}

/* =========================================
   Education and Work History Preview
========================================= */

function showHistory() {
  const target = document.getElementById("previewHistory");

  if (!target) {
    return;
  }

  target.innerHTML = "";

  target.appendChild(
    createPreviewRow("", "", "学 歴", true)
  );

  getRows(educationEditor).forEach((row) => {
    target.appendChild(
      createPreviewRow(row.year, row.month, row.detail)
    );
  });

  target.appendChild(
    createPreviewRow("", "", "職 歴", true)
  );

  getRows(workEditor).forEach((row) => {
    target.appendChild(
      createPreviewRow(row.year, row.month, row.detail)
    );
  });

  target.appendChild(
    createPreviewRow("", "", "以上", true)
  );

  while (target.children.length < 18) {
    target.appendChild(createPreviewRow());
  }
}

/* =========================================
   Qualifications Preview
========================================= */

function showQualifications() {
  const target = document.getElementById(
    "previewQualifications"
  );

  if (!target) {
    return;
  }

  target.innerHTML = "";

  getRows(qualificationEditor).forEach((row) => {
    target.appendChild(
      createPreviewRow(row.year, row.month, row.detail)
    );
  });

  while (target.children.length < 8) {
    target.appendChild(createPreviewRow());
  }
}

/* =========================================
   Date and Age
========================================= */

function formatDate(value, isSubmissionDate = false) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  if (isSubmissionDate) {
    return `${year} 年 ${Number(month)} 月 ${Number(day)} 日現在`;
  }

  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

function calculateAge(value) {
  if (!value) {
    return "";
  }

  const birthday = new Date(value);
  const today = new Date();

  let age = today.getFullYear() - birthday.getFullYear();

  const birthdayThisYear = new Date(
    today.getFullYear(),
    birthday.getMonth(),
    birthday.getDate()
  );

  if (today < birthdayThisYear) {
    age--;
  }

  return age;
}

/* =========================================
   Contact Address
========================================= */

function updateContactAddress() {
  if (
    !sameAddress ||
    !differentAddress ||
    !contactAddressGroup ||
    !previewContactAddress
  ) {
    return;
  }

  if (sameAddress.checked) {
    contactAddressGroup.classList.add("hidden");
    previewContactAddress.textContent = "同上";
    return;
  }

  contactAddressGroup.classList.remove("hidden");

  previewContactAddress.textContent =
    contactAddress?.value.trim() || "";
}

/* =========================================
   Complete Live Preview
========================================= */

function updatePreview() {
  const getValue = (id) => {
    const field = document.getElementById(id);
    return field ? field.value : "";
  };

  const setText = (id, value) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  };

  setText(
    "previewSubmissionDate",
    formatDate(getValue("submissionDate"), true)
  );

  setText("previewName", getValue("fullName"));
  setText("previewFurigana", getValue("furigana"));

  setText(
    "previewBirthDate",
    formatDate(getValue("birthDate"))
  );

  setText(
    "previewAge",
    calculateAge(getValue("birthDate"))
  );

  setText("previewGender", getValue("gender"));
  setText("previewNationality", getValue("nationality"));

  const postalCode = getValue("postalCode").trim();
  const currentAddress = getValue("address").trim();

  const formattedAddress = postalCode
    ? `〒${postalCode} ${currentAddress}`
    : currentAddress;

  setText("previewAddress", formattedAddress);

  setText("previewPhone", getValue("phone"));
  setText("previewEmail", getValue("email"));

  setText("previewMotivation", getValue("motivation"));
  setText("previewPreferences", getValue("preferences"));
  setText("previewSkills", getValue("skills"));

  /* Commute time */

  const commuteHour = getValue("commuteHour") || "0";
  const commuteMinute = getValue("commuteMinute") || "0";

  setText(
    "previewCommuteTime",
    `約 ${commuteHour} 時間 ${commuteMinute} 分`
  );

  /* Spouse status */

  const selectedSpouseStatus = document.querySelector(
    'input[name="spouseStatus"]:checked'
  );

  setText(
    "previewSpouseStatus",
    selectedSpouseStatus?.value || "無"
  );

  /* Dependents */

  const dependents = getValue("dependents") || "0";
  setText("previewDependents", dependents);

  /* Visa status */

  setText("previewVisaStatus", getValue("visaStatus"));

  /* Japanese level */

  setText(
    "previewJapaneseLevel",
    getValue("japaneseLevel")
  );

  updateContactAddress();
  showHistory();
  showQualifications();
}

/* =========================================
   Save Draft
========================================= */

function saveDraft() {
  const fields = {};

  fieldIds.forEach((id) => {
    const field = document.getElementById(id);

    if (field) {
      fields[id] = field.value;
    }
  });

  const selectedContactAddressType =
    document.querySelector(
      'input[name="contactAddressType"]:checked'
    )?.value || "same";

  const selectedSpouseStatus =
    document.querySelector(
      'input[name="spouseStatus"]:checked'
    )?.value || "無";

  const photo = document.getElementById("previewPhoto");

  const data = {
    fields,
    contactAddressType: selectedContactAddressType,
    spouseStatus: selectedSpouseStatus,
    education: getRows(educationEditor),
    work: getRows(workEditor),
    qualifications: getRows(qualificationEditor),
    photo:
      photo &&
      photo.src &&
      !photo.src.endsWith(window.location.href)
        ? photo.src
        : ""
  };

  localStorage.setItem(
    "rirekishoDraft",
    JSON.stringify(data)
  );

  alert("下書きを保存しました。");
}

/* =========================================
   Load Draft
========================================= */

function loadDraft() {
  const savedData = localStorage.getItem("rirekishoDraft");

  if (!savedData) {
    alert("保存された下書きがありません。");
    return;
  }

  try {
    const data = JSON.parse(savedData);

    fieldIds.forEach((id) => {
      const field = document.getElementById(id);

      if (field) {
        field.value = data.fields?.[id] || "";
      }
    });

    const contactAddressRadio =
      document.querySelector(
        `input[name="contactAddressType"][value="${
          data.contactAddressType || "same"
        }"]`
      );

    if (contactAddressRadio) {
      contactAddressRadio.checked = true;
    }

    const spouseRadio = document.querySelector(
      `input[name="spouseStatus"][value="${
        data.spouseStatus || "無"
      }"]`
    );

    if (spouseRadio) {
      spouseRadio.checked = true;
    }

    if (educationEditor) {
      educationEditor.innerHTML = "";

      (data.education || []).forEach((row) => {
        createRow(educationEditor, row);
      });
    }

    if (workEditor) {
      workEditor.innerHTML = "";

      (data.work || []).forEach((row) => {
        createRow(workEditor, row);
      });
    }

    if (qualificationEditor) {
      qualificationEditor.innerHTML = "";

      (data.qualifications || []).forEach((row) => {
        createRow(qualificationEditor, row);
      });
    }

    if (data.photo) {
      const photo = document.getElementById("previewPhoto");

      if (photo) {
        photo.src = data.photo;
        photo.style.display = "block";
      }
    }

    updatePreview();
  } catch (error) {
    console.error("Draft load error:", error);
    alert("保存データを読み込めませんでした。");
  }
}

/* =========================================
   Main Field Events
========================================= */

fieldIds.forEach((id) => {
  const field = document.getElementById(id);

  if (!field) {
    console.warn(`Field not found: ${id}`);
    return;
  }

  field.addEventListener("input", updatePreview);
  field.addEventListener("change", updatePreview);
});

/* Contact Address radio buttons */

document
  .querySelectorAll('input[name="contactAddressType"]')
  .forEach((radio) => {
    radio.addEventListener("change", updatePreview);
  });

if (contactAddress) {
  contactAddress.addEventListener(
    "input",
    updateContactAddress
  );
}

/* Spouse radio buttons */

document
  .querySelectorAll('input[name="spouseStatus"]')
  .forEach((radio) => {
    radio.addEventListener("change", updatePreview);
  });

/* =========================================
   Add Row Buttons
========================================= */

document
  .getElementById("addEducation")
  ?.addEventListener("click", () => {
    createRow(educationEditor);
  });

document
  .getElementById("addWork")
  ?.addEventListener("click", () => {
    createRow(workEditor);
  });

document
  .getElementById("addQualification")
  ?.addEventListener("click", () => {
    createRow(qualificationEditor);
  });

/* =========================================
   Photo Upload
========================================= */

document
  .getElementById("photoInput")
  ?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const photo = document.getElementById("previewPhoto");

      if (photo) {
        photo.src = reader.result;
        photo.style.display = "block";
      }
    };

    reader.readAsDataURL(file);
  });

/* =========================================
   Save, Load, Print and Clear
========================================= */

document
  .getElementById("saveButton")
  ?.addEventListener("click", saveDraft);

document
  .getElementById("loadButton")
  ?.addEventListener("click", loadDraft);
/* =========================================
   Mobile and Desktop PDF Download
========================================= */

const printButton = document.getElementById("printButton");

if (printButton) {
  printButton.addEventListener("click", async () => {
    const resumePages = document.querySelectorAll(".a4-sheet");

    if (!resumePages.length) {
      alert("PDFにする履歴書が見つかりません。");
      return;
    }

    if (!window.html2canvas || !window.jspdf) {
      alert("PDFライブラリを読み込めませんでした。");
      return;
    }

    const originalButtonText = printButton.textContent;

    printButton.disabled = true;
    printButton.textContent = "PDFを作成中...";

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const { jsPDF } = window.jspdf;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      for (let index = 0; index < resumePages.length; index++) {
        const originalPage = resumePages[index];

        /*
          মোবাইলের responsive CSS এড়িয়ে PDF-এর জন্য
          আলাদা desktop-width copy তৈরি করা হচ্ছে।
        */

        const captureWrapper = document.createElement("div");

        captureWrapper.style.position = "fixed";
        captureWrapper.style.left = "-10000px";
        captureWrapper.style.top = "0";
        captureWrapper.style.width = "210mm";
        captureWrapper.style.background = "#ffffff";
        captureWrapper.style.zIndex = "-9999";

        const pageClone = originalPage.cloneNode(true);

        pageClone.style.width = "210mm";
        pageClone.style.minWidth = "210mm";
        pageClone.style.height = "auto";
        pageClone.style.minHeight = "297mm";
        pageClone.style.margin = "0";
        pageClone.style.padding = "10mm";
        pageClone.style.overflow = "visible";
        pageClone.style.boxShadow = "none";
        pageClone.style.transform = "none";
        pageClone.style.flex = "none";
        pageClone.style.backgroundColor = "#ffffff";

        captureWrapper.appendChild(pageClone);
        document.body.appendChild(captureWrapper);

        /*
          ছবিগুলো পুরো load হওয়া পর্যন্ত অপেক্ষা
        */

        const images = [...pageClone.querySelectorAll("img")];

        await Promise.all(
          images.map((image) => {
            if (image.complete) {
              return Promise.resolve();
            }

            return new Promise((resolve) => {
              image.onload = resolve;
              image.onerror = resolve;
            });
          })
        );

        const canvas = await html2canvas(pageClone, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          allowTaint: false,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1200,
          windowHeight: Math.max(
            pageClone.scrollHeight + 100,
            1600
          )
        });

        captureWrapper.remove();

        const imageData = canvas.toDataURL("image/jpeg", 0.96);

        if (index > 0) {
          pdf.addPage("a4", "portrait");
        }

        const pageWidth = 210;
        const pageHeight = 297;

        const canvasRatio = canvas.height / canvas.width;

        let imageWidth = pageWidth;
        let imageHeight = imageWidth * canvasRatio;

        /*
          Content 297mm-এর চেয়ে সামান্য লম্বা হলে
          পুরো content-কে A4-এর মধ্যে fit করা হবে।
        */

        if (imageHeight > pageHeight) {
          imageHeight = pageHeight;
          imageWidth = imageHeight / canvasRatio;
        }

        const xPosition = (pageWidth - imageWidth) / 2;

        pdf.addImage(
          imageData,
          "JPEG",
          xPosition,
          0,
          imageWidth,
          imageHeight,
          undefined,
          "FAST"
        );
      }

      const nameInput = document
        .getElementById("fullName")
        ?.value.trim();

      const safeName = nameInput
        ? nameInput.replace(/[\\/:*?"<>|]/g, "_")
        : "Resume";

      pdf.save(`${safeName}_履歴書.pdf`);
    } catch (error) {
      console.error("PDF creation error:", error);

      alert(
        "PDFの作成に失敗しました。ページを再読み込みして、もう一度お試しください。"
      );
    } finally {
      /*
        Error হলেও temporary clone থেকে গেলে মুছে যাবে।
      */

      document
        .querySelectorAll('body > div[style*="-10000px"]')
        .forEach((element) => element.remove());

      printButton.disabled = false;
      printButton.textContent = originalButtonText;
    }
  });
}

document
  .getElementById("clearButton")
  ?.addEventListener("click", () => {
    const approved = confirm(
      "入力内容と保存データを削除しますか？"
    );

    if (!approved) {
      return;
    }

    localStorage.removeItem("rirekishoDraft");
    location.reload();
  });

/* =========================================
   Initial Rows and Preview
========================================= */

createRow(educationEditor);
createRow(workEditor);
createRow(qualificationEditor);

updatePreview();