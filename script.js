const nameInput = document.getElementById("name");
const skinInput = document.getElementById("skin");

// 兼容：按钮可能有 .btn，也可能没有
const btn = document.querySelector(".btn") || document.querySelector("button");

// 列表
const list = document.getElementById("successList");

// 弹窗（可能不存在，所以要保护）
const modal = document.getElementById("modal");
const modalBtn = document.getElementById("modalBtn");
const modalTitle = document.querySelector(".modal-title");
const modalText = document.querySelector(".modal-text");

function rand4() {
  return Math.floor(1000 + Math.random() * 9000);
}

function openModal(title, text) {
  if (!modal) {
    alert(`${title}\n${text}`);
    return;
  }
  if (modalTitle) modalTitle.textContent = title;
  if (modalText) modalText.textContent = text;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// 只有存在才绑定，避免 JS 直接报错
if (modalBtn) modalBtn.addEventListener("click", closeModal);
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-backdrop")) closeModal();
  });
}

function setLoading(on) {
  if (!btn) return;
  btn.disabled = on;
  btn.textContent = on ? "领取中…" : "领取";
}

function claim() {
  if (!btn) {
    alert("没有找到按钮（button），请确认 HTML 里有 <button>领取</button>。");
    return;
  }
  if (!list) {
    alert('没有找到成功列表，请确认 HTML 里有：id="successList"');
    return;
  }

  const name = (nameInput?.value || "").trim();
  const skin = (skinInput?.value || "").trim();

  if (!name) return openModal("提示", "请输入名字或编号");
  if (!skin) return openModal("提示", "请输入想要领取的皮肤");

  // 立刻弹窗
  openModal("领取成功", "请耐心等待发放");
  setLoading(true);

  // 发放中
  const pending = document.createElement("div");
  pending.className = "item";
  pending.textContent = "⏳ 正在发放中，请稍候…";
  list.prepend(pending);

  setTimeout(() => {
    pending.remove();

    const row = document.createElement("div");
    row.className = "item";
    row.textContent = `⭐ ${name} 成功领取【${skin}】！(${rand4()})`;
    list.prepend(row);

    setLoading(false);
    setTimeout(closeModal, 800);

    if (nameInput) nameInput.value = "";
    if (skinInput) skinInput.value = "";

    list.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1500);
}

// 绑定点击（最关键）
btn.addEventListener("click", claim);

// 回车触发
skinInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") claim();
});