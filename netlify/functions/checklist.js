exports.handler = async (event) => {
  const token = event.queryStringParameters && event.queryStringParameters.token;
  const secret = process.env.GATE_SECRET;

  if (!token || !secret || token !== secret) {
    return {
      statusCode: 302,
      headers: { Location: "/#section-5" },
      body: "",
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Daily Workflow: Putting It All Together — Saving Tokens with Claude Code</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        /* ===== CSS Variables (Brand Tokens) ===== */
        :root {
            --cream: #f5f1ee;
            --espresso: #3d2b1f;
            --coral: #f24b2e;
            --gold: #c17817;
            --white: #ffffff;
            --muted: #8b7b6e;
            --bg: var(--cream);
            --text: var(--espresso);
            --text-secondary: var(--muted);
            --card-bg: var(--white);
            --code-bg: #2d2017;
            --code-text: #f0e6dc;
            --border: rgba(61, 43, 31, 0.1);
            --shadow: rgba(61, 43, 31, 0.08);
            --font-display: 'Playfair Display', Georgia, serif;
            --font-body: 'Inter', -apple-system, sans-serif;
            --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
            --max-width: 720px;
            --nav-height: 56px;
            --transition: 0.3s ease;
        }

        [data-theme="dark"] {
            --bg: #1a1714;
            --text: #f0e6dc;
            --text-secondary: #a89888;
            --card-bg: #2a2420;
            --code-bg: #1a1410;
            --code-text: #f0e6dc;
            --border: rgba(240, 230, 220, 0.1);
            --shadow: rgba(0, 0, 0, 0.3);
        }

        /* ===== Reset ===== */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ===== Base ===== */
        html { scroll-behavior: smooth; }
        body {
            font-family: var(--font-body);
            font-size: 17px;
            line-height: 1.7;
            color: var(--text);
            background: var(--bg);
            transition: background var(--transition), color var(--transition);
            -webkit-font-smoothing: antialiased;
        }

        /* ===== Progress Bar ===== */
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--coral);
            z-index: 1001;
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ===== Top Nav ===== */
        .top-nav {
            position: fixed;
            top: 3px;
            left: 0;
            right: 0;
            height: var(--nav-height);
            background: var(--bg);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            z-index: 1000;
            transition: background var(--transition);
        }
        .nav-logo {
            height: 28px;
            opacity: 0.85;
        }
        [data-theme="dark"] .nav-logo {
            filter: brightness(10);
        }
        .nav-center {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-family: var(--font-body);
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
            letter-spacing: 0.02em;
        }
        .nav-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .theme-toggle {
            background: none;
            border: 1px solid var(--border);
            border-radius: 8px;
            width: 36px;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all var(--transition);
            color: var(--text);
        }
        .theme-toggle:hover {
            border-color: var(--coral);
            background: rgba(242, 75, 46, 0.05);
        }
        .toc-toggle {
            display: none;
            background: none;
            border: 1px solid var(--border);
            border-radius: 8px;
            width: 36px;
            height: 36px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: var(--text);
        }

        /* ===== Sidebar ToC ===== */
        .sidebar {
            position: fixed;
            top: calc(var(--nav-height) + 3px);
            left: 0;
            width: 280px;
            height: calc(100vh - var(--nav-height) - 3px);
            padding: 32px 24px;
            overflow-y: auto;
            border-right: 1px solid var(--border);
            background: var(--bg);
            z-index: 999;
            transition: transform var(--transition), background var(--transition);
        }
        .sidebar-title {
            font-family: var(--font-display);
            font-size: 14px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 20px;
        }
        .toc-list {
            list-style: none;
        }
        .toc-item {
            margin-bottom: 4px;
        }
        .toc-link {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 8px;
            text-decoration: none;
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 400;
            line-height: 1.4;
            transition: all var(--transition);
            cursor: pointer;
        }
        .toc-link:hover {
            background: rgba(242, 75, 46, 0.05);
            color: var(--text);
        }
        .toc-link.active {
            background: rgba(242, 75, 46, 0.08);
            color: var(--coral);
            font-weight: 500;
        }
        .toc-num {
            font-family: var(--font-mono);
            font-size: 12px;
            font-weight: 500;
            color: var(--coral);
            min-width: 20px;
            padding-top: 1px;
        }

        /* ===== Main Content ===== */
        .main-content {
            margin-left: 280px;
            padding-top: calc(var(--nav-height) + 3px);
            min-height: 100vh;
        }

        /* ===== Section ===== */
        .course-section {
            display: none;
            animation: fadeIn 0.3s ease;
        }
        .course-section.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ===== Hero Image ===== */
        .section-hero {
            width: 100%;
            aspect-ratio: 16 / 9;
            object-fit: cover;
            background: var(--border);
        }

        /* ===== Section Content ===== */
        .section-body {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 48px 32px 64px;
        }
        .section-meta {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
            font-size: 13px;
            color: var(--text-secondary);
        }
        .section-type {
            background: rgba(242, 75, 46, 0.08);
            color: var(--coral);
            padding: 3px 10px;
            border-radius: 4px;
            font-weight: 500;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .section-reading-time {
            font-weight: 400;
        }
        .section-title {
            font-family: var(--font-display);
            font-size: 36px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 32px;
            color: var(--text);
        }

        /* ===== Typography ===== */
        .section-content h2 {
            font-family: var(--font-display);
            font-size: 24px;
            font-weight: 600;
            margin: 40px 0 16px;
            color: var(--text);
        }
        .section-content h3 {
            font-family: var(--font-body);
            font-size: 18px;
            font-weight: 600;
            margin: 32px 0 12px;
            color: var(--text);
        }
        .section-content p {
            margin-bottom: 16px;
        }
        .section-content ul, .section-content ol {
            margin-bottom: 16px;
            padding-left: 24px;
        }
        .section-content li {
            margin-bottom: 8px;
        }
        .section-content strong {
            font-weight: 600;
            color: var(--text);
        }
        .section-content a {
            color: var(--coral);
            text-decoration: underline;
            text-decoration-color: rgba(242, 75, 46, 0.3);
            text-underline-offset: 2px;
            transition: text-decoration-color var(--transition);
        }
        .section-content a:hover {
            text-decoration-color: var(--coral);
        }

        /* ===== Code Blocks ===== */
        .code-block-wrapper {
            position: relative;
            margin: 24px 0;
            border-radius: 10px;
            overflow: hidden;
            background: var(--code-bg);
        }
        .code-block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.2);
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--muted);
        }
        .copy-btn {
            background: none;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: var(--muted);
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-family: var(--font-body);
            cursor: pointer;
            transition: all var(--transition);
        }
        .copy-btn:hover {
            border-color: var(--coral);
            color: var(--coral);
        }
        .copy-btn.copied {
            border-color: #4caf50;
            color: #4caf50;
        }
        pre {
            margin: 0;
            padding: 20px;
            overflow-x: auto;
            font-family: var(--font-mono);
            font-size: 14px;
            line-height: 1.6;
            color: var(--code-text);
        }
        code {
            font-family: var(--font-mono);
            font-size: 0.9em;
        }
        p code, li code {
            background: rgba(242, 75, 46, 0.08);
            color: var(--coral);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85em;
        }

        /* ===== Prompt Blocks ===== */
        .prompt-block {
            position: relative;
            margin: 24px 0;
            padding: 20px 24px;
            background: rgba(193, 120, 23, 0.06);
            border-left: 4px solid var(--gold);
            border-radius: 0 8px 8px 0;
        }
        .prompt-block-label {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--gold);
            margin-bottom: 8px;
        }
        .prompt-block-content {
            font-size: 15px;
            line-height: 1.6;
        }
        .prompt-block .copy-btn {
            position: absolute;
            top: 12px;
            right: 12px;
        }

        /* ===== Callout Blocks ===== */
        .callout {
            margin: 24px 0;
            padding: 16px 20px;
            border-radius: 8px;
            font-size: 15px;
        }
        .callout-tip {
            background: rgba(193, 120, 23, 0.06);
            border: 1px solid rgba(193, 120, 23, 0.15);
        }
        .callout-tip::before {
            content: "Tip";
            display: block;
            font-weight: 600;
            font-size: 13px;
            color: var(--gold);
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .callout-warning {
            background: rgba(242, 75, 46, 0.05);
            border: 1px solid rgba(242, 75, 46, 0.15);
        }
        .callout-warning::before {
            content: "Warning";
            display: block;
            font-weight: 600;
            font-size: 13px;
            color: var(--coral);
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        /* ===== Tables ===== */
        .table-wrapper {
            margin: 24px 0;
            overflow-x: auto;
            border-radius: 10px;
            border: 1px solid var(--border);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 15px;
        }
        thead {
            background: rgba(61, 43, 31, 0.04);
        }
        [data-theme="dark"] thead {
            background: rgba(240, 230, 220, 0.04);
        }
        th {
            text-align: left;
            padding: 12px 16px;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--border);
        }
        td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
            line-height: 1.5;
        }
        tr:last-child td {
            border-bottom: none;
        }
        tbody tr:hover {
            background: rgba(242, 75, 46, 0.03);
        }

        /* ===== Checklist ===== */
        .checklist {
            list-style: none;
            padding-left: 0;
        }
        .checklist li {
            position: relative;
            padding-left: 32px;
            margin-bottom: 12px;
        }
        .checklist li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 4px;
            width: 18px;
            height: 18px;
            border: 2px solid var(--coral);
            border-radius: 4px;
        }
        .checklist li.checked::before {
            background: var(--coral);
        }
        .checklist li.checked::after {
            content: "";
            position: absolute;
            left: 4px;
            top: 7px;
            width: 10px;
            height: 6px;
            border-left: 2px solid var(--white);
            border-bottom: 2px solid var(--white);
            transform: rotate(-45deg);
        }

        /* ===== Bottom Nav ===== */
        .bottom-nav {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 0 32px 48px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: var(--card-bg);
            color: var(--text);
            font-family: var(--font-body);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition);
            text-decoration: none;
        }
        .nav-btn:hover {
            border-color: var(--coral);
            color: var(--coral);
        }
        .nav-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        .nav-btn:disabled:hover {
            border-color: var(--border);
            color: var(--text);
        }
        .nav-btn-next {
            background: var(--coral);
            color: var(--white);
            border-color: var(--coral);
        }
        .nav-btn-next:hover {
            background: #d93d22;
            color: var(--white);
        }
        .nav-indicator {
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 400;
        }

        /* ===== Share Buttons ===== */
        .share-bar {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 0 32px 48px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .share-label {
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
        }
        .share-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: none;
            color: var(--text-secondary);
            font-family: var(--font-body);
            font-size: 13px;
            cursor: pointer;
            text-decoration: none;
            transition: all var(--transition);
        }
        .share-btn:hover {
            border-color: var(--coral);
            color: var(--coral);
        }

        /* ===== Footer ===== */
        .course-footer {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 32px;
            border-top: 1px solid var(--border);
            text-align: center;
        }
        .footer-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        .footer-logo {
            height: 24px;
            opacity: 0.7;
        }
        [data-theme="dark"] .footer-logo {
            filter: brightness(10);
        }
        .footer-text {
            font-size: 13px;
            color: var(--text-secondary);
        }
        .footer-cta {
            display: inline-block;
            margin-top: 16px;
            padding: 10px 24px;
            background: var(--coral);
            color: var(--white);
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            text-decoration: none;
            transition: background var(--transition);
        }
        .footer-cta:hover {
            background: #d93d22;
        }

        /* ===== Email Gate Modal ===== */
        .email-gate-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(26, 23, 20, 0.7);
            backdrop-filter: blur(4px);
            z-index: 2000;
            align-items: center;
            justify-content: center;
        }
        .email-gate-overlay.visible {
            display: flex;
        }
        .email-gate-modal {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 48px 40px;
            max-width: 440px;
            width: 90%;
            text-align: center;
            box-shadow: 0 24px 48px var(--shadow);
        }
        /* Collapse empty Flodesk headings/descriptions inside the modal */
        .email-gate-modal .fd-form h1,
        .email-gate-modal .fd-form h2,
        .email-gate-modal .fd-form h3,
        .email-gate-modal .fd-form p:empty,
        .email-gate-modal .fd-form [class*="heading"],
        .email-gate-modal .fd-form [class*="description"] {
            display: none !important;
        }
        .email-gate-modal h2 {
            font-family: var(--font-display);
            font-size: 24px;
            margin-bottom: 8px;
            color: var(--text);
        }
        .email-gate-modal p {
            font-size: 15px;
            color: var(--text-secondary);
            margin-bottom: 24px;
        }
        .email-gate-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-family: var(--font-body);
            font-size: 15px;
            background: var(--bg);
            color: var(--text);
            margin-bottom: 12px;
            outline: none;
            transition: border-color var(--transition);
        }
        .email-gate-input:focus {
            border-color: var(--coral);
        }
        .email-gate-submit {
            width: 100%;
            padding: 12px;
            background: var(--coral);
            color: var(--white);
            border: none;
            border-radius: 8px;
            font-family: var(--font-body);
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background var(--transition);
        }
        .email-gate-submit:hover {
            background: #d93d22;
        }
        .email-gate-skip {
            display: block;
            margin-top: 12px;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 13px;
            cursor: pointer;
            font-family: var(--font-body);
        }
        .email-gate-skip:hover {
            color: var(--text);
        }

        /* ===== Responsive ===== */
        @media (max-width: 960px) {
            .sidebar {
                transform: translateX(-100%);
                width: 280px;
                box-shadow: 4px 0 24px var(--shadow);
            }
            .sidebar.open {
                transform: translateX(0);
            }
            .main-content {
                margin-left: 0;
            }
            .toc-toggle {
                display: flex;
            }
            .nav-center {
                display: none;
            }
        }
        @media (max-width: 600px) {
            body { font-size: 16px; }
            .section-body { padding: 32px 20px 48px; }
            .section-title { font-size: 28px; }
            .section-content h2 { font-size: 20px; }
            .bottom-nav { padding: 0 20px 32px; }
            .share-bar { padding: 0 20px 32px; }
            .course-footer { padding: 24px 20px; }
            .nav-btn { padding: 10px 16px; font-size: 13px; }
            .email-gate-modal { padding: 32px 24px; }
        }
    </style>
</head>
<body>
    <nav class="top-nav">
        <img src="https://res.cloudinary.com/drdkvqdzd/image/upload/v1772094064/silver_logo_transparent_vrvadv.png" alt="Silver AI Consulting" class="nav-logo">
        <span class="nav-center">Bonus: Implementation Checklist</span>
        <div class="nav-actions">
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">&#9789;</button>
        </div>
    </nav>
    <main class="main-content" style="margin-left:0;">
        <article class="course-section active">
            <img src="https://d2p7pge43lyniu.cloudfront.net/output/6c4a6af1-f9a7-4ffb-9d5a-f5dfc07a94fe.jpeg" alt="The Daily Workflow: Putting It All Together" style="width:100%;aspect-ratio:16/9;object-fit:cover;">
            <div class="section-body">
                <div class="section-meta">
                    <span class="section-type">checklist</span>
                    <span class="section-reading-time">4 min</span>
                </div>
                <h1 class="section-title">The Daily Workflow: Putting It All Together</h1>
                <div class="section-content">
                    <p>Here's the exact setup I use every day. Each step takes 5 minutes or less. Do them in order — each one builds on the last.</p>
<h2>Step 1: Set Up Your CLAUDE.md (5 minutes)</h2>
<p>Create <code>CLAUDE.md</code> at your project root with this starter template:</p>
<div class="code-block-wrapper"><div class="code-block-header"><span>markdown</span><button class="copy-btn">Copy</button></div><pre><code># [Your Project Name]

One sentence: what this project does.

## Tech Stack
- [Language/framework]
- [Database]
- [Key integrations]

## Key Paths
| Path | Purpose |
|------|------|
| src/ | Source code |
| tests/ | Test files |
| .env | Secrets (never commit) |

## Constants
[Hardcode any IDs, URLs, or config values Claude looks up repeatedly]

## Capabilities
*Append one line after each session: what worked.*

## What Not To Do
*Append one line after each session: what failed.*</code></pre></div>
<div class="prompt-block"><div class="prompt-block-label">Prompt</div><button class="copy-btn">Copy</button><div class="prompt-block-content">Copy this template, fill in your project details, and save as <code>CLAUDE.md</code> in your project root. Takes 3 minutes.</div></div>
<h2>Step 2: Create Your First Rules File (3 minutes)</h2>
<p>Create <code>.claude/rules/</code> directory and add one file for your strongest preference:</p>
<div class="code-block-wrapper"><div class="code-block-header"><span>bash</span><button class="copy-btn">Copy</button></div><pre><code>mkdir -p .claude/rules</code></pre></div>
<div class="code-block-wrapper"><div class="code-block-header"><span>markdown</span><button class="copy-btn">Copy</button></div><pre><code># .claude/rules/code-style.md

- Use descriptive variable names
- Keep functions under 20 lines
- Handle errors at boundaries, trust internal code
- No placeholder or TODO code in commits</code></pre></div>
<p>This auto-loads every session without you explaining it.</p>
<h2>Step 3: Build Your First Forked Skill (5 minutes)</h2>
<p>Create a simple skill that runs in isolated context:</p>
<div class="code-block-wrapper"><div class="code-block-header"><span>bash</span><button class="copy-btn">Copy</button></div><pre><code>mkdir -p .claude/skills/quick-research</code></pre></div>
<div class="code-block-wrapper"><div class="code-block-header"><span>markdown</span><button class="copy-btn">Copy</button></div><pre><code># .claude/skills/quick-research/SKILL.md
---
name: quick-research
description: Research a topic across the codebase
model: sonnet
context: fork
---

Search the codebase for all files related to: $ARGUMENTS

For each relevant file:
1. Read the key sections
2. Note any patterns or conventions
3. Flag potential issues

Return a concise summary (under 200 words).</code></pre></div>
<p>Now when you type <code>/quick-research authentication</code>, it spins up a Sonnet agent with a clean 2K-token context instead of dumping search results into your 100K main thread.</p>
<h2>Step 4: Set Up Model Tiering (2 minutes)</h2>
<p>Add model overrides to your existing skills and agents:</p>
<div class="code-block-wrapper"><div class="code-block-header"><span>yaml</span><button class="copy-btn">Copy</button></div><pre><code># Research/exploration skills → sonnet
model: sonnet

# Classification/filtering agents → haiku
model: haiku

# Main conversation + synthesis → opus (default)
# No change needed</code></pre></div>
<h2>Step 5: Start Your Session Routine (daily, 30 seconds)</h2>
<p>At the start of each session:</p>
<ol><li>Check the status bar for context usage</li><li>If continuing previous work, start a fresh session with a clear prompt referencing CLAUDE.md</li><li>Let Claude read CLAUDE.md — your persistent memory handles the rest</li></ol>
<p>At the end of each session:</p>
<div class="prompt-block"><div class="prompt-block-label">Prompt</div><button class="copy-btn">Copy</button><div class="prompt-block-content">"Update CLAUDE.md: append what worked to Capabilities, what failed to What Not To Do. One line each."</div></div>
<h2>The Compound Effect</h2>
<p>Here's what happens after a week of this routine:</p>
<ul><li>Your CLAUDE.md has 5-10 capability entries and 3-5 anti-patterns</li><li>Claude stops making the same mistakes twice</li><li>Your forked skills handle research without bloating your main context</li><li>Model tiering cuts your token usage on routine tasks by 50-70%</li><li>You stop hitting limits before your work is done</li></ul>
<p>After a month, your CLAUDE.md is a dense knowledge base of your project's patterns, gotchas, and conventions. New sessions start with Claude already knowing everything that matters. No re-explanation. No wasted tokens.</p>
<p>This is the difference between fighting your tools and having your tools fight for you.</p>
<h2>Quick Reference Card</h2>
<div class="table-wrapper"><table><thead><tr><th>Technique</th><th>Token Saving</th><th>Effort</th></tr></thead><tbody><tr><td>CLAUDE.md with hardcoded values</td><td>~500-2000/session</td><td>5 min setup</td></tr><tr><td>Rules files</td><td>~200-500/session</td><td>3 min per file</td></tr><tr><td>context: fork on subagents</td><td>50-90% per agent</td><td>2 min per skill</td></tr><tr><td>Model tiering</td><td>30-70% per task</td><td>2 min config</td></tr><tr><td>Scripts for deterministic work</td><td>80%+ per API call</td><td>10-30 min per script</td></tr><tr><td>"What Not To Do" log</td><td>Prevents 1-2 retries/day</td><td>30 sec/entry</td></tr></tbody></table></div>
                </div>
            </div>
            <div class="bottom-nav">
                <a href="/#section-5" class="nav-btn nav-btn-prev" style="text-decoration:none;">&#8592; Back to course</a>
                <span></span>
                <a href="https://tidycal.com/nicsilver/intro-call" class="nav-btn nav-btn-next" target="_blank" style="text-decoration:none;">Book an Introductory Call</a>
            </div>
            <footer class="course-footer">
                <div class="footer-brand">
                    <img src="https://res.cloudinary.com/drdkvqdzd/image/upload/v1772094064/silver_logo_transparent_vrvadv.png" alt="Silver AI Consulting" class="footer-logo">
                    <span class="footer-text">Silver AI Consulting</span>
                </div>
                <a href="https://tidycal.com/nicsilver/intro-call" class="footer-cta" target="_blank">Book an Introductory Call</a>
            </footer>
        </article>
    </main>
    <script>
        // Mark as unlocked so the main course remembers
        localStorage.setItem('checklist-unlocked-saving-tokens-claude-code', 'true');

        var t = document.getElementById('themeToggle');
        t.addEventListener('click', function() {
            var d = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', d ? 'light' : 'dark');
            t.textContent = d ? '\\u263D' : '\\u2600';
        });
    </script>
</body>
</html>`,
  };
};
