# 03-Origin 代码剖析

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 03 |
> | 文档版本 | v1.0.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-13 |
> | 对应内容 | docs/reference/origin 目录下 app.js 与 chunk-vendors.js 的深度剖析 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-13 | v1.0.0 | 初版 |
>
> **关联文档**：[01-架构概览.md](../architecture/01-架构概览.md)、[01-API 参考.md](./01-API%20参考.md)、[02-数据字典.md](./02-数据字典.md)

---

## 1. 概述

`docs/reference/origin/` 目录包含从 haijiao.com 生产环境提取的 Webpack 编译产物：

| 文件 | 行数 | 说明 |
|:------|:----:|------|
| `app.js` | ~7292 | 主应用入口 + 所有业务模块（Webpack bundle） |
| `chunk-vendors.js` | ~1260 | 第三方依赖（core-js、Vue、Element UI、Axios 等） |

**技术栈识别**：原始应用基于 **Vue 2.6 + Element UI + Webpack 4** 构建，使用 Vuex 状态管理、Vue Router history 模式、Axios HTTP 客户端。

---

## 2. 应用架构

### 2.1 入口模块（56d7）

```
模块 56d7 → 应用初始化
├── 引入核心：Vue、Router、Store、Element UI、Quill 编辑器
├── 全局配置：productionTip = false
├── 全局组件：user-avatar、advertising、CollapseTransition
├── 全局方法挂载到 Vue.prototype：
│   ├── $axios → Axios 实例
│   ├── MainObj.name → "海角"
│   ├── timeToStr(date, fmt) → 时间格式化
│   ├── MoneyShow(amount, type) → 金额格式化（type=2 时 ÷100）
│   └── SpliceURL() → 拼接当前域名 + 路径
├── 全局过滤器：来自 utils/filter
├── 全局指令：来自 utils/directives
├── 路由守卫 beforeEach：
│   ├── 已登录 → 更新用户信息 + 异步获取私信
│   ├── hideBg → 控制背景显示
│   ├── hideTopHead → 控制顶栏显示
│   ├── 动态注入追踪脚本（totalJavascript）
│   └── 设置文档标题
└── init() 初始化流程：
    ├── 获取 SSR 配置（域名、客服、VIP域名等）
    ├── 注入追踪脚本
    ├── 更新 store.configUrl
    ├── VIP域名特殊处理（带 token/ref/user 参数的跳转登录）
    └── 未登录 → 重定向 /login
```

### 2.2 路由模块（a18c）

基于 Vue Router history 模式，共 **19 条路由**：

| 路由 | 页面 | 说明 | 懒加载 chunk |
|:------|:------|:------|:------------|
| `/home` | Index | 首页（帖子列表） | `index~search~topic` |
| `/post/details` | Details | 帖子详情 | `index~search~topic` + `topic~user` + `pay~topic` + `topic` |
| `/es` | Es | 搜索 | `index~search~topic` + `search` |
| `/article` | article | 文章 | 同 post/details |
| `/login` | Login | 登录页 | `oauth` |
| `/register` | Register | 注册 | `oauth` |
| `/forget` | Forget | 忘记密码 | `oauth` |
| `/setnewpwd` | updatePwd | 重置密码 | `oauth` |
| `/oauth` | OAuth | OAuth 回调 | 含 `/addArticle`、`/updateArticle` 子路由 |
| `/pay/alipay` | alipayPage | 支付宝支付 | `pay~topic` + `pay` |
| `/pay/threepay` | threePayPage | 第三方支付 | `pay~topic` + `pay` |
| `/error` | error | 错误页 | `index~search~topic` + `index` |
| `*` | error | 通配符 → 404 | 同上 |

**动态路由模块**（需要登录，通过 `beforeEnter` 守卫）：

| 父路由 | 子路由 | 模块 | 页面 |
|:--------|:------|:----:|:------|
| `/homepage/:uid` | `homepage_index` | 用户主页 | 全部帖子 |
| | `homepage_last` | | 最新 |
| | `homepage_essence` | | 精华 |
| | `homepage_reward` | | 悬赏 |
| | `homepage_sell` | | 出售 |
| `/relation` | `relation_focus` | 关系 | 我关注的 |
| | `relation_fans` | | 我的粉丝 |
| | `relation_friend` | | 我的好友 |
| `/users` | 多个 | 个人中心 | 见下方 |

**个人中心模块**（`/users` 下）：

| 路由 | 菜单ID | 页面 |
|:------|:-----:|:------|
| `/post/release` | 101 | 我发布的 |
| `/post/reply` | | 我回复的 |
| `/post/comments` | | 我评论的 |
| `/post/give` | | 我点赞的 |
| `/post/sell` | | 我出售的 |
| `/post/reward` | | 我的悬赏 |
| `/post/collection` | | 收藏 |
| `/post/footprint` | | 足迹 |
| `/post/drafts` | | 草稿箱 |
| `/task/index` | 201 | 任务中心 |
| `/member` | 301 | 会员中心 |
| `/movie` | 701 | 海角影城 |
| `/mall/diamond` | 401 | 钻石道具 |
| `/mall/gold` | | 金币道具 |
| `/message/interactive` | 501 | 互动消息 |
| `/message/system` | | 系统消息 |
| `/message/gift` | | 礼物消息 |
| `/message/direct/:target` | | 私信 |
| `/personal/datum` | 601 | 个人资料 |
| `/personal/wallet` | | 我的钱包 |
| `/personal/withdrawals` | | 提款 |
| `/personal/records` | | 提款记录 |
| `/personal/backpack` | | 我的背包 |
| `/personal/giftrecord` | | 道具礼物记录 |
| `/gold/transactionlist` | | 交易记录 |

### 2.3 Store 模块（4360）

基于 Vuex，包含 **主 store + relation 子模块**：

**主 Store State**：

```typescript
interface StoreState {
  isloading: boolean        // 加载状态
  memberState: boolean      // 会员状态
  userInfo: {               // 用户信息
    smallAvatar: string
    username: string
    // 实际包含: id, nickname, avatar, vip, vipExpiresTime,
    //          diamond, gold, signature, etc.
  }
  showBg: boolean           // 背景显示
  showTopHead: boolean      // 顶栏显示
  isLogin: boolean          // 登录状态
  configUrl: object         // 配置URL（域名、客服等）
  money: {                  // 余额
    diamond: number
    gold: number
    score: number
  }
  routerMenu: any[]         // 路由菜单
  unReadNum: number         // 未读数
  levelUpgrade: boolean     // 等级升级提示
  menuBottomShow: {         // 底部菜单
    noticeName: string
    projectName: string
    feedbackName: string
  }
  nodever: number           // 节点版本
  videoData: {              // 视频数据
    show: boolean
    name: string
    id: string
    url: string
    image: string
  }
  openvip: boolean          // 开通VIP弹窗
}
```

**主 Store Getters**：

| Getter | 说明 |
|:--------|------|
| `getVideoData` | 获取视频数据 |
| `memberState` | 已登录且是会员 |
| `userInfo` | 已登录返回用户信息，否则空对象 |
| `user_worth` | 用户资产（diamond + gold） |

**主 Store Mutations**：

| Mutation | 说明 |
|:----------|------|
| `updateVideoData` | 更新视频数据 |
| `updateopenvip` | 切换开通VIP弹窗 |
| `updateNodever` | 更新节点版本 |
| `updateMenuBottomShow` | 更新底部菜单 |
| `updateLevelUpgrade` | 更新等级升级提示 |
| `updateUnReadNum` | 更新未读数 |
| `updateMemberState` | 更新会员状态 |
| `updateRouterMenu` | 更新路由菜单 |
| `updateMoney` | 更新余额 |
| `updateLogin` | 更新登录状态 |
| `updateUserInfo` | 更新用户信息（含 cookie 持久化） |
| `updateBgShow` | 更新背景显示 |
| `updateTopHeadShow` | 更新顶栏显示 |
| `updateConfigUrl` | 更新配置URL |

**主 Store Actions**：

| Action | API | 说明 |
|:--------|-----|------|
| `update_userinfo` | `/user/current` | 获取并更新用户信息 |
| `update_vipSwitch` | `/vip/vipSwitch` | 获取会员开关状态 |

**Relation 子模块**（关注/粉丝/背包）：

```typescript
interface RelationState {
  count: number
  focusList: { updatetime: number; list: UserItem[] }
  fansList: { updatetime: number; list: UserItem[] }
  backpackList: { updatetime: number; list: BackpackItem[] }
  personalLetter: PersonalMsg[]
}
```

| Getter | 说明 |
|:--------|------|
| `getUnRead` | 未读私信总数 |
| `getFocusList` | 关注列表 |
| `getFansList` | 粉丝列表 |
| `getFriendList` | 互关好友（关注 ∩ 粉丝） |
| `getBackpackList` | 背包列表 |
| `getTopCard` | 置顶卡道具（itemIds: 101,102,103） |
| `getNameCard` | 改名卡道具（itemId: 888） |
| `getSignatureCard` | 签名卡道具（itemId: 555） |
| `getPortraitCard` | 头像框道具（itemId: 666） |

| Action | API | 说明 |
|:--------|-----|------|
| `asyncFocusList` | `/user/favorite/users` | 获取关注列表（30 分钟缓存） |
| `asyncFansList` | `/user/fans` | 获取粉丝列表 |
| `asyncBackpackList` | `/store/user_pack` | 获取背包列表 |
| `asyncPersonalLetter` | `/user/messages` | 获取私信列表 |

### 2.4 HTTP 客户端模块（5e1c + ec7a）

基于 **Axios** 封装，核心拦截器逻辑：

**请求拦截器**：
- 默认超时 30 秒，上传接口 360 秒
- 从 Cookie 读取 token/id，附加到 `X-User-Token` / `X-User-Id` 请求头
- 附加 `pcVer: 2` 请求头

**响应拦截器**：
- 图片类请求（`.hj`、`.jpg.txt` 等）直接返回
- `/login/conf` 接口：三层 Base64 解密，处理 redirectTo 跳转
- `errorCode === 3`：未登录 → 跳转 `/login`
- `errorCode === 1006`：弹出确认对话框
- `errorCode === 1 (ErrorNotLogin)`：清除 Cookie → 弹出重新登录确认
- `errorCode === 1002 (UserDisabled)`：账号禁用 → 跳转首页
- `errorCode === 1004 (UserDisabledOther)`：部分禁用 → 仅提示
- `errorCode === 1003 (InObservationPeriod)`：观察期无法自助删帖 → 弹出客服指引
- `errorCode === 1010`：出售帖删除限制 → 弹出联系客服模板
- 其他错误：调用 `c.main()` 统一处理，支持三层 Base64 解密

**错误码常量**：

| 常量 | 值 | 说明 |
|:------|:--:|------|
| `ErrorNotLogin` | 1 | 未登录/Token过期 |
| `CaptchaError` | 1000 | 验证码错误 |
| `ForbiddenError` | 1001 | 禁止访问 |
| `UserDisabled` | 1002 | 账号禁用 |
| `InObservationPeriod` | 1003 | 观察期 |
| `UserDisabledOther` | 1004 | 部分禁用 |

### 2.5 API 模块汇总

#### 2.5.1 用户模块（1f24）

| 导出 | API 端点 | 方法 | 说明 |
|:-----|---------|:----:|------|
| `j` (currentUser) | `/user/current` | GET | 获取当前用户信息 |
| `f` (userTopics) | `/topic/node/topics` | GET | 用户帖子列表 |
| `i` (favTopic) | `/favorite/favorite` | GET | 收藏的帖子 |
| `g` (tags) | `/tag/tags` | GET | 标签列表 |
| `v` (createTopic) | `/topic/create` | POST | 创建帖子 |
| `z` (editTopic) | `/topic/edit` | POST | 编辑帖子 |
| `e` (topicNodes) | `/topic/node` | GET | 板块列表 |
| `u` (saleTopicStatus) | `/vip/querySaleTopicStatus` | GET | 出售帖状态 |
| `a` (addFavorite) | `/favorite/add` | GET | 收藏帖子 |
| `c` (delFavorite) | `/favorite/delete` | GET | 取消收藏 |
| `k` (getTopicEdit) | `/topic/edit` | GET | 获取帖子编辑信息 |
| `r` (userFavorite) | `/user/favorite` | GET | 用户收藏 |
| `w` (chatMessage) | `/chat/message` | POST | 发送私信（form-urlencoded） |
| `q` (userTopics2) | `/topic/node/topics` | GET | 用户帖子（另一入口） |
| `l` (followList) | `/user/favorite/users` | GET | 关注列表 |
| `m` (fansList) | `/user/fans` | GET | 粉丝列表 |
| `x` (userFavorite2) | `/user/favorite` | GET | 用户收藏（另一入口） |
| `y` (signIn) | `/user/user_sign_in` | POST | 每日签到 |
| `p` (taskStatus) | `/task/getTaskStatus` | GET | 任务状态 |
| `o` (vipNumber) | `/vip/getNumber?type=X` | GET | VIP数量查询 |
| `h` (queryFreeNum) | `/vip/queryFreeNum` | GET | 查询免费次数 |
| `s` (disCardNum) | `/vip/queryDisCardNum` | GET | 折扣卡数量 |
| `d` (globalTopics) | `/topic/global/topics` | GET | 全球帖子列表 |
| `n` (mediaList) | `/upload/medialist` | GET | 媒体列表 |
| `b` (deleteUpload) | `/upload/delete` | POST | 删除上传 |
| `t` (giveHotGift) | `/store/give_hot_gift` | GET | 赠送热门礼物 |

#### 2.5.2 认证模块（21e4）

| 导出 | API 端点 | 方法 | 说明 |
|:-----|---------|:----:|------|
| `b` (captchaRequest) | `/captcha/request{ext}` | GET | 请求验证码 |
| `c` (signupCaptcha) | `/captcha/request?t=signupCaptcha` | GET | 注册验证码 |
| `f` (signup) | `/login/signup` | POST | 注册 |
| `d` (signin) | `/login/signin` | POST | 登录 |
| `a` (findPassword) | `/user/password/find` | POST | 找回密码 |
| `g` (resetPassword) | `/user/password/reset` | POST | 重置密码 |
| `e` (captchaIsNeed) | `/captcha/isNeed?captchaKey=X` | GET | 检查是否需要验证码 |

#### 2.5.3 帖子模块（9d4b）

| 导出 | API 端点 | 方法 | 说明 |
|:-----|---------|:----:|------|
| `q` (nodesByVer) | `/topic/nodes_by_ver/v2?ver=X` | GET | 按版本获取板块 |
| `o` (loginConf) | `/login/conf` | GET | 登录配置 |
| `n` (hotTopics) | `/topic/hot/topics` | GET | 热门帖子 |
| `t` (newsTopics) | `/topic/node/news` | GET | 资讯 |
| `h` (footTopics) | `/topic/foot/topics` | GET | 精选/首页推荐 |
| `j` (topicDetail) | `/topic/{id}` | GET | 帖子详情 |
| `p` (replyList) | `/comment/reply_list` | GET | 评论列表 |
| `C` (commentList) | `/comment/comment_list` | GET | 回复列表 |
| `k` (upload) | `/upload` | POST | 上传文件（带进度） |
| `x` (followList) | `/user/favorite/users` | GET | 关注列表 |
| `f` (replyPost) | `/comment/reply` | POST | 发表评论 |
| `i` (createComment) | `/comment/create` | POST | 创建评论 |
| `g` (likeTopic) | `/topic/like` | GET | 点赞 |
| `d` (favorite) | `/favorite/favorite` | GET | 收藏 |
| `c` (likeTopicPost) | `/topic/like/{id}` | POST | 点赞（POST） |
| `a` (delFavorite) | `/favorite/delete` | GET | 取消收藏 |
| `u` (addFavorite) | `/favorite/add` | GET | 收藏 |
| `b` (userFavorite) | `/user/favorite` | GET | 用户收藏 |
| `y` (buySell) | `/topic/buy/sell` | POST | 购买出售内容 |
| `z` (subscribe) | `/comment/subscribe` | GET | 订阅帖子 |
| `e` (cancelReward) | `/topic/cancel/reward/{id}` | POST | 取消点赞 |
| `v` (searchByTag) | `/topic/search_topic_by_tag` | GET | 按标签搜索 |
| `w` (searchUserByTag) | `/user/search_user_by_tag` | GET | 按标签搜用户 |
| `A` (topicTop) | `/user_pack/topic_top` | POST | 置顶帖 |
| `l` (giveReward) | `/ranking/give_reward` | GET | 给奖励 |
| `m` (famousUser) | `/user/famous` | GET | 名人用户 |
| `B` (signOut) | `/login/signout` | GET | 登出 |
| `r` (rank) | `/ranking/rank` | GET | 排行榜 |
| `s` (quantify) | `/topic/quantify` | GET | 定量帖子 |

#### 2.5.4 VIP/商城模块（81ee）

| 导出 | API 端点 | 方法 | 说明 |
|:-----|---------|:----:|------|
| `h` (vipSwitch) | `/vip/vipSwitch` | GET | VIP开关 |
| `g` (vipList) | `/vip/vipList` | GET | VIP列表 |
| `e` (queryFreeNum) | `/vip/queryFreeNum?type=X` | GET | 查询免费次数 |
| `c` (withdrawInfo) | `/vip/getWithdrawInfo` | GET | 提款信息 |
| `d` (postWithdraw) | `/vip/postWithdrawOrder` | POST | 提交提款 |
| `f` (recharge) | `/vip/recharge` | POST | 充值 |
| `a` (topicAtt) | `/topic/att/{id}` | GET | 帖子附件 |
| `b` (attachment) | `/attachment` | POST | 附件解析 |

#### 2.5.5 用户设置模块（b5aa）

| 导出 | API 端点 | 方法 | 说明 |
|:-----|---------|:----:|------|
| `a` (userParentTags) | `/tag/user_parent_tags` | GET | 用户标签分类 |
| `b` (userTags) | `/tag/user_tags` | GET | 用户标签列表 |
| `c` (updateTags) | `/user/update_tags` | POST | 更新标签 |
| `d` (updateAvatar) | `/user/update_avatar` | POST | 更新头像 |
| `e` (updatePassword) | `/user/update/password` | POST | 修改密码 |
| `f` (updatePhone) | `/user/update/phone` | POST | 修改手机号 |
| `g` (mineTopics) | `/topic/mine/topics` | GET | 我的帖子 |
| `h` (deleteTopic) | `/topic/delete/{id}` | POST | 删除帖子 |
| `i` (mineReward) | `/topic/mine_reward` | GET | 我的悬赏 |
| `j` (mineSale) | `/topic/mine_sale` | GET | 我的出售 |
| `k` (myCommentList) | `/comment/my_comment_list` | GET | 我的评论 |
| `l` (myReplyList) | `/comment/my_reply_list` | GET | 我的回复 |
| `m` (removePending) | `/topic/remove_topic_pending` | GET | 移除待审 |
| `n` (removeScratch) | `/topic/remove-topic-scratch` | GET | 移除刮刮卡 |
| `o` (checkScratch) | `/topic/check-exists-scratch/{id}` | GET | 检查刮刮卡 |
| `p` (checkPending) | `/topic/check-topic-pending-status/{id}` | GET | 检查待审状态 |
| `q` (likeTopics) | `/topic/like/topics` | GET | 赞过的帖子 |
| `r` (footTopics) | `/topic/foot/topics` | GET | 浏览足迹 |
| `s` (storeList) | `/store/user_pack` | GET | 背包 |
| `t` (storeLog) | `/store/log` | GET | 商店日志 |
| `u` (userInfo) | `/user/info/{id}` | GET | 用户信息 |
| `v` (messages) | `/user/messages` | GET | 消息列表 |
| `w` (deleteMessage) | `/user/delete/message` | POST | 删除消息 |
| `x` (chatList) | `/chat/list` | GET | 私信列表 |
| `y` (chatDelete) | `/chat/delete` | GET | 删除私信 |
| `z` (chatMessages) | `/chat/messages` | GET | 私信详情 |
| `BB` (chatReadAll) | `/chat/read_all` | POST | 全部已读 |
| `G` (goldLog) | `/user/wealth_gold_log` | GET | 金币日志 |
| `j` (diamondLog) | `/user/wealth_diamond_log` | GET | 钻石日志 |
| `L` (storeList2) | `/store/list` | GET | 商店列表 |
| `M` (storeBuy) | `/store/buy` | GET | 商店购买 |
| `q` (storeGive) | `/store/give` | GET | 商店赠送 |
| `F` (wealth) | `/user/wealth` | GET | 用户财富 |
| `s` (replyEdit) | `/comment/reply_edit` | GET | 编辑评论 |
| `T` (replyEditPost) | `/comment/reply_edit` | POST | 编辑评论提交 |
| `D` (mineScratches) | `/topic/mine/scratches` | GET | 我的刮刮卡 |
| `P` (baseInfo) | `/user/base_info` | POST | 基本信息 |
| `Q` (signatureStatus) | `/user/signature/status` | GET | 签名状态 |
| `R` (nicknameStatus) | `/user/nickname/status` | GET | 昵称状态 |
| `G` (updateNickname) | `/user/update/nickname` | POST | 修改昵称 |
| `H` (updateSignature) | `/user/update/signature` | POST | 修改签名 |
| `X` (editUserBank) | `/user_bank/editUserBank` | POST | 编辑银行卡 |
| `O` (uploadAvatar) | `/upload/avatar` | POST | 上传头像（带进度） |
| `W` (setPayPassword) | `/user/set_pay_password` | POST | 设置支付密码 |
| `u` (withdrawList) | `/vip/withdraw/list` | GET | 提款记录 |
| `d` (buyGive) | `/store/buy_give` | GET | 购买赠送记录 |
| `E` (vipInfo) | `/vip/getVipInfo` | GET | VIP信息 |
| `N` (searchById) | `/user/search_by_id` | GET | 按ID搜用户 |
| `U` (transferCreate) | `/vip/transfer/create` | POST | 转账创建 |
| `J` (rechargeChannel) | `/recharge/channel?plat=1` | GET | 充值渠道 |
| `K` (rechargeCreate) | `/recharge/create` | POST | 充值创建 |
| `l` (exchangeGoldItem) | `/exchange/gold/item` | GET | 金币兑换物品 |
| `I` (exchangeGold) | `/exchange/gold` | POST | 金币兑换 |
| `v` (buyList) | `/topic/buy_list` | GET | 购买列表 |

#### 2.5.6 广告模块（7e11）

| 导出 | 说明 |
|:-----|------|
| `n` (SHUFFLING_KEY) | `"SHUFFLING_KEY"` - 轮播广告键 |
| `f` (DETAILS_CRKEY) | `"DETAILS_CRKEY"` - 详情页右上 |
| `i` (DETAILS_LLKEY) | `"DETAILS_LLKEY"` - 详情页左上 |
| `j` (DETAILS_LRKEY) | `"DETAILS_LRKEY"` - 详情页右上 |
| `g` (DETAILS_CTKEY) | `"DETAILS_CTKEY"` - 详情页顶部 |
| `e` (DETAILS_CCKEY) | `"DETAILS_CCKEY"` - 详情页中部 |
| `d` (DETAILS_CBKEY) | `"DETAILS_CBKEY"` - 详情页底部 |
| `k` (DETAILS_LTKEY) | `"DETAILS_LTKEY"` - 首页左上 |
| `m` (DETAILS_RTKEY) | `"DETAILS_RTKEY"` - 首页右上 |
| `h` (DETAILS_LBKEY) | `"DETAILS_LBKEY"` - 首页左下 |
| `l` (DETAILS_RBKEY) | `"DETAILS_RBKEY"` - 首页右下 |
| `a` (DETAILS_BTKEY) | `"DETAILS_BTKEY"` - 板块顶部 |
| `b` (DETAILS_BYSKEY) | `"DETAILS_BYSKEY"` - 板块右上 |
| `c` (DETAILS_BYXKEY) | `"DETAILS_BYXKEY"` - 板块右下 |
| `O(position)` | 根据广告位key获取尺寸配置 |
| `y(position, id)` | 广告点击统计 |
| `C(position)` | 获取广告列表（POST `/banner/banner_list`） |

广告位尺寸配置（14 个位置）：

| ID | 尺寸 | Key | 位置 |
|:--:|:----:|:----|:------|
| 1 | 598×250 | SHUFFLING_KEY | 轮播 |
| 2 | 188×397 | DETAILS_CRKEY | 页面右侧 |
| 3 | 116×94 | DETAILS_LLKEY | 页面左侧 |
| 4 | 116×94 | DETAILS_LRKEY | 页面右侧 |
| 5 | 1000×65 | DETAILS_CTKEY | 顶部 |
| 6 | 1000×65 | DETAILS_CCKEY | 中部 |
| 7 | 1000×65 | DETAILS_CBKEY | 底部 |
| 8 | 180×350 | DETAILS_LTKEY | 首页左上 |
| 9 | 180×350 | DETAILS_RTKEY | 首页右上 |
| 10 | 180×350 | DETAILS_LBKEY | 首页左下 |
| 11 | 180×350 | DETAILS_RBKEY | 首页右下 |
| 12 | 662×120 | DETAILS_BTKEY | 板块顶部 |
| 13 | 180×350 | DETAILS_BYSKEY | 板块右上 |
| 14 | 180×350 | DETAILS_BYXKEY | 板块右下 |

---

## 3. 组件模块

### 3.1 全局组件

| 组件 | 模块 | 说明 |
|:------|:------|------|
| `user-avatar` | adce | 用户头像，支持 VIP 等级、认证、专家、原创等标识 |
| `advertising` | 82f5 | 广告组件，支持 3 种展示模式（列表/左侧固定/右侧固定） |
| `CollapseTransition` | - | Element UI 折叠过渡动画 |
| `HjGap` | ac1f | 间距组件 |
| `HjLevel` | ac1f | 等级标签 |
| `HjDiyModal` | ac1f | 自定义模态框 |
| `HjToolbar` | 3dfd | 顶部工具栏 |
| `levelUpgrade` | 3dfd | 等级升级提示 |
| `videoDialog` | 3dfd | 视频弹窗播放器（DPlayer + HLS） |
| `openVip` | 6434 | 开通 VIP 弹窗 |
| `FirstTips` | 3dfd | 首次访问提示（域名保护） |

### 3.2 登录弹窗（d932）

`$loginWindow()` — 全局登录窗口组件：

```
数据：
  - form: { Username, Password, CaptchaCode, CaptchaId, Ref, Sign }
  - codeUrl: 验证码图片URL
  
方法：
  - handleSubmit(form) → 调用 /login/signin
  - getCodeImg() → 获取验证码
  - setUserInfo(response) → 存储 token/user 到 Cookie + sessionStorage
  - toastFunc(response) → 处理不同登录类型（普通/VIP路线/会员特权）
  - close() → 销毁弹窗
```

登录类型处理：
- `type=1`：普通登录
- `type=2`：VIP 域名登录 → 存储用户信息
- `type=3`：会员特权路线 → 引导开通 VIP
- `type=4`：会员可尝试会员线路 → 显示 VIP 域名 + 复制按钮

### 3.3 确认弹窗（0303）

`$hjConfirm(text, options)` — 全局确认对话框：

```
属性：
  - visible: 显示状态
  - text: 消息内容
  - title: 标题
  - cancelText / okText: 按钮文案
  - donttip: 是否显示"不再提示"复选框
  - checked: 复选框状态
  
方法：
  - onCancel() → 取消回调
  - onOk({ donttip }) → 确认回调
```

### 3.4 图片验证码拖拽组件（5c9f）

`dragVerifyImgChip` — 滑块拼图验证码：

```
Props：
  - isPassing: 是否通过验证
  - width/height: 尺寸
  - imgsrc: 验证图片
  - text / successText: 提示文案
  - handlerIcon / successIcon: 图标
  
Events：
  - update:isPassing
  - passcallback: 验证通过回调
  - refresh: 刷新验证
  - passfail: 验证失败
  - handlerMove: 拖动中
```

### 3.5 帖子验证组件（1221）

`Verify` — 图片验证弹窗，集成 `dragVerifyImgChip`：

```
Props：
  - closeVerify: 关闭验证回调
  - isShow: 显示状态
  
Events：
  - submit: 验证提交（携带 isPassing）
```

### 3.6 Quill 编辑器扩展（cbc2）

自定义 blot 支持：
- **音频** (`audio`)：`<audio controls>` 元素
- **视频** (`video`)：`<video controls>` 元素，支持宽高属性
- **链接文件** (`link`)：`<a download>` 文件下载链接
- **图片** (`image`)：支持 emoji（`data-emojiv`）、视频附件

### 3.7 全局指令（91ae）

| 指令 | 说明 |
|:------|------|
| `v-content` | 内容渲染：解析 `[emoji]`、`[door]`、`[book]`、`[sell]`、`[link]` 等标记，嵌入 DPlayer 视频播放器 |
| `v-lazyloadimg` | 图片懒加载 + 自定义解码（`.hj`、`.txt` 后缀图片） |

### 3.8 全局过滤器（7897）

| 过滤器 | 说明 |
|:--------|------|
| `formatSeconds` | 秒 → 时分天格式化 |
| `avatarUrl` | 头像 URL 处理 |
| `formatTime` | 时间格式化（5 种格式） |
| `moneyType` | 金额类型（1=金币，2=钻石） |
| `showNumber` | 数字缩写（1k, 10k, 1M） |
| `newshowNumber` | 评论数显示（<100 显示实际，≥100 显示 99+） |
| `diamondShow` | 钻石显示格式化 |
| `bankCode` | 银行卡号脱敏 |

---

## 4. 工具模块

### 4.1 Cookie 工具（6b26）

```typescript
class CookieUtil {
  static TOKEN = "token"
  static ID = "uid"
  static USER = "user"
  static NOTLOGIN = "NOTLOGIN"
  static EXPIRESTIME = 604800000    // 7 天
  static MAXEXPIRESTIME = 31536000000  // 1 年
  
  static RequestParams(): { token: string; id: string }
  static set(name, value, expireMs)
  static get(name): string
  static remove(name)
  static isLogon(): boolean
  static logout()
}
```

### 4.2 Base64 自定义编码（dafe）

```typescript
class CustomCipher {
  static encode(str): string    // 自定义 Base64 编码
  static decode(str): string    // 自定义 Base64 解码
  static encodeUnicode(str): string
  static decodeUnicode(str): string
}
```

### 4.3 URL 工具（8566）

```typescript
class UrlUtil {
  static get(): Record<string, string>   // 解析 URL 参数
  static set(base, params): string       // 拼接 URL 参数
}
```

### 4.4 内容处理（dafe）

```typescript
// 时间格式化
static formatDate(date?): { Year, Month, Date, Hours, Minutes, Seconds, Weeks, timestamp, millisecond }

// 内容转纯文本
static stripHtml(content, attachments): string   // 移除所有 HTML 标签

// 内容转摘要
static getSummary(content, attachments, length): string  // 截取前 N 字符

// 视频附件处理
static processVideo(attachments, content): string  // 将 video 附件转为 img 占位

// 图片解码
static loadImg(attachment): Promise<string>  // 异步加载并解码图片

// 内容预处理
static preProcessContent(content, attachments): string  // 预处理内容

// 设置传送门
static setDoor(content, doors): string  // 替换 [door] 标记

// 设置书城
static setBook(content, books): string  // 替换 [book] 标记
```

### 4.5 Emoji 模块（b1fb + 29ad）

**Emoji 字典**（4 组，共 50+ 表情）：

| 组 | ID 范围 | 数量 | 示例 |
|:---|:-------|:----:|------|
| `n` (基础) | 001-032 | 32 | [Emm], [白眼], [悲伤], [打脸], [大哭], [呆], [狗头], ... |
| `i` (扩展1) | 101-110 | 10 | [晕], [渴求], [阴险], [调皮蛋], [流泪], [微笑], ... |
| `a` (扩展2) | 201-208 | 8 | [赞], [恋爱], [认真], [飞吻], ... |
| `c` (扩展3) | 301-309 | 9 | [开心], [唱歌], [可爱], [比心], [吃手手], ... |

**Emoji 解析流程**（29ad 模块）：

```
1. parseEmojis(content) → string[]     // 从内容中提取 emoji IDs
2. replaceEmojiText(content) → string   // 将 [emoji]xxx[/emoji] 替换为显示名
3. replaceEmojiHtml(content) → string   // 将 [emoji]xxx[/emoji] 替换为 <img> 标签
4. restoreEmoji(content) → string       // 将 <img> 标签还原为 [emoji]xxx[/emoji]
```

**特殊标记解析**：
- `[door]id[/door]` → 传送门组件（帖子/用户）
- `[book]id[/book]` → 书城传送门
- `[sell]content[/sell]` → 出售内容区块
- `[link url="..."]text[/link]` → 外链卡片

### 4.6 签到组件（3dfd - FirstTips）

首次访问提示弹窗，包含：
1. 域名保护提醒（防劫持指南）
2. 二次确认弹窗（倒计时 3 秒自动进入）
3. 自动复制域名到剪贴板

---

## 5. 视频播放系统

### 5.1 DPlayer 集成

原始应用在 `v-content` 指令中内嵌 DPlayer：

```javascript
// 视频解析流程
1. 检测内容中的 <video> 标签
2. 调用 attachment API 获取视频地址
3. 创建 DPlayer 实例，配置 customHls 类型
4. HLS manifest 解析：注入 key-path 用于视频分段解密
5. 多线路切换：normal1 / normal2 / vip
6. 出售内容保护：预览 30 秒，完整版需购买
7. VIP 校验：vip 线路需要 VIP 1+ 等级
```

### 5.2 视频组件（videoDialog）

独立的视频弹窗播放器：
- 容器：`.main-player`
- 支持 HLS 自定义类型（Hls.js p2p 配置）
- 通过 store 的 `videoData` 状态管理显隐

---

## 6. 图片系统

### 6.1 图片解码

原始应用使用自定义 Base64 编码（非标准 Base64），编码字符集：

```
ABCD*EFGHIJKLMNOPQRSTUVWXYZ#yzabcdefghijklmnopqrstuvwxyz1234567890
```

图片 URL 特征：
- `.hj` 后缀 → 需要解码
- `.jpg.txt` / `.jpeg.txt` / `.png.txt` / `.gif.txt` → 需要解码
- 本地图片（数字 ID）→ `/images/common/avatar/{id}.jpg`

### 6.2 懒加载

使用 `IntersectionObserver` 实现图片懒加载：
- 加载前显示占位图 `/images/common/project/loading.gif`
- 加载失败显示 `/images/common/setqrimg2.png`
- 支持重试机制（点击图片重新加载）

---

## 7. 与当前项目的对照

### 7.1 已实现的功能

| 功能 | 原始应用 | 当前项目 | 状态 |
|:------|:--------|:---------|:----:|
| 镜像源配置 | Cookie 硬编码 | settings store + X-Backend 头 | ✅ |
| 登录 | 弹窗式 | 页面式 + Sign 算法 | ✅ |
| 帖子列表 | Axios + 分页 | request.ts + 分页 | ✅ |
| 帖子详情 | 路由 /post/details | 路由 /topic/:pid | ✅ |
| 视频播放 | DPlayer 内嵌指令 | DPlayer + v-content 指令 | ✅ |
| 加密图片 | 自定义 Base64 | utils/image.ts 自定义Decode | ✅ |
| Emoji 解析 | 4 组 50+ 表情 | 待移植 | ⬜ |
| 用户主页 | /homepage/:uid | /homepage/:userId/:nickname | ✅ |
| 关注/粉丝 | relation store | user store 关注列表缓存 | ✅ |
| 搜索 | /es | /search | ✅ |
| 评论 | reply_list | getComments | ✅ |

### 7.2 缺失的重要功能

| 功能 | 原始模块 | 优先级 | 说明 |
|:------|:--------|:-----:|------|
| **每日签到** | `1f24.y` → `/user/user_sign_in` | P0 | 用户活跃度 |
| **帖子创建/编辑** | `1f24.v/z` → `/topic/create` `/topic/edit` | P0 | 核心交互 |
| **点赞/收藏** | `1f24.a/c` → `/favorite/add` `/favorite/delete` | P0 | 社交互动 |
| **私信聊天** | `1f24.w` → `/chat/message` | P1 | 用户沟通 |
| **标签系统** | `1f24.g` → `/tag/tags` | P1 | 内容分类 |
| **板块浏览** | `1f24.e` → `/topic/node` | P1 | 导航结构 |
| **用户信息** | `b5aa.u` → `/user/info/{id}` | P1 | 个人主页数据 |
| **我的帖子** | `b5aa` 部分接口 | P1 | 个人中心 |
| **VIP 系统** | `81ee` 模块 + `6434` 组件 | P2 | 会员功能 |
| **商城/背包** | `b5aa` 部分接口 | P2 | 虚拟物品 |
| **提款/充值** | `81ee.c/d/f` + `b5aa` 部分 | P2 | 支付功能 |
| **广告系统** | `7e11` 模块 + `82f5` 组件 | P3 | 商业化 |
| **签到弹窗** | `3dfd.FirstTips` | P3 | 域名保护 |
| **图片验证码** | `21e4` + `5c9f` | P2 | 注册/敏感操作 |
| **富文本编辑器** | `cbc2` (Quill 扩展) | P2 | 发帖编辑 |
| **全局通知** | `ac1f.LoginWindow` | P3 | 系统消息 |

### 7.3 技术差异

| 维度 | 原始应用 | 当前项目 |
|:------|:--------|:---------|
| 框架 | Vue 2.6 + Options API | Vue 3.5 + Composition API + `<script setup>` |
| UI | Element UI | Vant 4 (移动端优先) |
| 构建 | Webpack 4 | Vite 6 |
| 状态 | Vuex | Pinia |
| 路由 | Vue Router 3 | Vue Router 4 |
| HTTP | Axios | Fetch API |
| 部署 | 传统 Nginx | Cloudflare Workers |

---

## 8. 移植方案

### 8.1 高优先级（第一波）

**1. 每日签到**
- Store: `stores/hot.ts` 新增 `signInStatus` 状态
- API: 在 `api/request.ts` 新增 `signIn()` 调用 `/user/user_sign_in`
- Component: 在 `HomeView` 或 `UserHomeView` 添加签到按钮
- Router: 无需新增路由

**2. 帖子创建/编辑**
- API: `api/request.ts` 新增 `createTopic()` / `editTopic()` / `getTopicEdit()`
- Component: 新建 `CreateTopicView.vue`（路由 `/post/create`）
- Store: 复用 `stores/settings.ts` 获取板块列表

**3. 点赞/收藏**
- API: `api/request.ts` 新增 `likeTopic()` / `addFavorite()` / `delFavorite()`
- Component: 在 `TopicView` 中添加点赞/收藏按钮
- Store: 更新 `stores/user.ts` 中的收藏计数

**4. Emoji 解析**
- Utils: 新建 `src/utils/emoji.ts`，移植 b1fb 模块的 4 组 emoji 字典 + 29ad 模块的解析函数
- Plugin: 扩展现有 `plugins/content.ts` 的 v-content 指令
- Types: `types/index.ts` 新增 EmojiItem 类型

### 8.2 中优先级（第二波）

**5. 私信聊天**
- API: `api/request.ts` 新增 `sendChatMessage()` / `getChatList()` / `getChatMessages()`
- Component: 新建 `ChatView.vue`（路由 `/message/chat/:target`）
- Store: 新增 `stores/chat.ts`

**6. 标签浏览**
- API: `api/request.ts` 新增 `getTags()`（已有）/ `searchByTag()`
- Component: 在 `SearchView` 中增加标签筛选
- Router: 新增 `/tags` 路由

**7. 用户信息增强**
- API: `api/request.ts` 新增 `getUserInfo()`（已有）/ `updateUserInfo()`
- Component: 在 `UserHomeView` 中展示更多信息（VIP、等级、资产）

**8. 我的帖子**
- API: `api/request.ts` 新增 `getMineTopics()` / `deleteTopic()` / `getMineReward()`
- Component: 新建 `MyPostsView.vue`（路由 `/users/my-posts`）
- Router: 添加到 TabBar 或用户菜单

### 8.3 低优先级（第三波）

**9. VIP 系统**
- API: 移植 `81ee` 模块全部接口
- Component: 移植 `6434` (openVip 弹窗) 为 Vant 版本
- Store: 新增 `stores/vip.ts`

**10. 商城/背包**
- API: 移植 `b5aa` 中 store 相关接口
- Component: 新建 `BackpackView.vue` / `StoreView.vue`

**11. 支付功能**
- API: 移植充值/提款接口
- Component: 新建 `RechargeView.vue` / `WithdrawView.vue`
- Router: `/wallet/recharge` / `/wallet/withdraw`

**12. 富文本编辑器**
- Component: 集成 Quill.js（移植 `cbc2` 的自定义 blot）
- Page: 嵌入 `CreateTopicView` 中

---

## 9. 移植注意事项

### 9.1 移植策略

1. **API 层优先**：先在 `api/request.ts` 中补充所有缺失的 API 函数，保持与原始应用的接口契约一致
2. **Store 层跟进**：为新增功能创建对应的 Pinia store（chat/vip/store 等）
3. **组件层实现**：按优先级逐步创建视图组件，使用 Vant 4 替代 Element UI 组件
4. **工具层移植**：emoji、图片解码等工具函数可直接移植到 `utils/`

### 9.2 需要注意的差异

- 原始应用使用 **Cookie** 存储 token，当前项目使用 **settings store（localStorage）**
- 原始应用的 API 基础路径是 `/api`（通过 axios baseURL），当前项目通过 Cloudflare Worker 代理
- 原始应用的图片解码使用 jQuery AJAX，当前项目使用 `fetch` + `utils/image.ts`
- 原始应用的视频播放直接内嵌在指令中，当前项目已拆分为 `plugins/content.ts`

### 9.3 接口兼容性

所有移植的 API 调用都通过当前项目的 `request()` 函数，自动获得：
- `X-Backend` 镜像源支持
- `X-User-Id` / `X-User-Token` 认证
- Base64 多层加密自动解密
- snake_case → camelCase 自动转换

---

> **关联文档**：[01-架构概览.md](../architecture/01-架构概览.md)（系统架构）、[01-API 参考.md](./01-API%20参考.md)（接口定义）、[02-数据字典.md](./02-数据字典.md)（类型定义）
