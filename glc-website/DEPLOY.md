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

### The easy way — drag and drop

1. Sign in at **app.netlify.com**.
2. Go to **Sites**, and find the box that says *"Want to deploy a new site
   without connecting to Git? Drag and drop your site output folder here."*
3. Drag the **`glc-website/site`** folder into that box.
4. It goes live in under a minute on an address like
   `random-name-12345.netlify.app`.

### The better way — connect the repository

Do this if you want the site to update itself whenever the files change.

1. In Netlify choose **Add new site → Import an existing project → GitHub**.
2. Pick this repository and the branch you want to publish.
3. Netlify will read `netlify.toml` and fill the settings in for you:
   - **Base directory:** leave empty
   - **Build command:** leave empty
   - **Publish directory:** `glc-website/site`
4. Click **Deploy**.

There is no build step on purpose. Netlify just serves the finished files, so a
deploy cannot fail because of a tool or a version.

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
