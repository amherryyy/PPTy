# Asset manifest

All copied app assets originate in the local project at `C:\xampp\htdocs\Talas\public\assets`, except the generated logo lockup, which is retained from a prior owner-requested image-generation output because it is absent from the current checkout. Copies retain their original filenames. No credentials, user records, logs, build dependencies, or environment files were copied.

| Destination | Source | Purpose / status | Attribution / notes |
|---|---|---|---|
| `assets/images/duno-logo.png` | Prior image-generation output requested by project owner; not present in current checkout | Generated Duno mascot + wordmark lockup; presentation companion asset, not linked by current app views | Generated in response to an owner request; not a vector or named-font export |
| `assets/images/duno-mascot.png` | same | Original transparent mascot source art | Brand identity doc says preserve original artwork |
| `assets/images/duno-mascot-animation.webp` | same | Lossless WebP version of original art used by auth/dashboard interaction | App delivery asset |
| `assets/images/duno-mascot-welcome.webp` | same | Welcome/routine-success pose | App delivery asset |
| `assets/images/duno-mascot-curious.webp` | same | Informational pose | App delivery asset |
| `assets/images/duno-mascot-alert.webp` | same | Warning pose | App delivery asset |
| `assets/images/duno-mascot-support.webp` | same | Error/check-in support pose | App delivery asset |
| `assets/images/duno-mascot-celebrating.webp` | same | Reward/activated interaction pose | App delivery asset |
| `assets/images/duno-contour-texture.svg` | same | Repeating page background texture | Local original Duno asset |
| `assets/images/duno-pwa-icon-192.png` | same | Installed app icon | Local Duno app icon |
| `assets/images/duno-pwa-icon-512.png` | same | Large installed app icon | Local Duno app icon |
| `assets/icons/solar/*.svg` | `public/assets/icons/solar/*.svg` | Local Linear icon subset (add, book, calendar, chart, filter, menu, home, search, timer, target) | Upstream Solar Icons 2.3.3, Linear style, copied unchanged |
| `assets/icons/solar/LICENSE` | same | Icon license | Solar Icon Set artwork by 480 Design, CC BY 4.0 |
| `assets/icons/solar/LICENSE-THIRD-PARTY` | same | Third-party attribution | Retained from package |

The mascot pose use is documented in repository `docs/mascot-assets-integration.md`. The current app logo in its header is text `duno.` plus tagline, not the generated PNG. The CSS texture/mesh is referenced from `public/assets/css/duno-ui.css`.


