
import { NodeType, NodeStatus } from './types';
import type { GameNode, YCQuestion } from './types';

export const INITIAL_METRICS = {
  cash: 5000,
  discordMembers: 1,
  githubStars: 0,
  mrr: 0,
  sanity: 100,
  users: 0,
  techDebt: 0
};

// Helper to clean up creation
const n = (id: string, label: string, cluster: string, tier: number, type: NodeType, status: NodeStatus, cost: number, risk: number, reward: any, amount: number, desc: string): GameNode => ({
    id, label, cluster, tier, type, status, energyCost: cost, risk, rewardType: reward, baseRewardAmount: amount, description: desc
});

// Helper for Hubs
const hub = (id: string, label: string, cluster: string, desc: string): GameNode => ({
    id, label, cluster, tier: 0, type: NodeType.Hub, status: NodeStatus.Unlocked, energyCost: 0, risk: 0, rewardType: 'vanity', baseRewardAmount: 0, description: desc
});

export const INITIAL_NODES: GameNode[] = [
  
  // --- CLUSTER: PRODUCT (VS Code / GitHub) ---
  hub('hub_code', 'LOCALHOST', 'code', 'The IDE where dreams are born and memory leaks are ignored.'),
  n('localhost', 'Commit to Main', 'code', 0, NodeType.Product, NodeStatus.Unlocked, 20, 40, 'users', 10, 'No tests, no fear.'),
  n('fix_bug', 'Fix Critical Bug', 'code', 0, NodeType.Product, NodeStatus.Unlocked, 30, 10, 'sanity', 15, 'Users are screaming in caps lock.'),
  n('ship_feature', 'Ship New Feature', 'code', 0, NodeType.Product, NodeStatus.Unlocked, 50, 20, 'users', 50, 'It works on my machine.'),
  n('refactor', 'Refactor V1', 'code', 0, NodeType.Product, NodeStatus.Unlocked, 40, 5, 'sanity', 20, 'Deleting legacy code feels better than sex.'),
  n('ai_wrapper', 'Add "AI" Label', 'code', 0, NodeType.Vanity, NodeStatus.Unlocked, 15, 5, 'users', 100, 'Just an if-statement, but call it "Neural Engine".'),
  n('copy_stack', 'Copy StackOverflow', 'code', 0, NodeType.Product, NodeStatus.Unlocked, 10, 60, 'sanity', -5, 'I have no idea how this regex works.'),
  n('tech_debt', 'Ignore Linter', 'code', 0, NodeType.Product, NodeStatus.Unlocked, 5, 20, 'sanity', 5, 'Red squiggly lines are just suggestions.'),

  // --- CLUSTER: INFRASTRUCTURE (AWS) ---
  hub('hub_infra', 'AWS-WEST-1', 'infra', 'The cloud bill that will eventually bankrupt you.'),
  n('aws_credits', 'Apply AWS Credits', 'infra', 0, NodeType.Product, NodeStatus.Locked, 10, 10, 'cash', 5000, 'Free money that eventually ruins you.'),
  n('vercel', 'Deploy to Vercel', 'infra', 0, NodeType.Product, NodeStatus.Unlocked, 10, 0, 'users', 5, 'Instant deploys, instant dopamine.'),
  n('db_crash', 'Fix DB Outage', 'infra', 0, NodeType.Product, NodeStatus.Locked, 80, 50, 'sanity', -20, 'DROP TABLE users; -- oops.'),
  n('over_provision', 'Buy Bigger Server', 'infra', 0, NodeType.Vanity, NodeStatus.Unlocked, 20, 0, 'cash', -500, 'We need 64GB RAM for our 12 users.'),
  n('s3_leak', 'Public S3 Bucket', 'infra', 0, NodeType.Product, NodeStatus.Unlocked, 5, 90, 'sanity', -50, 'Whoops, there go the passports.'),

  // --- CLUSTER: REDDIT (The Hive Mind) ---
  hub('hub_reddit', 'REDDIT', 'reddit', 'The front page of the internet (and your depression).'),
  n('r_startups', 'r/Startups Post', 'reddit', 2, NodeType.EchoChamber, NodeStatus.Unlocked, 20, 15, 'users', 20, 'Ask for feedback, get told your idea sucks.'),
  n('r_roast', 'r/RoastMyStartup', 'reddit', 2, NodeType.EchoChamber, NodeStatus.Unlocked, 15, 40, 'sanity', -10, 'Emotional damage guaranteed.'),
  n('r_saas', 'r/SaaS Case Study', 'reddit', 2, NodeType.Growth, NodeStatus.Unlocked, 40, 10, 'mrr', 20, 'Write a 2000 word essay to get 2 signups.'),
  n('reddit_ads', 'Buy Reddit Ads', 'reddit', 2, NodeType.Vanity, NodeStatus.Unlocked, 60, 10, 'users', 200, 'Burning cash for downvotes.'),
  n('r_sideproject', 'r/SideProject', 'reddit', 2, NodeType.EchoChamber, NodeStatus.Unlocked, 10, 5, 'users', 5, 'Look at my todo app.'),
  n('astroturf', 'Fake Comments', 'reddit', 2, NodeType.DarkPattern, NodeStatus.Unlocked, 25, 60, 'users', 40, 'Use alts to praise your own app. Risky.'),

  // --- CLUSTER: TWITTER/X (The Arena) ---
  hub('hub_twitter', 'X CORP', 'twitter', 'Screaming into the void.'),
  n('x_thread', 'Threadboi Thread', 'twitter', 2, NodeType.Vanity, NodeStatus.Unlocked, 25, 20, 'users', 50, '👇🧵 1/20 "How I made $0 in 6 months".'),
  n('x_meme', 'Post Tech Meme', 'twitter', 2, NodeType.Vanity, NodeStatus.Unlocked, 10, 5, 'users', 10, 'Relatable content about npm install.'),
  n('x_fight', 'Fight a VC', 'twitter', 2, NodeType.EchoChamber, NodeStatus.Unlocked, 30, 70, 'vanity', 500, 'High risk, high ego boost.'),
  n('x_dm', 'Cold DM Investors', 'twitter', 2, NodeType.GoldMine, NodeStatus.Unlocked, 40, 40, 'cash', 1000, 'Please bro, just a seed round.'),
  n('blue_check', 'Buy Verification', 'twitter', 2, NodeType.Vanity, NodeStatus.Unlocked, 10, 0, 'cash', -8, 'Now you are notable.'),
  n('rage_bait', 'Post Rage Bait', 'twitter', 2, NodeType.EchoChamber, NodeStatus.Unlocked, 15, 80, 'users', 100, ' "Remote work is for lazy people."'),

  // --- CLUSTER: LINKEDIN (The Cringe) ---
  hub('hub_linkedin', 'LINKEDIN', 'linkedin', 'Agree?'),
  n('li_story', 'Sob Story Post', 'linkedin', 1, NodeType.Vanity, NodeStatus.Unlocked, 20, 10, 'vanity', 200, '"I fired my cofounder and here is what it taught me about B2B sales."'),
  n('li_scrape', 'Scrape Emails', 'linkedin', 1, NodeType.DarkPattern, NodeStatus.Unlocked, 30, 30, 'users', 40, 'GDPR is just a suggestion.'),
  n('li_leader', 'Thought Leadership', 'linkedin', 1, NodeType.Vanity, NodeStatus.Unlocked, 25, 0, 'vanity', 50, 'Agree?'),
  n('li_connect', 'Automated Connect', 'linkedin', 1, NodeType.DarkPattern, NodeStatus.Unlocked, 30, 50, 'users', 10, 'Spamming 500 CTOs "I\'d love to add you to my network".'),
  n('li_webinar', 'Host Webinar', 'linkedin', 1, NodeType.Growth, NodeStatus.Unlocked, 50, 10, 'mrr', 10, 'Speaking for 1 hour to 3 people.'),

  // --- CLUSTER: LAUNCHPAD (Product Hunt) ---
  hub('hub_launch', 'PRODUCT HUNT', 'launch', 'The daily dopamine slot machine.'),
  n('ph_launch', 'Launch Day', 'launch', 3, NodeType.Growth, NodeStatus.Unlocked, 90, 50, 'users', 1000, 'The most stressful day of your life.'),
  n('ph_teaser', 'Teaser Page', 'launch', 3, NodeType.Growth, NodeStatus.Unlocked, 20, 0, 'users', 50, 'Coming soon...'),
  n('hn_show', 'Show HN', 'launch', 3, NodeType.Growth, NodeStatus.Unlocked, 30, 60, 'users', 500, 'Brutal technical feedback or viral glory.'),
  n('hunter_dm', 'DM Top Hunter', 'launch', 3, NodeType.Vanity, NodeStatus.Unlocked, 20, 30, 'stars', 10, 'Begging Chris Messina to hunt you.'),
  n('bot_upvotes', 'Buy Upvotes', 'launch', 3, NodeType.DarkPattern, NodeStatus.Locked, 40, 90, 'users', 500, 'Immediate ban risk.'),

  // --- CLUSTER: DARK ARTS (Desperation) ---
  hub('hub_dark', 'DARK WEB', 'dark', 'Desperate times call for desperate measures.'),
  n('buy_list', 'Buy Email List', 'dark', 4, NodeType.DarkPattern, NodeStatus.Locked, 50, 80, 'users', 300, 'Illegal and ineffective.'),
  n('fake_reviews', 'Fake G2 Reviews', 'dark', 4, NodeType.DarkPattern, NodeStatus.Locked, 40, 60, 'mrr', 50, 'Review swapping ring.'),
  n('churn_hide', 'Hide Cancel Button', 'dark', 4, NodeType.DarkPattern, NodeStatus.Locked, 20, 90, 'mrr', 100, 'Make them email support to cancel.'),
  n('competitor_click', 'Click Comp Ads', 'dark', 4, NodeType.DarkPattern, NodeStatus.Unlocked, 15, 10, 'sanity', 5, 'Draining their budget $5 at a time.'),

  // --- CLUSTER: IRL (San Francisco) ---
  hub('hub_sf', 'SAN FRANCISCO', 'sf', 'The Bubble.'),
  n('bluebottle', 'Blue Bottle PA', 'sf', 5, NodeType.IRL, NodeStatus.Unlocked, 20, 0, 'sanity', 10, 'Expensive coffee, rich air.'),
  n('hacker_party', 'Hayes Valley Party', 'sf', 5, NodeType.IRL, NodeStatus.Unlocked, 50, 40, 'stars', 20, 'Networking with people who are also unemployed.'),
  n('walk_lands_end', 'Walk Lands End', 'sf', 5, NodeType.IRL, NodeStatus.Unlocked, 30, 0, 'sanity', 25, 'Touch grass.'),
  n('therapy_sesh', 'Therapy Session', 'sf', 5, NodeType.IRL, NodeStatus.Unlocked, 40, 0, 'sanity', 40, 'Talking about your "trauma" (co-founder disputes).'),
  n('hackathon', 'SF Hackathon', 'sf', 5, NodeType.Growth, NodeStatus.Unlocked, 60, 20, 'stars', 50, 'Sleep on the floor, eat pizza, build junk.'),

  // --- CLUSTER: FUNDING (The Bank) ---
  hub('hub_fund', 'SAND HILL RD', 'fund', 'Where money lives.'),
  n('mom_loan', 'Mom\'s Credit Card', 'fund', 4, NodeType.GoldMine, NodeStatus.Unlocked, 10, 10, 'cash', 2000, 'Thanks mom.'),
  n('grant', 'Gov Grant', 'fund', 4, NodeType.GoldMine, NodeStatus.Locked, 60, 20, 'cash', 5000, 'Fill out 100 PDFs.'),
  n('angel_coffee', 'Angel Coffee', 'fund', 4, NodeType.Growth, NodeStatus.Unlocked, 30, 50, 'cash', 5000, 'He made his money in crypto.'),
  n('accelerator', 'Apply to Techstars', 'fund', 4, NodeType.Vanity, NodeStatus.Unlocked, 40, 10, 'vanity', 100, 'The safety school.'),

  // --- CLUSTER: DESIGN (Figma) ---
  hub('hub_design', 'FIGMA', 'design', 'Where you spend 40 hours picking a shade of blue.'),
  n('pixel_push', 'Align Pixels', 'design', 1, NodeType.Product, NodeStatus.Unlocked, 20, 0, 'sanity', 15, 'It was 1px off.'),
  n('rebrand', 'Total Rebrand', 'design', 1, NodeType.Vanity, NodeStatus.Unlocked, 50, 20, 'vanity', 50, 'New logo, same bugs.'),
  n('dribbble', 'Post Dribbble Shot', 'design', 1, NodeType.Vanity, NodeStatus.Unlocked, 15, 5, 'stars', 5, 'Does not even actally work in code.'),
  n('dark_mode', 'Add Dark Mode', 'design', 1, NodeType.Product, NodeStatus.Unlocked, 30, 5, 'users', 20, 'Developers love it.'),

  // --- CLUSTER: AI (OpenAI) ---
  hub('hub_ai', 'OPENAI', 'ai', 'Just throw a prompt at it.'),
  n('train_model', 'Fine-tune Llama 3', 'ai', 3, NodeType.Product, NodeStatus.Locked, 80, 50, 'stars', 500, 'Burning cash on GPUs to sound smart.'),
  n('prompt_eng', 'Prompt Engineering', 'ai', 3, NodeType.Product, NodeStatus.Unlocked, 10, 10, 'users', 10, 'If you beg the AI nicely it works.'),
  n('vector_db', 'Setup Vector DB', 'ai', 3, NodeType.Product, NodeStatus.Unlocked, 40, 20, 'sanity', 10, 'Pinecone is down again.'),
  n('wrapper', 'GPT Wrapper', 'ai', 3, NodeType.Growth, NodeStatus.Unlocked, 20, 80, 'mrr', 50, 'Sherlocked by OpenAI next week.'),

  // --- CLUSTER: OPS (Notion/Slack) ---
  hub('hub_ops', 'NOTION HQ', 'ops', 'Productivity porn.'),
  n('wiki_garden', 'Organize Wiki', 'ops', 1, NodeType.EchoChamber, NodeStatus.Unlocked, 30, 0, 'sanity', 20, 'Spending 4 hours picking emojis for docs.'),
  n('slack_bot', 'Custom Slack Bot', 'ops', 1, NodeType.Product, NodeStatus.Unlocked, 20, 10, 'sanity', 5, 'It posts cat gifs when you deploy.'),
  n('meeting', 'All Hands Meeting', 'ops', 1, NodeType.EchoChamber, NodeStatus.Unlocked, 50, 100, 'sanity', -10, 'This could have been an email.'),

  // --- CLUSTER: LEGAL (Stripe) ---
  hub('hub_legal', 'DELAWARE', 'legal', 'The boring stuff that kills you.'),
  n('stripe_atlas', 'Incorporate', 'legal', 0, NodeType.Product, NodeStatus.Unlocked, 50, 0, 'cash', -500, 'You are now a C-Corp. Congrats?'),
  n('equity_split', '50/50 Split', 'legal', 0, NodeType.GoldMine, NodeStatus.Unlocked, 10, 90, 'sanity', -20, 'The source of all future resentment.'),
  n('tos_copy', 'Copy/Paste ToS', 'legal', 0, NodeType.DarkPattern, NodeStatus.Unlocked, 5, 50, 'sanity', 5, 'Hope we don\'t get sued.'),
  
  // --- CLUSTER: SALES (The Grind) ---
  hub('hub_sales', 'CRM HELL', 'sales', 'Where human interaction goes to die.'),
  n('cold_email', 'Send 1k Cold Emails', 'sales', 4, NodeType.Growth, NodeStatus.Unlocked, 40, 80, 'users', 10, 'Your domain reputation is now "Spam".'),
  n('apollo_list', 'Scrape Apollo.io', 'sales', 4, NodeType.DarkPattern, NodeStatus.Unlocked, 30, 20, 'users', 5, 'Emailing people who hate you.'),
  n('zoom_demo', 'Do Founder Demo', 'sales', 4, NodeType.GoldMine, NodeStatus.Unlocked, 60, 10, 'mrr', 100, 'They asked for a discount and SOC2 compliance.'),
  n('linkedin_voice', 'Send Voice Notes', 'sales', 4, NodeType.Growth, NodeStatus.Unlocked, 25, 40, 'sanity', -5, 'Hey [Name], just checking in... (Cringe).'),
  n('follow_up', 'The 7th Follow-up', 'sales', 4, NodeType.Product, NodeStatus.Unlocked, 15, 5, 'sanity', -10, 'Just floating this to the top of your inbox.'),

  // --- CLUSTER: SEO (The Long Game) ---
  hub('hub_seo', 'GOOGLE SEARCH', 'seo', 'Writing content for robots, not humans.'),
  n('programmatic_seo', 'Programmatic SEO', 'seo', 3, NodeType.Growth, NodeStatus.Locked, 70, 60, 'users', 300, 'Generating 10,000 pages of garbage text.'),
  n('backlink_buy', 'Buy Backlinks', 'seo', 3, NodeType.DarkPattern, NodeStatus.Unlocked, 40, 80, 'users', 50, 'From a gambling site in Russia. Google is watching.'),
  n('blog_post', 'Write "Ultimate Guide"', 'seo', 3, NodeType.Product, NodeStatus.Unlocked, 50, 0, 'users', 5, 'It will rank in 6 months. Maybe.'),
  n('parasite_seo', 'Parasite SEO', 'seo', 3, NodeType.Growth, NodeStatus.Unlocked, 30, 30, 'users', 40, 'Publishing articles on LinkedIn/Medium to rank fast.'),

  // --- CLUSTER: CONTENT (The Clout / Creator Mode) ---
  hub('hub_content', 'TIKTOK/REELS', 'content', 'Dignity is the price of acquisition.'),
  n('founder_dance', 'Do a Trend Dance', 'content', 2, NodeType.Vanity, NodeStatus.Unlocked, 20, 90, 'users', 500, 'My co-founder refuses to make eye contact now.'),
  n('day_in_life', '"Day in the Life" Vlog', 'content', 2, NodeType.Vanity, NodeStatus.Unlocked, 60, 10, 'discordMembers', 50, 'Filming yourself drinking coffee for 10 mins.'),
  n('podcast_start', 'Start a Podcast', 'content', 2, NodeType.EchoChamber, NodeStatus.Unlocked, 50, 0, 'sanity', 10, 'Just what the world needs. Another tech podcast.'),
  n('reaction_vid', 'React to Apple Event', 'content', 2, NodeType.Growth, NodeStatus.Unlocked, 15, 5, 'users', 20, 'Making a shocked face thumbnail.'),

  // --- CLUSTER: BIOHACKING (Survival & SF Lifestyle) ---
  hub('hub_bio', 'THE BODY', 'bio', 'Optimizing the machine.'),
  n('intermittent_fast', 'Intermittent Fasting', 'bio', 5, NodeType.Product, NodeStatus.Unlocked, 0, 5, 'cash', 50, 'Skipping lunch to save money (and "autophagy").'),
  n('modafinil', 'Order Nootropics', 'bio', 5, NodeType.Product, NodeStatus.Unlocked, 10, 30, 'sanity', 20, 'Focus +100, Anxiety +200.'),
  n('cold_plunge', 'Cold Plunge', 'bio', 5, NodeType.IRL, NodeStatus.Unlocked, 20, 0, 'sanity', 15, 'Posting about it on Instagram is mandatory.'),
  n('soylent', 'Drink Soylent', 'bio', 5, NodeType.Product, NodeStatus.Unlocked, 5, 0, 'cash', 20, 'Solid food is a distraction.'),

  // --- CLUSTER: COMPLIANCE (Enterprise Wall) ---
  hub('hub_security', 'SOC2 HELL', 'security', 'Paperwork meant to kill startups.'),
  n('soc2_audit', 'Start SOC2 Audit', 'security', 4, NodeType.Product, NodeStatus.Locked, 90, 10, 'cash', -2000, 'Drata says we are 10% done.'),
  n('dpa_sign', 'Sign DPA', 'security', 4, NodeType.Product, NodeStatus.Unlocked, 20, 0, 'mrr', 50, 'Promising we wont sell their data (fingers crossed).'),
  n('pen_test', 'Fake Pen Test', 'security', 4, NodeType.DarkPattern, NodeStatus.Unlocked, 10, 60, 'mrr', 20, 'My cousin checked the code, it is fine.'),
  
  // --- CLUSTER: OUTSOURCING (Fiverr/Upwork) ---
  hub('hub_outsource', 'UPWORK', 'outsource', 'Cheap labor is very expensive.'),
  n('hire_fiverr', 'Hire $5 Logo Designer', 'outsource', 3, NodeType.Vanity, NodeStatus.Unlocked, 10, 50, 'vanity', 10, 'It looks like a clip art from 1998.'),
  n('dev_shop', 'Hire Dev Shop', 'outsource', 3, NodeType.Product, NodeStatus.Locked, 60, 40, 'cash', -3000, 'They promised an MVP in 2 weeks. It has been 2 months.'),
  n('va_hire', 'Hire Virtual Assistant', 'outsource', 3, NodeType.Growth, NodeStatus.Unlocked, 15, 10, 'sanity', 5, 'They answer emails so you can doomscroll.'),
  n('buy_template', 'Buy $200 React Template', 'outsource', 3, NodeType.Product, NodeStatus.Unlocked, 20, 20, 'techDebt', 50, 'The code is spaghetti but it looks nice.'),

  // --- CLUSTER: CULTURE & SWAG (The distraction) ---
  hub('hub_culture', 'COMPANY STORE', 'culture', 'Burning runway on t-shirts.'),
  n('print_hoodies', 'Print Company Hoodies', 'culture', 1, NodeType.Vanity, NodeStatus.Unlocked, 30, 0, 'cash', -500, 'You have 0 users but you look legit.'),
  n('stickers', 'Laptop Stickers', 'culture', 1, NodeType.Growth, NodeStatus.Unlocked, 10, 0, 'users', 2, 'Guerrilla marketing on coffee shop tables.'),
  n('offsite', 'Team Offsite in Tulum', 'culture', 1, NodeType.IRL, NodeStatus.Locked, 80, 10, 'cash', -4000, 'Productivity: 0. Vibes: 100. Runway: Gone.'),
  n('pingpong', 'Buy Ping Pong Table', 'culture', 1, NodeType.Vanity, NodeStatus.Unlocked, 20, 0, 'sanity', 10, 'Essential for a team of two people.'),

  // --- CLUSTER: NOMAD LIFE (Remote Work) ---
  hub('hub_nomad', 'BALI', 'nomad', 'Wifi is down but the acai bowl is great.'),
  n('move_bali', 'Move to Canggu', 'nomad', 5, NodeType.IRL, NodeStatus.Unlocked, 50, 60, 'cash', 500, 'Low burn rate, but you are distracted by surfing.'),
  n('coworking', 'WeWork Membership', 'nomad', 5, NodeType.IRL, NodeStatus.Unlocked, 10, 0, 'cash', -300, 'Free beer on tap > Product Market Fit.'),
  n('async_work', 'Go Async', 'nomad', 5, NodeType.EchoChamber, NodeStatus.Unlocked, 5, 30, 'sanity', 10, 'Ignoring Slack messages for 12 hours straight.'),
  n('timezone_hell', '3 AM Zoom Call', 'nomad', 5, NodeType.Growth, NodeStatus.Unlocked, 20, 10, 'sanity', -25, 'Pitching to SF investors from Thailand.'),

  // --- CLUSTER: VC GAMES (The Waiting Game) ---
  hub('hub_vc', 'VC WAITING ROOM', 'vc', 'They love it, they just need to ask their partner.'),
  n('associate_mtg', 'Meeting with Associate', 'vc', 4, NodeType.EchoChamber, NodeStatus.Unlocked, 30, 90, 'sanity', -10, 'They have no power to say yes, only no.'),
  n('term_sheet', 'Predatory Term Sheet', 'vc', 4, NodeType.GoldMine, NodeStatus.Locked, 50, 50, 'cash', 10000, '2x Liquidation Preference. You own 0% now.'),
  n('ghosted', 'Get Ghosted', 'vc', 4, NodeType.EchoChamber, NodeStatus.Unlocked, 10, 100, 'sanity', -20, '"We will get back to you by Friday." (They wont).'),
  n('family_round', 'Friends & Family Round', 'vc', 4, NodeType.GoldMine, NodeStatus.Unlocked, 40, 10, 'cash', 3000, 'Taking money from your grandma. No pressure.'),

  // --- CLUSTER: ENGINEERING SINS (Over-engineering) ---
  hub('hub_eng_sins', 'OVER-ENGINEERING', 'sins', 'Solving problems you do not have yet.'),
  n('rewrite_rust', 'Rewrite in Rust', 'sins', 0, NodeType.Product, NodeStatus.Unlocked, 90, 50, 'stars', 100, 'Memory safe, but product is dead.'),
  n('k8s', 'Kubernetes Cluster', 'sins', 0, NodeType.Product, NodeStatus.Unlocked, 60, 40, 'cash', -200, 'We have 3 users but we scale infinitely.'),
  n('microservices', 'Microservices', 'sins', 0, NodeType.Product, NodeStatus.Unlocked, 50, 30, 'techDebt', 100, 'Now we need a distributed tracing tool.'),
];

export const YC_QUESTIONS: YCQuestion[] = [
  {
    id: 'q1',
    question: "What are you building?",
    condition: (m) => m.githubStars > 50,
    answerWait: "We are building an Uber for...",
    answerPass: "An AI-native, vertical-integrated paradigm shift.",
    answerFail: "A todo list app.",
  },
  {
    id: 'q2',
    question: "Do you have users?",
    condition: (m) => m.users > 2000,
    answerWait: "We are pre-launch.",
    answerPass: `Yes, growing 20% WoW with ${m => m.users} users.`,
    answerFail: "No, but my mom thinks it's cool.",
  },
  {
    id: 'q3',
    question: "How do you make money?",
    condition: (m) => m.mrr > 500,
    answerWait: "We will figure it out later.",
    answerPass: "SaaS subscription model, high margin.",
    answerFail: "Ads? Maybe data selling?",
  },
  {
    id: 'q4',
    question: "Who are your competitors?",
    condition: (m) => m.sanity < 50, 
    answerWait: "Everyone.",
    answerPass: "Google is too slow, OpenAI is too distinct.",
    answerFail: "We have no competitors (Lie).",
  },
  {
    id: 'q5',
    question: "How much runway do you have?",
    condition: (m) => m.cash > 2000,
    answerWait: "Calculating...",
    answerPass: "Enough to hit the next milestone.",
    answerFail: "We are insolvent tomorrow.",
  }
];
