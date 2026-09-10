# Putting this website live on Netlify

Written for someone who is not a developer. Fifteen minutes, and nothing to install.

## 1. Before you publish — five things to fix

The site is built and it works, but five items on it are deliberately unfinished
because only you can settle them. Each one is marked on the page itself.

1. **The office address.** Three different addresses appear in the company
   records: Faber Tower and Fabe Plaza on Jalan Desa Jaya in Taman Desa, and
   Jalan Maharajalela (which is the company secretary's). Decide which one is the
   working office. It must match your Google Business Profile letter for letter.
2. **Corporate client names.** Eleven companies and institutions are named on the
   project pages. **None of them has been asked.** Send each one the email in
   `content/templates/client-permission-request.md` and remove any who decline.
3. **The chairman's honorific.** The company deck styles him "YAB Dato'". YAB is
   normally used for a Prime Minister, Deputy Prime Minister, Menteri Besar or
   Chief Minister. The site currently says "Dato'". Confirm which is correct.
4. **A proper email address.** The site shows the Gmail address from the deck. On
   a website that procurement officers will read, a `@yourdomain` address is
   worth the small annual cost.
5. **The two current projects.** Skudai was due to finish in April 2026 and
   Petaling Jaya in August 2026. If either is done, tell me and they move to
   completed.

Everything else on the site traces to your company deck or to your certificates.
No contract value is published. No private client is named. Nothing is claimed
about ISO, QLASSIC, SHASSIC or safety records, because the company holds none.

## 2. Publish it

**The Netlify site already exists.** It was created on your account
(`jjgoh1999@gmail.com`, team *PULP*) and is waiting for its first deploy:

- Project: **global-land-consortium**
- Dashboard: <https://app.netlify.com/projects/global-land-consortium>
- Address once deployed: <https://global-land-consortium.netlify.app>

It has no files yet. Pick either route below; the first is better.

### Connect the repository — about a minute, and it keeps itself updated

1. Open <https://app.netlify.com/projects/global-land-consortium>.
2. Go to **Project configuration → Build & deploy → Continuous deployment**,
   and choose **Link repository** (or **Import from Git**).
3. Choose **GitHub** and pick `jjgohh/jj_personal_portfolio`.
4. Set the **production branch** to `claude/install-frontend-design-skill-ingxlj`,
   which is where the site lives. (Or merge that branch into `main` first and
   point Netlify at `main` — either works.)
5. Netlify reads `netlify.toml` and fills the rest in:
   - **Base directory:** leave empty
   - **Build command:** leave empty
   - **Publish directory:** `glc-website/site`
6. Click **Deploy**.

From then on, every push to that branch republishes the site by itself.

### Or drag and drop — no Git, no updates

1. Download or copy the **`glc-website/site`** folder.
2. Open the project dashboard, go to **Deploys**, and drag the folder onto the
   drop area.

There is no build step on purpose. Netlify just serves the finished files, so a
deploy cannot fail because of a tool or a version.

### Why I could not press deploy for you

I created the project through the Netlify connector, but the file upload runs
from this session's network, and this environment's egress policy denies
`api.netlify.com` and Netlify's upload host outright. The same policy blocked
CIDB, MyIPO and the reference websites earlier in the project. Connecting the
repository sidesteps it completely, because Netlify then pulls the files from
GitHub itself rather than receiving them from me.

## 2a. The site is deliberately hidden from Google right now

Every page carries `<meta name="robots" content="noindex,nofollow">` and
`robots.txt` disallows everything. **This is on purpose.** The project pages
name eleven corporate and institutional clients, and none of them has been
asked yet (section 1, item 2). A `netlify.app` address is public, so anyone with
the link can read it, but it will not turn up in search results.

When the pre-launch list in section 1 is done, one flag opens it up:

```
cd glc-website
GLC_DOMAIN=https://your-real-domain.com GLC_PUBLISH=1 python3 build.py
```

Commit the result and Netlify republishes. Check `site/robots.txt` afterwards:
it should say `Allow: /`. Until you run that, leave it as it is.

## 3. Point your domain at it

1. Buy the domain if you have not already. `.com.my` is registered through a
   MYNIC-accredited reseller and needs your SSM registration number, which is
   **1089230-X**.
2. In Netlify: **Domain management → Add a domain**, type it in, and follow the
   DNS instructions it gives you.
3. Netlify issues the HTTPS certificate automatically. Wait for the padlock
   before you send anyone the address.
4. **Then** open `netlify.toml` and change nothing — but do tell me the domain,
   because the sitemap and the social-sharing tags have the domain baked in and
   need one rebuild to pick it up.

## 4. The enquiry form

The form on the contact page is already wired to **Netlify Forms** and needs no
setup. It has a hidden trap field that catches most spam bots.

To get the enquiries:

1. In Netlify go to **Forms**. You will see a form called **enquiry** after the
   first real submission.
2. Open **Forms → Settings → Form notifications → Add notification → Email
   notification**, and put in the email address that should receive enquiries.
3. Send yourself a test enquiry and check it arrives.

Netlify's free tier includes 100 submissions a month, which is well above what
this site will get.

## 5. Google Business Profile

This matters more for enquiries than anything on the website. Create or claim the
profile at **business.google.com**, and make the name, address and phone number
match the website footer exactly. Then add the website address to the profile and
put a few of the project photographs on it.

## 6. Changing the site later

All the content lives in one file: `glc-website/content/projects.extracted.json`.

To add a project, copy an existing block in that file, change the details, drop
its photographs into `glc-website/src/photos/`, then run this inside the
`glc-website` folder:

```
python3 build.py
```

It rewrites `site/` and refuses to finish if anything would publish a private
client's name, an IC number, a residential address or a contract value. Commit
the result and Netlify picks it up.

If that command is not something you want to run yourself, send me the details
and the photographs and I will do it.

## 7. What is deliberately not here

No investor relations, no ESG page, no board charter, no awards page, no careers
portal, and no news section. A news page nobody posts to is worse than no news
page. If you decide you will post, say so and I will add it.
