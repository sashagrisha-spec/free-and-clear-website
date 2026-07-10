// Generates one new SEO blog post via the Anthropic API and inserts it into
// lib/blog-posts.ts. Run by .github/workflows/weekly-seo-post.yml.
// Requires env: ANTHROPIC_API_KEY

import fs from 'node:fs';
import { keywordTargets } from './keyword-targets.mjs';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set (add it as a repo secret).');
  process.exit(1);
}

const FILE = 'lib/blog-posts.ts';
const src = fs.readFileSync(FILE, 'utf8');

const slugs = [...src.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const titles = [...src.matchAll(/title: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]);
const today = new Date().toISOString().slice(0, 10);

const system = `You are an SEO content writer for Free & Clear English (freeandclearenglish.com), an English coaching brand for Hebrew-speaking Israeli professionals by Sasha Daniel.
Audience: Hebrew-speaking Israelis aged 30-50 in tech, management and entrepreneurship who already know English but feel a gap when speaking under pressure. Sasha's work: pronunciation, fluency, confidence, and the psychological blocks around speaking.
Tone: warm, direct, human. Never corporate.
HARD RULE: NEVER use an em dash (the "—" character) anywhere. Use commas, colons, or regular hyphens instead.
If you write the post in Hebrew you MUST use gender-neutral plural forms only (אתם, שלכם, לכם, אתכם, עצמכם) and plural verbs (יודעים, מדברים, נסו, שלחו), never masculine singular (אתה, שלך, לך).`;

const targetList = keywordTargets
  .map((t, i) => `${i + 1}. [${t.lang}] ${t.q}${t.note ? `: ${t.note}` : ''}`)
  .join('\n');

const user = `Write ONE new blog post (600-900 words) for the Free & Clear English blog.

These posts are ALREADY published, so do NOT repeat any of these topics:
${titles.map((t) => `- ${t}`).join('\n')}

Below is our prioritized list of target search queries (real SEO keywords Israelis type into Google). Choose the SINGLE highest-priority query from this list that is NOT already covered by a published post above, and write the post to rank for it. Build the title, the <h2> headings, the keywords array, and the excerpt around that exact query and its close variations.

Target queries (highest priority first):
${targetList}

Language rule: write the post in the language tagged next to the chosen query ([he] = Hebrew, [en] = English). Most targets are Hebrew because our audience searches in Hebrew; when in doubt, prefer a Hebrew target.

The body must be HTML using ONLY these tags: <p>, <h2>, <h3>, <ul>, <li>, <strong>, <em>, <a href="...">. Include an engaging opening paragraph, 2 to 4 <h2> sections with practical content, and a closing paragraph whose call to action links to https://www.freeandclearenglish.com/#contact .

Respond with ONLY a raw JSON object, no markdown fences and no commentary, with EXACTLY these fields:
{
  "slug": "unique-kebab-case-slug",
  "title": "Post Title",
  "excerpt": "one clear sentence, 100 to 150 characters",
  "lang": "en" or "he",
  "readingTime": integer number of minutes,
  "keywords": ["keyword one", "keyword two", "keyword three", "keyword four"],
  "category": one of "Pronunciation", "Confidence", "Business English", "Tips", "טיפים",
  "body": "the full HTML body as a single string"
}`;

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system,
    messages: [{ role: 'user', content: user }],
  }),
});

if (!res.ok) {
  console.error('Anthropic API error:', res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
let text = (data.content || []).map((b) => b.text || '').join('').trim();
text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

let post;
try {
  post = JSON.parse(text);
} catch (e) {
  console.error('Failed to parse model JSON:', e.message);
  console.error('Raw output (first 800 chars):\n', text.slice(0, 800));
  process.exit(1);
}

for (const field of ['slug', 'title', 'excerpt', 'lang', 'readingTime', 'keywords', 'category', 'body']) {
  if (post[field] === undefined || post[field] === null || post[field] === '') {
    console.error('Model output missing required field:', field);
    process.exit(1);
  }
}
if (slugs.includes(post.slug)) {
  console.error('Generated slug already exists, skipping to avoid a duplicate:', post.slug);
  process.exit(1);
}

// Safety net: strip any em dashes the model slipped in.
const noDash = (s) => String(s).replaceAll('—', ', ').replaceAll('–', '-');
post.title = noDash(post.title);
post.excerpt = noDash(post.excerpt);
post.body = noDash(post.body);

const escSingle = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
// body goes inside a backtick template literal, so escape backslashes, backticks and ${
const bodyLiteral = String(post.body).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${').trim();
const lang = post.lang === 'he' ? 'he' : 'en';
const readingTime = parseInt(post.readingTime, 10) || 5;
const keywords = (Array.isArray(post.keywords) ? post.keywords : []).slice(0, 6).map((k) => `'${escSingle(k)}'`).join(', ');

const obj = `  {
    slug: '${escSingle(post.slug)}',
    title: '${escSingle(post.title)}',
    excerpt: '${escSingle(post.excerpt)}',
    publishedAt: '${today}',
    lang: '${lang}',
    readingTime: ${readingTime},
    keywords: [${keywords}],
    category: '${escSingle(post.category)}',
    body: \`
${bodyLiteral}
\`.trim(),
  },
`;

const marker = '\n]\n\nexport function getPostBySlug';
const idx = src.indexOf(marker);
if (idx === -1) {
  console.error('Could not find the blogPosts array end marker in', FILE);
  process.exit(1);
}
const out = src.slice(0, idx) + '\n' + obj + src.slice(idx + 1);
fs.writeFileSync(FILE, out);
console.log(`Inserted new post: "${post.title}"`);
console.log(`  slug: ${post.slug} | lang: ${lang} | category: ${post.category}`);
