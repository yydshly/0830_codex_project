const beats = [
  {
    sourceImage: "assets/source/beat-01.jpg", sourceAlt: "原片 1.5 秒关键帧，人物佩戴耳机看向侧面", sourceTime: "取样帧 · 00:01.500",
    sourceTitle: "先让产品进入画面，不急着解释", sourceCopy: "人物转头，耳机轮廓清晰出现；还没有文案，观众先看到“触发物”。",
    mechanismFunction: "HOOK / PRODUCT TRIGGER", mechanismTitle: "用一个动作建立状态切换", mechanismCopy: "开场不是罗列参数，而是先建立“使用前 → 触发 → 使用后”的因果入口。",
    preserve: "佩戴动作 + 即时感知变化", change: "明星 / 酒店 → 虚构球员 / 球员通道",
    adaptationImage: "assets/adaptation/beat-01.jpg", adaptationAlt: "原创分镜，球员在多语言交流压力中佩戴黑色翻译耳机", adaptationTitle: "多种语言同时压向球员", adaptationCopy: "赛前通道里，教练与队友的声音化成暖色声波；他还没能跟上节奏。",
    claim: "<strong>本节无性能宣称。</strong>只建立问题与触发动作，不凭空补充翻译准确率、延迟或支持语言数。"
  },
  {
    sourceImage: "assets/source/beat-02.jpg", sourceAlt: "原片 6 秒关键帧，人物从座椅起身开始舞动", sourceTime: "取样帧 · 00:06.000",
    sourceTitle: "功能被翻译成身体状态", sourceCopy: "人物从静坐变成轻盈舞动，降噪体验没有通过设置页面解释，而是通过动作被看见。",
    mechanismFunction: "ESCALATION / FELT BENEFIT", mechanismTitle: "把抽象能力拍成可观察的变化", mechanismCopy: "“更安静”不是一句形容词：身体从受限到释放，就是特性产生作用的视觉证据。",
    preserve: "触发后的即时状态反差", change: "舞蹈释放 → 听懂后恢复专注",
    adaptationImage: "assets/adaptation/beat-03.jpg", adaptationAlt: "原创分镜，暖色混乱声波收束成一条青色翻译声道", adaptationTitle: "混乱收束成一条清晰语义流", adaptationCopy: "暖色噪声从球员两侧退去，单一青色波形到达耳边；表情由紧张变为确定。",
    claim: "<strong>Benefit 只做视觉表达。</strong>“听懂”是剧情结果；具体准确率与延迟仍保持占位。"
  },
  {
    sourceImage: "assets/source/beat-03.jpg", sourceAlt: "原片 12 秒关键帧，人物佩戴耳机穿过酒店走廊", sourceTime: "取样帧 · 00:12.000",
    sourceTitle: "用连续移动延长产品体验", sourceCopy: "镜头从房间进入走廊，人物、服装和耳机连续，空间转换成为下一轮功能演示。",
    mechanismFunction: "PRODUCT BRIDGE / CONTINUITY", mechanismTitle: "空间在变，产品因果不能断", mechanismCopy: "同一人物、同一设备和一个持续动作链，让生成模型知道每段不是互不相干的漂亮镜头。",
    preserve: "人物 / 产品 / 运动方向连续", change: "酒店走廊 → 球员通道",
    adaptationImage: "assets/adaptation/beat-04.jpg", adaptationAlt: "原创分镜，球员跟随教练穿过通道走向球场", adaptationTitle: "把理解能力带进真实任务", adaptationCopy: "镜头跟拍球员穿过通道，青色声音线连接教练与队员，目的地从房间变成球场。",
    claim: "<strong>连续性约束。</strong>同一球员、石墨训练服、青色缝线、黑色挂耳设备必须跨段保持。"
  },
  {
    sourceImage: "assets/source/beat-04.jpg", sourceAlt: "原片 19.5 秒关键帧，人物快速穿过服务区和仓库空间", sourceTime: "取样帧 · 00:19.500",
    sourceTitle: "环境越来越复杂，人物仍不被打断", sourceCopy: "路径从室内走廊扩展到服务区与大型空间，速度、距离和背景干扰同步升级。",
    mechanismFunction: "PROOF BUILD / PRESSURE TEST", mechanismTitle: "提高难度，才能让能力显得可信", mechanismCopy: "如果使用后的场景没有变难，观众只看到情绪；环境加压让“产品仍然有效”成为故事。",
    preserve: "外部复杂度持续上升", change: "城市噪声 → 多人高速比赛协作",
    adaptationImage: "assets/adaptation/beat-04.jpg", adaptationAlt: "原创分镜，球员与教练从通道高速进入球场", adaptationTitle: "从翻译演示进入比赛压力", adaptationCopy: "教练最后一条战术指令传来，球员与队友跑向赛场；人数、速度和任务成本都在增加。",
    claim: "<strong>这是剧情压力测试，不是实验室测试。</strong>页面不会把视觉戏剧化等同于产品性能认证。"
  },
  {
    sourceImage: "assets/source/beat-05.jpg", sourceAlt: "原片 26.5 秒关键帧，人物在人群和车辆间前进，画面出现主动降噪主张", sourceTime: "取样帧 · 00:26.500",
    sourceTitle: "先给环境证据，再给一句主张", sourceCopy: "人物在拥挤街道与移动遮挡中保持节奏，随后出现“World's best…”主张和测试脚注。",
    mechanismFunction: "PAYOFF / CLAIM REVEAL", mechanismTitle: "把结论放在可见结果之后", mechanismCopy: "主张不是开场口号，而是对前面整段体验的命名；脚注同时提醒它需要测试依据。",
    preserve: "可见结果 → 一句结论", change: "独处节奏 → 团队同步完成进攻",
    adaptationImage: "assets/adaptation/beat-05.jpg", adaptationAlt: "原创分镜，球员与队友同步跑位并完成射门", adaptationTitle: "用一次同步进攻证明“听懂了”", adaptationCopy: "队友跑位、传球和射门在同一节奏中完成；能力由任务结果体现，而不是悬浮 UI。",
    claim: "<strong>原片 observed：</strong>ANC 主张确实出现在画面。<strong>新片 placeholder：</strong>翻译延迟、准确率和语言数必须替换为已验证事实。"
  },
  {
    sourceImage: "assets/source/beat-06.jpg", sourceAlt: "原片 28.5 秒关键帧，AirPods Pro 3 产品名在城市移动背景上定格", sourceTime: "取样帧 · 00:28.500",
    sourceTitle: "情绪完成后，才把记忆交给产品", sourceCopy: "车辆掠过前景，AirPods Pro 3 标识压在仍然运动的城市画面上，完成品牌与体验绑定。",
    mechanismFunction: "LOCKUP / CTA", mechanismTitle: "产品英雄镜头负责记忆，不负责补故事", mechanismCopy: "最后一拍收束名称、造型与行动入口；它依赖前五拍已经完成问题、触发、证明和回报。",
    preserve: "情绪余韵 + 清晰产品定格", change: "Apple 品牌锁定 → 原创黑色挂耳设备",
    adaptationImage: "assets/adaptation/beat-06.jpg", adaptationAlt: "原创分镜，黑色挂耳翻译运动耳机悬浮在黑青渐变背景", adaptationTitle: "只留下设备轮廓与一句行动文案", adaptationCopy: "黑色挂耳设备在青色轮廓光中定格；“Relay Arc / Hear the play.”作为后期文字加入。",
    claim: "<strong>后期叠字，不让视频模型生字。</strong>品牌名、CTA 与经确认的商品事实在剪辑阶段加入。"
  }
];

const tabs = [...document.querySelectorAll(".beat-tab")];
const panel = document.querySelector("#beat-panel");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fields = {
  sourceImage: document.querySelector("#source-image"), sourceTime: document.querySelector("#source-time"), sourceTitle: document.querySelector("#source-title-beat"), sourceCopy: document.querySelector("#source-copy"),
  mechanismFunction: document.querySelector("#mechanism-function"), mechanismTitle: document.querySelector("#mechanism-title"), mechanismCopy: document.querySelector("#mechanism-copy"), preserve: document.querySelector("#preserve-copy"), change: document.querySelector("#change-copy"),
  adaptationImage: document.querySelector("#adaptation-image"), adaptationTitle: document.querySelector("#adaptation-title"), adaptationCopy: document.querySelector("#adaptation-copy"), claim: document.querySelector("#claim-copy"), orbitNumber: document.querySelector(".mechanism-orbit b")
};

function setBeat(index, shouldFocus = false) {
  const beat = beats[index];
  tabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  panel.classList.remove("is-changing");
  if (!reduceMotion) requestAnimationFrame(() => panel.classList.add("is-changing"));
  fields.sourceImage.src = beat.sourceImage; fields.sourceImage.alt = beat.sourceAlt; fields.sourceTime.textContent = beat.sourceTime; fields.sourceTitle.textContent = beat.sourceTitle; fields.sourceCopy.textContent = beat.sourceCopy;
  fields.mechanismFunction.textContent = beat.mechanismFunction; fields.mechanismTitle.textContent = beat.mechanismTitle; fields.mechanismCopy.textContent = beat.mechanismCopy; fields.preserve.textContent = beat.preserve; fields.change.textContent = beat.change;
  fields.adaptationImage.src = beat.adaptationImage; fields.adaptationImage.alt = beat.adaptationAlt; fields.adaptationTitle.textContent = beat.adaptationTitle; fields.adaptationCopy.textContent = beat.adaptationCopy; fields.claim.innerHTML = beat.claim; fields.orbitNumber.textContent = String(index + 1).padStart(2, "0");
  panel.setAttribute("aria-labelledby", tabs[index].id);
  if (shouldFocus) tabs[index].focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => setBeat(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    setBeat(next, true);
  });
});

document.documentElement.classList.add("has-js");
