const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
const copyStatus = document.querySelector('#copy-status');
const effectTabs = Array.from(document.querySelectorAll('[data-effect-tab]'));
const effectPanels = Array.from(document.querySelectorAll('[data-effect-panel]'));

function activateTab(nextTab, moveFocus = false) {
  const target = nextTab.dataset.tab;

  for (const tab of tabs) {
    const selected = tab === nextTab;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }

  for (const panel of panels) {
    panel.hidden = panel.dataset.panel !== target;
  }

  if (moveFocus) {
    nextTab.focus();
  }

  if (copyStatus) {
    const clipName = nextTab.querySelector('small')?.textContent || nextTab.textContent.trim();
    copyStatus.textContent = `已切换到${clipName}。可查看完整提示词或点击复制。`;
  }
}

for (const tab of tabs) {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    const currentIndex = tabs.indexOf(tab);
    let nextIndex = null;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    }
  });
}

function activateEffectTab(nextTab, moveFocus = false) {
  const target = nextTab.dataset.effectTab;

  for (const tab of effectTabs) {
    const selected = tab === nextTab;
    tab.setAttribute('aria-pressed', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }

  for (const panel of effectPanels) {
    panel.hidden = panel.dataset.effectPanel !== target;
  }

  if (moveFocus) {
    nextTab.focus();
    nextTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}

for (const tab of effectTabs) {
  tab.addEventListener('click', () => activateEffectTab(tab));
  tab.addEventListener('keydown', (event) => {
    const currentIndex = effectTabs.indexOf(tab);
    let nextIndex = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % effectTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + effectTabs.length) % effectTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = effectTabs.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      activateEffectTab(effectTabs[nextIndex], true);
    }
  });
}

const ideaCatalog = {
  audience: {
    partner: { label: '伴侣', evidence: '共同生活里的物件、路线与习惯', context: '亲密关系', actor: '两个人' },
    elder: { label: '父母长辈', evidence: '声音、方言、老照片与家庭物件', context: '代际关系', actor: '家人' },
    friend: { label: '朋友', evidence: '共同经历、玩笑、路线与互相支持的瞬间', context: '友谊', actor: '朋友们' },
    self: { label: '自己', evidence: '日记、未完成愿望、阶段物件与身体记忆', context: '自我关系', actor: '过去与现在的自己' },
    pet: { label: '宠物', evidence: '旧项圈、爪印、日常路线与照护声音', context: '陪伴关系', actor: '宠物与照护者' },
    team: { label: '团队社群', evidence: '维护、倾听、补位与协作证据', context: '共同体关系', actor: '成员们' },
    brand: { label: '品牌客户', evidence: '长期使用痕迹、客户故事与共同选择', context: '长期服务关系', actor: '品牌与客户' },
    place: { label: '城市文化', evidence: '街巷、老店、方言、声音与迁徙记忆', context: '地方认同', actor: '居民与地方' },
  },
  value: {
    seen: { label: '被看见', goal: '用具体证据表达持续关注', intent: '“我希望你知道，你的日常真的被认真看见。”' },
    remembered: { label: '被记住', goal: '保存容易随时间消失的声音、习惯与片段', intent: '“我希望那些属于你的细节，不会被时间轻易带走。”' },
    understood: { label: '被理解', goal: '准确复述经历而不急于纠正或解决', intent: '“我希望先承认你经历了什么，而不是催你立刻改变。”' },
    affirmed: { label: '被肯定', goal: '让努力、贡献与选择获得具体承认', intent: '“我希望你做过的那些小事，都拥有清楚的名字。”' },
    accompanied: { label: '被陪伴', goal: '建立持续但不施压的共同在场', intent: '“我希望你感到，这段路不必一个人走完。”' },
    belonging: { label: '有归属', goal: '让对象在关系和共同体中拥有可参与的位置', intent: '“我希望你不只是被加入，而是真的能改变我们的故事。”' },
    ritual: { label: '有仪式感', goal: '为普通但重要的时刻建立可重复形式', intent: '“我希望这个时刻不只发生一次，而能被我们认真记住。”' },
    restart: { label: '告别重启', goal: '承认一段结束，并为下一阶段留下开放入口', intent: '“我希望你能妥善告别过去，也仍然拥有选择下一站的权利。”' },
  },
  archetype: {
    archive: { label: '证据档案', title: '日常证据档案', verb: '整理为可持续补充的私人档案', participation: '为证据增加时间、出处和个人注释', output: '一份可以继续生长的证据展览', visual: '一座以个人证据为展品的微型档案空间' },
    reply: { label: '时间回信', title: '跨时空回信', verb: '编排为过去与现在可以互相回应的双页', participation: '选择一个时刻写下回应并决定何时重读', output: '一封由本人控制开启时机的时间回信', visual: '左右两段时间并置，中间由一条光线或纸带连接' },
    map: { label: '共创地图', title: '共创关系地图', verb: '转化为可以共同添加节点的关系地图', participation: '留下自己的节点、路径和下一条线索', output: '一张被参与者持续改写的生长地图', visual: '多个个人物件成为节点，再由手绘路线彼此连接' },
    ceremony: { label: '重复仪式', title: '年度重复仪式', verb: '凝结为每年或每个阶段重复一次的动作', participation: '在固定时刻增加一件旧证据和一段新记忆', output: '一套逐年积累时间纹理的仪式盒', visual: '一个环形仪式中心，旧物与新证据按年份围绕' },
    route: { label: '变化路线', title: '阶段变化路线', verb: '组织为从过去走向下一站的可选择路线', participation: '亲自命名、修改并选择下一站', output: '一册始终可以改写的阶段路线图', visual: '过去证据在前景收束，开放路线通向多个未命名站点' },
    ambient: { label: '环境陪伴', title: '低打扰陪伴界面', verb: '转换成无需即时回应的环境信号', participation: '在方便时留下一段微小日常，不以回复速度计分', output: '一种持续存在但不制造压力的陪伴界面', visual: '两个相距的日常空间，由柔和光点、天气或声音轨迹连接' },
  },
};

const ideaState = { audience: 'partner', value: 'seen', archetype: 'archive' };
const ideaGroupOrder = {
  audience: Object.keys(ideaCatalog.audience),
  value: Object.keys(ideaCatalog.value),
  archetype: Object.keys(ideaCatalog.archetype),
};

function renderIdeaComposer(announce = true) {
  const result = document.querySelector('.idea-composer-result');
  if (!result) return;

  const audience = ideaCatalog.audience[ideaState.audience];
  const value = ideaCatalog.value[ideaState.value];
  const archetype = ideaCatalog.archetype[ideaState.archetype];
  const combinationNumber = (
    ideaGroupOrder.audience.indexOf(ideaState.audience) * ideaGroupOrder.value.length * ideaGroupOrder.archetype.length
    + ideaGroupOrder.value.indexOf(ideaState.value) * ideaGroupOrder.archetype.length
    + ideaGroupOrder.archetype.indexOf(ideaState.archetype)
    + 1
  );
  const title = `${audience.label}的${archetype.title}`;
  const summary = `把${audience.evidence}${archetype.verb}，让“${value.label}”成为可进入、可参与、可保存的体验。`;
  const core = `从${audience.evidence}中选取可验证细节，由${audience.actor}${archetype.participation}；不靠泛化祝福表达“${value.label}”。`;
  const visual = `${archetype.visual}。画面核心使用${audience.evidence}，避免通用爱心、奖杯或夸张表情。`;
  const goal = `${value.goal}，同时让${audience.label}能够${archetype.participation}，最后留下${archetype.output}。`;
  const brief = [
    `创意方向：${title}`,
    `对象：${audience.label}`,
    `关系语境：${audience.context}`,
    `情绪价值：${value.label}`,
    `产品母型：${archetype.label}`,
    `核心创意：${core}`,
    `推荐画面：${visual}`,
    `产品目标：${goal}`,
    `主观意愿：${value.intent}`,
    '边界：这是规则组合生成的创意种子，不代表真实产品、市场验证或情绪效果保证。',
  ].join('\n');

  result.dataset.ideaValue = ideaState.value;
  document.querySelector('#idea-combination-count').textContent = `方向 ${String(combinationNumber).padStart(3, '0')} / 384`;
  document.querySelector('#idea-node-audience').textContent = audience.label;
  document.querySelector('#idea-node-value').textContent = value.label;
  document.querySelector('#idea-node-archetype').textContent = archetype.label;
  document.querySelector('#idea-result-title').textContent = title;
  document.querySelector('#idea-result-summary').textContent = summary;
  document.querySelector('#idea-result-core').textContent = core;
  document.querySelector('#idea-result-visual').textContent = visual;
  document.querySelector('#idea-result-goal').textContent = goal;
  document.querySelector('#idea-result-intent').textContent = value.intent;
  document.querySelector('#idea-brief-text').textContent = brief;

  if (announce) {
    document.querySelector('#idea-live-status').textContent = `已生成创意方向：${title}。`;
  }
}

function selectIdeaOption(group, key, moveFocus = false) {
  ideaState[group] = key;
  const groupButtons = Array.from(document.querySelectorAll(`[data-idea-group="${group}"]`));
  for (const button of groupButtons) {
    const selected = button.dataset.ideaKey === key;
    button.setAttribute('aria-pressed', String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && moveFocus) button.focus();
  }
  renderIdeaComposer();
}

for (const button of document.querySelectorAll('[data-idea-group]')) {
  button.addEventListener('click', () => selectIdeaOption(button.dataset.ideaGroup, button.dataset.ideaKey));
  button.addEventListener('keydown', (event) => {
    const group = button.dataset.ideaGroup;
    const keys = ideaGroupOrder[group];
    const currentIndex = keys.indexOf(button.dataset.ideaKey);
    let nextIndex = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % keys.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + keys.length) % keys.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = keys.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      selectIdeaOption(group, keys[nextIndex], true);
    }
  });
}

document.querySelector('[data-idea-shuffle]')?.addEventListener('click', () => {
  const audienceIndex = (ideaGroupOrder.audience.indexOf(ideaState.audience) + 3) % ideaGroupOrder.audience.length;
  const valueIndex = (ideaGroupOrder.value.indexOf(ideaState.value) + 5) % ideaGroupOrder.value.length;
  const archetypeIndex = (ideaGroupOrder.archetype.indexOf(ideaState.archetype) + 1) % ideaGroupOrder.archetype.length;
  ideaState.audience = ideaGroupOrder.audience[audienceIndex];
  ideaState.value = ideaGroupOrder.value[valueIndex];
  ideaState.archetype = ideaGroupOrder.archetype[archetypeIndex];

  for (const group of Object.keys(ideaState)) {
    for (const button of document.querySelectorAll(`[data-idea-group="${group}"]`)) {
      const selected = button.dataset.ideaKey === ideaState[group];
      button.setAttribute('aria-pressed', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
  }
  renderIdeaComposer();
});

renderIdeaComposer(false);

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('copy command failed');
}

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy);
    if (!source) return;

    const originalLabel = button.textContent;
    const status = button.dataset.copyStatus
      ? document.getElementById(button.dataset.copyStatus)
      : copyStatus;
    const copyKind = button.dataset.copyKind || 'video';
    try {
      await copyText(source.textContent.trim());
      button.textContent = '已复制';
      button.classList.add('is-copied');
      if (status) {
        const successMessages = {
          image: '图片 Prompt 已复制，可以粘贴到生图模型。',
          idea: '创意简报已复制，可以继续改写或交给生图流程。',
          video: 'Prompt 已复制到剪贴板，可以粘贴到视频生成模型。',
        };
        status.textContent = successMessages[copyKind] || successMessages.video;
      }
    } catch {
      button.textContent = '复制失败';
      if (status) status.textContent = '浏览器没有授予剪贴板权限，请手动选择代码文本复制。';
    }

    window.setTimeout(() => {
      button.textContent = originalLabel;
      button.classList.remove('is-copied');
    }, 2200);
  });
}
