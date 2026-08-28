/**
 * 极简个人导航站 - 默认配置与精选书签数据
 */

const DEFAULT_ENGINES = [
  { id: 'google', name: 'Google', icon: '🔍', url: 'https://www.google.com/search?q=' },
  { id: 'baidu', name: '百度', icon: '🐾', url: 'https://www.baidu.com/s?wd=' },
  { id: 'bing', name: 'Bing', icon: '🌊', url: 'https://www.bing.com/search?q=' },
  { id: 'github', name: 'GitHub', icon: '🐙', url: 'https://github.com/search?q=' },
  { id: 'perplexity', name: 'Perplexity', icon: '🧠', url: 'https://www.perplexity.ai/search?q=' },
  { id: 'bilibili', name: 'Bilibili', icon: '📺', url: 'https://search.bilibili.com/all?keyword=' }
];

const DEFAULT_BOOKMARKS = [
  {
    id: 'cat-ai',
    name: '个人生产力',
    icon: '🤖',
    items: [
      {
        id: 'bm-chatgpt',
        title: 'ChatGPT',
        url: 'https://chatgpt.com',
        desc: 'OpenAI 智能对话与多模态助手',
        icon: '🤖',
        pinned: true
      },
      {
        id: 'bm-claude',
        title: 'Claude',
        url: 'https://claude.ai',
        desc: 'Anthropic 高效长文本与编码助手',
        icon: '🧠',
        pinned: true
      },
      {
        id: 'bm-gemini',
        title: 'Google Gemini',
        url: 'https://gemini.google.com',
        desc: 'Google 多模态大模型',
        icon: '💎',
        pinned: false
      },
      {
        id: 'bm-perplexity',
        title: 'Perplexity AI',
        url: 'https://www.perplexity.ai',
        desc: 'AI 智能联网搜索引擎与答案综述',
        icon: '🔍',
        pinned: true
      },
      {
        id: 'bm-deepseek',
        title: '家庭路由器',
        url: 'http://router.redith.cn:9090/',
        desc: '家里的路由器访问',
        icon: '🌐',
        pinned: false
      },
      {
        id: 'bm-midjourney',
        title: 'Midjourney',
        url: 'https://www.midjourney.com',
        desc: '顶级 AI 图像生成与艺术创作',
        icon: '🎨',
        pinned: false
      }
    ]
  },
  {
    id: 'cat-dev',
    name: '极客与开发',
    icon: '⚡',
    items: [
      {
        id: 'bm-github',
        title: 'MyGitHub',
        url: 'https://github.com/huawuhen',
        desc: '全球最大的代码托管与开源协作平台',
        icon: '🐙',
        pinned: true
      },
      {
        id: 'bm-vercel',
        title: 'Vercel',
        url: 'https://vercel.com',
        desc: '前端与全栈应用极速构建与托管',
        icon: '▲',
        pinned: true
      },
      {
        id: 'bm-cloudflare',
        title: 'Cloudflare',
        url: 'https://dash.cloudflare.com',
        desc: '全球 CDN、DNS 及边缘计算服务',
        icon: '☁️',
        pinned: false
      },
      {
        id: 'bm-stackoverflow',
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        desc: '开发者问答社区与疑难解答',
        icon: '🥞',
        pinned: false
      },
      {
        id: 'bm-mdn',
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/zh-CN/',
        desc: '权威的前端 Web 技术与 API 参考文档',
        icon: '📖',
        pinned: false
      },
      {
        id: 'bm-devdocs',
        title: 'DevDocs',
        url: 'https://devdocs.io',
        desc: '极速离线 API 文档聚合检索',
        icon: '🛠️',
        pinned: false
      }
    ]
  },
  {
    id: 'cat-tools',
    name: '个人搭建',
    icon: '🛠️',
    items: [
      {
        id: 'bm-notion',
        title: 'Blog',
        url: 'https://19940816.xyz/',
        desc: '个人博客',
        icon: '📝',
        pinned: true
      },
      {
        id: 'bm-figma',
        title: '直连网盘',
        url: 'https://git.19940816.xyz/',
        desc: '部署在vps直连网盘',
        icon: '☁️',
        pinned: false
      },
      {
        id: 'bm-linear',
        title: 'tvbox订阅',
        url: 'https://tvrss.19940816.xyz/',
        desc: '部署在 cf 的 tvbox订阅RSS',
        icon: '🎬',
        pinned: false
      },
      {
        id: 'bm-excalidraw',
        title: 'Dokcer 镜像',
        url: 'https://docker.19940816.xyz/',
        desc: '部署在 cf 的镜像加速',
        icon: '✏️',
        pinned: false
      },
      {
        id: 'bm-deepl',
        title: 'GitHub 加速',
        url: 'https://github.19940816.xyz/',
        desc: '部署在 cf 的镜像加速',
        icon: '🌐',
        pinned: false
      },
      {
        id: 'bm-tinypng',
        title: '在线图床',
        url: 'https://tuchuang.19940816.xyz/',
        desc: '部署在 cf 的图床',
        icon: '🎨',
        pinned: false
      }
    ]
  },
  {
    id: 'cat-reads',
    name: '资讯与社区',
    icon: '📚',
    items: [
      {
        id: 'bm-v2ex',
        title: 'V2EX',
        url: 'https://www.v2ex.com',
        desc: '创意工作者讨论与生活社区',
        icon: '🔥',
        pinned: true
      },
      {
        id: 'bm-hn',
        title: 'Hacker News',
        url: 'https://news.ycombinator.com',
        desc: '全球极客与创业前沿科技头条',
        icon: '🍊',
        pinned: false
      },
      {
        id: 'bm-sspai',
        title: '少数派',
        url: 'https://sspai.com',
        desc: '高质量数字消费与生产力生活指南',
        icon: '🔴',
        pinned: false
      },
      {
        id: 'bm-reddit',
        title: 'Reddit',
        url: 'https://www.reddit.com',
        desc: '全球互联网讨论与兴趣圈子',
        icon: '👾',
        pinned: false
      },
      {
        id: 'bm-producthunt',
        title: 'Product Hunt',
        url: 'https://www.producthunt.com',
        desc: '每日最新酷炫科技产品与工具发现',
        icon: '🐱',
        pinned: false
      },
      {
        id: 'bm-juejin',
        title: '稀土掘金',
        url: 'https://juejin.cn',
        desc: '面向开发者的中文技术分享社区',
        icon: '💎',
        pinned: false
      }
    ]
  },
  {
    id: 'cat-media',
    name: '影音与休闲',
    icon: '☕',
    items: [
      {
        id: 'bm-bilibili',
        title: '哔哩哔哩',
        url: 'https://www.bilibili.com',
        desc: '国内领先的年轻人生态视频社区',
        icon: '📺',
        pinned: true
      },
      {
        id: 'bm-youtube',
        title: 'YouTube',
        url: 'https://www.youtube.com',
        desc: '全球最大视频分享与学习平台',
        icon: '🎬',
        pinned: true
      },
      {
        id: 'bm-music',
        title: '网易云音乐',
        url: 'https://music.163.com',
        desc: '发现好音乐与音乐社区',
        icon: '🎵',
        pinned: false
      },
      {
        id: 'bm-douban',
        title: '豆瓣电影',
        url: 'https://movie.douban.com',
        desc: '电影评分、影评与影讯发现',
        icon: '🍀',
        pinned: false
      },
      {
        id: 'bm-steam',
        title: 'Steam',
        url: 'https://store.steampowered.com',
        desc: '全球数字游戏发行与社区平台',
        icon: '🎮',
        pinned: false
      }
    ]
  }
];
