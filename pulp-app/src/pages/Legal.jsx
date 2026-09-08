import React from 'react';
import { Rise } from '../lib.jsx';
import { href, navigate } from '../router.jsx';

/*
  LEGAL PAGES — Privacy Notice and Reservation Terms.

  ── WHY THESE ARE NOT BOILERPLATE ──────────────────────────────────────────
  On a provenance-led supplement brand that cannot yet sell, the compliance
  layer IS the trust surface: it is the one place a sceptical buyer can check
  whether the transparency claimed elsewhere on the site is real. So these pages
  state what actually happens to your data and what a reservation actually is,
  in the same plain register as the rest of the site. No "we value your privacy",
  no borrowed US template, no rights that do not exist under Malaysian law.

  ── MALAYSIAN LAW, SPECIFICALLY ────────────────────────────────────────────
  The Personal Data Protection Act 2010, as amended by the Personal Data
  Protection (Amendment) Act 2024 (in force in stages through 1 June 2025).
  Points that a generic template gets wrong and that are handled here:

  1. NOTICE AND CHOICE PRINCIPLE requires the notice to be given in BOTH English
     and Bahasa Malaysia. That is why this page is bilingual rather than
     English-only, and why the toggle is real content and not a nicety.
  2. CROSS-BORDER TRANSFER is disclosed. Both the host and the email provider sit
     outside Malaysia, so the data leaves the country the moment it is collected.
     Most templates never mention it.
  3. DATA PORTABILITY and the 72-HOUR BREACH NOTIFICATION duty are 2024-amendment
     additions and are stated as such.
  4. The DPO requirement applies from 1 June 2025, so there is a named contact
     slot rather than silence.

  ── BLOCKING PLACEHOLDERS ──────────────────────────────────────────────────
  [SSM NUMBER], [REGISTERED ADDRESS], [DPO NAME], [DPO EMAIL], [EMAIL PROVIDER],
  [LEGAL REVIEW DATE]. Left visible on purpose, as everywhere else on this site.

  ── ONE HONEST WARNING FOR WHOEVER SHIPS THIS ──────────────────────────────
  This is a careful, specific draft written against the actual behaviour of the
  site. It is NOT legal advice and has not been reviewed by a Malaysian lawyer.
  The Bahasa Malaysia text especially needs review, because under the Notice and
  Choice Principle the BM version is operative for a BM-speaking data subject.
  Ship it only after review, and fill [LEGAL REVIEW DATE] when that happens.

  DELIBERATELY NO EYEBROW ROW on these two pages. The site already carries 23
  eyebrow micro-labels across 9 route components, which is well past the "one per
  three sections" threshold and is what makes AI-built pages feel templated. The
  headline alone is enough here.
*/

const ENTITY = 'Golden Pulp Sdn Bhd';
const CONTACT = 'hello@pulp.my';

/* ---------------------------------------------------------------- PRIVACY -- */

function PrivacyEN() {
  return (
    <>
      <h2>1. Who is collecting your data</h2>
      <p>
        {ENTITY} (Company no. [SSM NUMBER]), of [REGISTERED ADDRESS], Malaysia. We are the
        data controller. Write to us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>2. What we collect</h2>
      <p>
        Your email address. That is the whole list. We do not ask for your name, phone
        number, postal address, date of birth, payment details or any health information,
        and there is nowhere on this site to give them to us.
      </p>
      <p>
        This site sets <strong>no cookies</strong>, runs <strong>no analytics</strong>, and
        loads <strong>no advertising or tracking pixels</strong> of any kind. Nothing on the
        page profiles you or follows you elsewhere. That is why you were not asked to
        accept cookies: there are none to accept, and a consent banner for cookies that do
        not exist would be theatre.
      </p>

      <h2>3. Why we collect it</h2>
      <p>
        To send you <strong>one email</strong>, once, when PULP No.&nbsp;001 has completed
        product notification with the National Pharmaceutical Regulatory Agency (NPRA) and
        can legally be sold. We do not run a newsletter and we will not email you about
        anything else.
      </p>

      <h2>4. Your consent, and taking it back</h2>
      <p>
        Submitting the reservation form is your consent under the Notice and Choice
        Principle of the Personal Data Protection Act 2010. You can withdraw it at any
        time, for any reason, by replying to any email from us or writing to{' '}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Withdrawal is free and we will not ask
        you why. If you withdraw before launch, you lose your place in the batch, which is
        the only consequence.
      </p>

      <h2>5. Who else sees it</h2>
      <p>
        An email delivery provider ([EMAIL PROVIDER]) processes the list on our
        instructions, and our website host serves this page. Nobody else. We do not sell,
        rent, trade or share your address with advertisers, data brokers, affiliates or
        other brands, and we will not start.
      </p>

      <h2>6. Your data leaves Malaysia</h2>
      <p>
        Both our host and our email provider operate servers outside Malaysia, so your
        address is transferred out of the country as soon as it is submitted. We rely on
        contractual safeguards with those providers, consistent with the cross-border
        transfer requirements introduced by the Personal Data Protection (Amendment) Act
        2024. We are telling you this plainly because most privacy notices do not.
      </p>

      <h2>7. How long we keep it</h2>
      <p>
        Until the launch email has been sent, or until you withdraw, whichever comes
        first. After that we delete it. If PULP never launches, we delete the list and
        tell you we have done so.
      </p>

      <h2>8. How it is protected</h2>
      <p>
        This site is served over HTTPS only. Access to the list is limited to the people
        who need it to send that one email. We hold no database of our own on this site.
      </p>

      <h2>9. Your rights</h2>
      <ul>
        <li><strong>Access</strong> — ask what we hold about you.</li>
        <li><strong>Correction</strong> — ask us to fix it.</li>
        <li><strong>Withdrawal</strong> — ask us to stop processing it, at any time.</li>
        <li><strong>Deletion</strong> — ask us to remove you entirely.</li>
        <li>
          <strong>Portability</strong> — ask for a copy in a usable format, a right added
          by the 2024 amendments.
        </li>
        <li>
          <strong>Complaint</strong> — you can complain to the Personal Data Protection
          Commissioner (Jabatan Perlindungan Data Peribadi) without going through us
          first.
        </li>
      </ul>
      <p>Any of these: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>

      <h2>10. If something goes wrong</h2>
      <p>
        If your data is involved in a breach we will notify the Commissioner within 72
        hours of becoming aware of it, as the 2024 amendments require, and we will tell
        you directly if the breach is likely to cause you significant harm.
      </p>

      <h2>11. Data protection officer</h2>
      <p>
        [DPO NAME], reachable at [DPO EMAIL]. Appointing and notifying a data protection
        officer has been mandatory for controllers since 1 June 2025.
      </p>

      <h2>12. Changes</h2>
      <p>
        If this notice changes in a way that affects you, we will email the list rather
        than quietly editing the page and hoping you re-read it.
      </p>
    </>
  );
}

function PrivacyBM() {
  return (
    <>
      <h2>1. Siapa yang mengumpul data anda</h2>
      <p>
        {ENTITY} (No. syarikat [SSM NUMBER]), di [REGISTERED ADDRESS], Malaysia. Kami ialah
        pengawal data. Hubungi kami di <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>2. Apa yang kami kumpul</h2>
      <p>
        Alamat e-mel anda. Itu sahaja. Kami tidak meminta nama, nombor telefon, alamat pos,
        tarikh lahir, maklumat pembayaran atau apa-apa maklumat kesihatan, dan tiada ruang
        di laman ini untuk memberikannya kepada kami.
      </p>
      <p>
        Laman ini <strong>tidak menggunakan kuki</strong>, <strong>tiada analitik</strong>,
        dan <strong>tiada piksel pengiklanan atau penjejakan</strong>. Tiada apa-apa di
        laman ini yang memprofilkan anda atau menjejaki anda di tempat lain. Sebab itu anda
        tidak diminta menerima kuki: tiada kuki untuk diterima.
      </p>

      <h2>3. Mengapa kami mengumpulnya</h2>
      <p>
        Untuk menghantar <strong>satu e-mel</strong> sahaja, apabila PULP No.&nbsp;001 telah
        melengkapkan pemberitahuan produk dengan Pihak Berkuasa Kawalan Dadah melalui NPRA
        dan boleh dijual secara sah. Kami tidak menerbitkan surat berita dan tidak akan
        menghantar e-mel mengenai perkara lain.
      </p>

      <h2>4. Kebenaran anda, dan cara menariknya semula</h2>
      <p>
        Menghantar borang tempahan adalah kebenaran anda di bawah Prinsip Notis dan Pilihan,
        Akta Perlindungan Data Peribadi 2010. Anda boleh menariknya semula pada bila-bila
        masa dengan membalas e-mel kami atau menulis kepada{' '}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Penarikan adalah percuma dan kami tidak
        akan bertanya sebabnya.
      </p>

      <h2>5. Siapa lagi yang melihatnya</h2>
      <p>
        Penyedia penghantaran e-mel ([EMAIL PROVIDER]) memproses senarai ini atas arahan
        kami, dan pengehos laman web kami menyampaikan halaman ini. Tiada orang lain. Kami
        tidak menjual, menyewa atau berkongsi alamat anda dengan pengiklan, broker data atau
        jenama lain.
      </p>

      <h2>6. Data anda keluar dari Malaysia</h2>
      <p>
        Pengehos dan penyedia e-mel kami mengendalikan pelayan di luar Malaysia, jadi alamat
        anda dipindahkan ke luar negara sebaik sahaja dihantar. Kami bergantung pada
        perlindungan kontrak dengan penyedia tersebut, selaras dengan kehendak pemindahan
        rentas sempadan yang diperkenalkan oleh Akta Perlindungan Data Peribadi (Pindaan)
        2024.
      </p>

      <h2>7. Berapa lama kami menyimpannya</h2>
      <p>
        Sehingga e-mel pelancaran dihantar, atau sehingga anda menarik kebenaran, yang mana
        lebih awal. Selepas itu kami menghapuskannya. Jika PULP tidak dilancarkan, kami
        menghapuskan senarai ini dan memberitahu anda.
      </p>

      <h2>8. Bagaimana ia dilindungi</h2>
      <p>
        Laman ini disampaikan melalui HTTPS sahaja. Akses kepada senarai terhad kepada
        orang yang memerlukannya untuk menghantar e-mel tersebut.
      </p>

      <h2>9. Hak anda</h2>
      <ul>
        <li><strong>Akses</strong> — bertanya apa yang kami simpan tentang anda.</li>
        <li><strong>Pembetulan</strong> — meminta kami membetulkannya.</li>
        <li><strong>Penarikan</strong> — meminta kami berhenti memprosesnya.</li>
        <li><strong>Penghapusan</strong> — meminta kami membuang anda sepenuhnya.</li>
        <li>
          <strong>Kemudahalihan data</strong> — meminta satu salinan dalam format boleh
          guna, hak yang ditambah oleh pindaan 2024.
        </li>
        <li>
          <strong>Aduan</strong> — anda boleh mengadu kepada Pesuruhjaya Perlindungan Data
          Peribadi (Jabatan Perlindungan Data Peribadi) tanpa melalui kami dahulu.
        </li>
      </ul>
      <p>Untuk mana-mana daripadanya: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>

      <h2>10. Jika berlaku masalah</h2>
      <p>
        Jika data anda terlibat dalam pelanggaran data, kami akan memberitahu Pesuruhjaya
        dalam masa 72 jam selepas kami mengetahuinya, seperti yang dikehendaki oleh pindaan
        2024, dan kami akan memberitahu anda secara langsung jika pelanggaran itu
        berkemungkinan menyebabkan kemudaratan yang ketara kepada anda.
      </p>

      <h2>11. Pegawai perlindungan data</h2>
      <p>
        [DPO NAME], boleh dihubungi di [DPO EMAIL]. Pelantikan dan pemberitahuan pegawai
        perlindungan data adalah mandatori bagi pengawal data sejak 1 Jun 2025.
      </p>

      <h2>12. Perubahan</h2>
      <p>
        Jika notis ini berubah dengan cara yang menjejaskan anda, kami akan menghantar
        e-mel kepada senarai, bukan hanya menyunting halaman ini secara senyap.
      </p>
    </>
  );
}

export function Privacy() {
  return (
    <section className="chapter legal" id="privacy">
      <div className="wrap">
        <h1 className="h-lines" style={{ marginBottom: 10 }}>
          <span className="line"><span className="inner">Privacy <em>notice.</em></span></span>
        </h1>
        <p className="legal-meta">
          Personal Data Protection Act 2010 (as amended 2024) · Last reviewed
          [LEGAL REVIEW DATE] · [PENDING LEGAL REVIEW]
        </p>
        <Rise as="p" className="lede-2" style={{ marginBottom: 'clamp(22px,3.4vw,34px)' }}>
          We collect one thing: an email address. This page says what happens to it, in
          English and Bahasa Malaysia, as the Notice and Choice Principle requires.
        </Rise>

        {/* Same zero-JavaScript mechanism as the Composition comparison: real radio
            inputs plus :checked. The inputs MUST be siblings of .lgx-panels for
            `#lg-en:checked ~ .lgx-panels` to reach the panels — nesting them inside
            .lgx-opts is exactly the bug that once left the Composition toggle inert.
            label[for] still associates them, so the visual grouping is unaffected. */}
        <div className="lgx">
          <fieldset className="lgx-switch">
            <legend className="sr-only">Choose a language for this notice</legend>
            <input type="radio" name="lgx" id="lg-en" className="lgx-radio" defaultChecked />
            <input type="radio" name="lgx" id="lg-bm" className="lgx-radio" />
            <div className="lgx-opts">
              <label htmlFor="lg-en" className="lgx-label">English</label>
              <label htmlFor="lg-bm" className="lgx-label">Bahasa Malaysia</label>
            </div>
            <div className="lgx-panels">
              <div className="lgx-en legal-prose"><PrivacyEN /></div>
              <div className="lgx-bm legal-prose"><PrivacyBM /></div>
            </div>
          </fieldset>
        </div>

        <p className="legal-more">
          See also{' '}
          <a href={href('/terms')} onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>
            Reservation terms
          </a>.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ TERMS -- */

export function Terms() {
  return (
    <section className="chapter legal" id="terms">
      <div className="wrap">
        <h1 className="h-lines" style={{ marginBottom: 10 }}>
          <span className="line"><span className="inner">Reservation <em>terms.</em></span></span>
        </h1>
        <p className="legal-meta">
          Governed by the laws of Malaysia · Last reviewed [LEGAL REVIEW DATE] ·
          [PENDING LEGAL REVIEW]
        </p>
        <Rise as="p" className="lede-2" style={{ marginBottom: 'clamp(22px,3.4vw,34px)' }}>
          These are terms for reserving, not for buying. There is nothing to buy here yet,
          and these terms say so in the places where it matters.
        </Rise>

        <div className="legal-prose">
          <h2>1. What this site is</h2>
          <p>
            A private preview for a product that is not yet on sale. It is published by{' '}
            {ENTITY} (Company no. [SSM NUMBER]). It is not a shop. There is no cart, no
            checkout and no way to pay us.
          </p>

          <h2>2. What a reservation is</h2>
          <p>
            Your email address on a list, and a place in the first batch. It is{' '}
            <strong>not</strong> a contract of sale, an order, a deposit, a pre-order or a
            binding agreement to buy. No payment is taken and no card details are
            collected, at any point, by design.
          </p>

          <h2>3. What it commits you to</h2>
          <p>
            Nothing. You may leave the list at any time and owe us nothing. Reserving does
            not oblige you to order later.
          </p>

          <h2>4. What it commits us to</h2>
          <p>
            To email you once when No.&nbsp;001 can legally ship, and to hold the founders&rsquo;
            price for the first {' '}
            <a href={href('/')} onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              batch of 88 bottles
            </a>{' '}
            for people on the list who choose to order. It does not commit us to launch. If
            notification does not complete, or we decide not to proceed, we will tell the
            list plainly and delete it.
          </p>

          <h2>5. Prices shown here are not an offer</h2>
          <p>
            [FOUNDERS PRICE] and [RRP] are stated so you can judge the value before you
            spend attention on us. They are indicative, not an offer capable of acceptance,
            and they may change before launch. Nothing on this site can be accepted to form
            a contract, because we are not permitted to sell yet.
          </p>

          <h2>6. Regulatory status</h2>
          <p>
            PULP No.&nbsp;001 is undergoing product notification with the National
            Pharmaceutical Regulatory Agency. Until that is complete it may not be sold in
            Malaysia, and we will not sell it. The registration and advertising reference
            numbers on this site remain placeholders until they are issued; we will not
            display a number we do not have.
          </p>

          <h2>7. This is not medical advice</h2>
          <p>
            This product is not a medicine and is not intended to replace medicine. If
            symptoms persist, consult your doctor or pharmacist. Nothing on this site is
            advice about your health, and nothing on it should be used to diagnose or treat
            anything.
          </p>

          <h2>8. About the research we cite</h2>
          <p>
            The{' '}
            <a href={href('/research')} onClick={(e) => { e.preventDefault(); navigate('/research'); }}>
              research page
            </a>{' '}
            lists published work on tocotrienols as an ingredient class, attributed to its
            authors. Those citations are not claims about this product and must not be read
            as any. We did not fund them and we do not present them as evidence about PULP.
          </p>

          <h2>9. Accuracy</h2>
          <p>
            We describe the product as we currently intend to make it. Specifications,
            batch details and dates may change before launch, and where they do we will
            change them here. We do not warrant that a pre-launch page is free of error;
            if you find one, tell us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and we
            will correct it.
          </p>

          <h2>10. Content</h2>
          <p>
            The text, photography, illustrations and code on this site belong to {ENTITY},
            except the cited research, which belongs to its authors and publishers.
          </p>

          <h2>11. Your data</h2>
          <p>
            Covered separately and specifically in the{' '}
            <a href={href('/privacy')} onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>
              privacy notice
            </a>, in English and Bahasa Malaysia.
          </p>

          <h2>12. Law and changes</h2>
          <p>
            These terms are governed by the laws of Malaysia and subject to the
            jurisdiction of the Malaysian courts. If we change them materially before
            launch, we will email the list rather than editing quietly.
          </p>
        </div>
      </div>
    </section>
  );
}
