exports.handler = async (event) => {
  const token = event.queryStringParameters && event.queryStringParameters.token;
  const secret = process.env.GATE_SECRET;

  if (!token || !secret || token !== secret) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "unauthorized" }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Access-Control-Allow-Origin": "*" },
    body: `
    <article class="course-section" id="section-6">
        <img src="https://d2p7pge43lyniu.cloudfront.net/output/6c4a6af1-f9a7-4ffb-9d5a-f5dfc07a94fe.jpeg" alt="The Daily Workflow: Putting It All Together" class="section-hero">
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
            <button class="nav-btn nav-btn-prev" >&#8592; Previous</button>
            <span class="nav-indicator">Section 6 of 6</span>
            <button class="nav-btn nav-btn-next">Next &#8594;</button>
        </div>
        <div class="share-bar">
            <span class="share-label">Share this section:</span>
            <a class="share-btn" data-platform="linkedin">LinkedIn</a>
            <a class="share-btn" data-platform="x">X / Twitter</a>
            <a class="share-btn" data-platform="copy">Copy link</a>
        </div>
        <footer class="course-footer">
            <div class="footer-brand">
                <img src="https://res.cloudinary.com/drdkvqdzd/image/upload/v1772094064/silver_logo_transparent_vrvadv.png" alt="Silver AI Consulting" class="footer-logo">
                <span class="footer-text">Silver AI Consulting</span>
            </div>
            <a href="https://tidycal.com/nicsilver/intro-call" class="footer-cta" target="_blank">Book an Introductory Call</a>
        </footer>
    </article>`,
  };
};
