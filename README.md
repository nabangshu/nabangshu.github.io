# Personal website

A Jekyll site. GitHub Pages builds it automatically on every push.

## Weekly post

1. Create `_posts/YYYY-MM-DD-short-title.md`:

   ```markdown
   ---
   title: "Assam demand outlook, week of 1 Dec"
   summary: "One-line teaser shown on the Writing page."
   category: energy    # energy | weather | single-cell | space
   region: Assam
   tags: [demand, assam]
   math: true          # only if the post uses $...$ equations
   ---

   Text in Markdown. Charts: save PNGs to assets/img/posts/ and use
   ![caption](/assets/img/posts/chart.png)
   ```

2. Publish:

   ```bash
   git add . && git commit -m "Post: Assam demand outlook" && git push
   ```

   The site updates in about a minute.

## Preview locally

```bash
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"
jekyll serve        # then open http://localhost:4000
```

## Still to do

- Fill in `_config.yml` → `url` and `social` (email, GitHub, Scholar, ORCID).
- Replace `assets/img/profile.svg` with a photo (`profile.jpg`) and update `index.html`.
- Add your current Hokkaido research topic to `index.html` and `cv.html`.
- Optional: put a CV PDF (without phone number) at `assets/files/cv.pdf`.
