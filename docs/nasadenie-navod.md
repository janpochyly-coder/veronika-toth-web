# Nasadenie na Websupport — návod

Tento web beží na **Grave** (flat-file CMS, bez databázy). Rozdelenie zodpovednosti:

- **Git (tento repozitár) = KÓD.** Téma `grav-theme/veronika` (šablóna, štýly, blueprints).
- **Server (Websupport) = OBSAH.** Texty, obrázky, cenník a pod., ktoré klientka upravuje cez `/admin`, sú uložené na serveri v `user/pages` a `user/data`.

Deploy z GitHubu **nahráva iba tému** (kód). Obsah editovaný cez `/admin` sa preto **nikdy neprepíše**.

---

## 1. Jednorazová inštalácia Gravu na hosting (Fáza 2)

Robí sa raz, ručne:

1. Stiahnuť Grav + Admin balík (grav-admin) a nahrať jeho obsah do web rootu domény
   (napr. `/web/veronikatoth.sk/` alebo `/sub/…` podľa Websupport štruktúry).
2. Skopírovať tému a obsah z tohto repa:
   - `grav-theme/veronika/`  →  `<web-root>/user/themes/veronika/`
   - `grav-content/pages/`   →  `<web-root>/user/pages/`
   - `grav-config/system.yaml` → `<web-root>/user/config/system.yaml`
     (na produkcii **cache zapnúť** – nastaviť `cache: enabled: true`)
3. Otvoriť `https://doména/admin`, vytvoriť účet a nastaviť tému `veronika`.

---

## 2. Vytvorenie samostatného FTP/SFTP konta (bezpečné)

**Nedávaj hlavné prihlásenie k účtu.** Vo Websupport administrácii:

1. Hosting → **FTP prístupy** → *Pridať FTP konto*.
2. Domovský priečinok obmedz **len na web root domény** (aby konto nevidelo mail,
   iné domény ani ostatné časti hostingu).
3. Nastav **silné heslo** (uchovaj v správcovi hesiel).
4. Zapíš si: **hostname** (napr. `ftp.websupport.sk` alebo pridelený server),
   **port** (SFTP obvykle 22), **používateľské meno**.
5. Po odovzdaní projektu heslo **zmeň alebo konto zmaž** (rotácia).

> Pozn.: ak Websupport pre toto konto ponúka len klasické **FTP/FTPS** (nie SFTP),
> daj vedieť — v `deploy.yml` vymením akciu za FTP variant.

---

## 3. Vloženie údajov do GitHub Secrets

GitHub → repo **veronika-toth-web** → **Settings** → **Secrets and variables** →
**Actions** → *New repository secret*. Vytvor tieto secrety:

| Názov | Hodnota |
|---|---|
| `SFTP_HOST` | hostname FTP servera |
| `SFTP_USERNAME` | používateľské meno FTP konta |
| `SFTP_PASSWORD` | heslo FTP konta |
| `SFTP_PORT` | `22` (nepovinné, default 22) |
| `SFTP_THEME_PATH` | absolútna cesta k téme, napr. `/web/veronikatoth.sk/user/themes/veronika/` |

Tieto údaje **vidí len GitHub** (sú šifrované). V kóde workflowu sa na ne odkazuje
len menom, nikde sa nezobrazujú.

---

## 4. Ako deploy funguje

- Po **push do `main`**, ktorý zmení čokoľvek v `grav-theme/veronika/**`,
  sa automaticky spustí workflow „Deploy témy na Websupport (SFTP)".
- Dá sa spustiť aj **ručne**: GitHub → záložka **Actions** → vybrať workflow →
  **Run workflow**.
- Workflow nahrá obsah `grav-theme/veronika/` do `SFTP_THEME_PATH`.
- `delete_remote_files: false` = na serveri sa nič nemaže, len prepisuje/dopĺňa.

---

## 5. Poradie krokov

1. (Fáza 2) Nainštalovať Grav + nahrať tému/obsah/konfig ručne, overiť `/admin`.
2. Vytvoriť obmedzené FTP konto (kap. 2).
3. Vložiť Secrets (kap. 3).
4. Spustiť workflow ručne (Actions → Run workflow) a overiť, že sa téma nahrala.
5. Odvtedy sa každá zmena kódu témy nasadí automaticky po push do `main`.
