# 公开来源与知识产权边界

## 1. 使用原则

本项目只借鉴公开资料中的高层架构思想，例如组件化实体、时间与事件推进、交互式运行、事件日志、模型扩展、地图编辑、Mod 和态势呈现。所有契约、代码、示例、地图、模型和视觉资产均应自主设计。

## 2. 公开参考

### AFRL AFSIM Overview and Technical Reference

- 链接：[公开 PDF](https://imlive.s3.amazonaws.com/Federal%20Government/ID156700649043486100007468415908987547373/Attachment_1_-_AFSIM.pdf)
- 公开版本：Version 2.0，2016，Distribution Statement A；
- 可用于理解：平台/组件架构、交互或非交互运行、实时或非实时、事件或时间步进、运动组件、行为、日志、插件和实验等公开概念；
- 不用于：复制实现、命令、模型、算法、参数、专有文件格式或非公开发行内容。

### Department of the Air Force Technology Transfer

- 链接：[Information Transfer Agreement Enables AFRL Software Sharing with Industry](https://www.aft3.af.mil/Success-Stories/Article/1792645/information-transfer-agreement-enables-afrl-software-sharing-with-industry/)
- 说明：官方页面明确 AFSIM 向行业伙伴的分享通过 Information Transfer Agreement，并存在分发限制；
- 结论：不能把公开介绍误解为获得软件、源码、模型或商业再发布权。

### Electronic Arts Command & Conquer Remastered

- 链接：[官方发布说明](https://www.ea.com/ea-play/news/official-launch-trailer)
- 可用于理解：经典 RTS 的现代 UI、地图编辑、多人交互和 Mod 支持属于用户体验参照；
- 不用于：复制游戏代码、美术、音乐、名称、单位、地图、规则或商标表达。

## 3. Clean-room 规则

1. 不导入、反编译、记忆性复刻或转换过去公司的代码和资产。
2. 不使用真实项目名称、场景、数据、参数、日志、截图和接口文档。
3. 不要求曾接触受限资料的人员凭记忆重建具体实现。
4. 所有示例使用虚构阵营、几何地图、合成参数和通用运动。
5. 每项第三方依赖记录许可证、来源、版本、校验值和用途。
6. 引擎适配必须先取得明确授权并建立独立边界评审。
7. 发现来源不明资产时先隔离，不以“网上能下载”为授权依据。

## 4. 安全边界

- 产品不连接真实装备或现实行动系统；
- SimulationCommand 只能作用于内核运行实例；
- 不实现或发布真实目标、漏洞、作战规则和高保真效应；
- 红蓝含义限于虚构阵营和合成防护/交互场景；
- 高级模型、外部数据和分布式连接需要新的范围与安全评审；
- AI 如后续加入，只能通过受限工具起草配置、检索文档或分析结果，不直接修改权威状态。

## 5. 发布前检查

- 所有资产的作者和许可证可追溯；
- 没有过去项目路径、名称、参数和注释残留；
- 示例地图不是现实敏感区域；
- 文档不宣称 L0/L1 模型具有现实预测能力；
- 发行包不包含未授权 AFSIM 或其他仿真产品材料；
- SBOM、许可证清单和制品校验值已生成；
- 所有示例指令只能操作合成实体。
