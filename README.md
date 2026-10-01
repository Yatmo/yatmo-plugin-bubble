# Plugin Bubble « Yatmo Neighbourhood Map »

Un plugin Bubble gratuit, publié sur le marketplace de plugins de bubble.io, qui apporte trois **éléments visuels** à placer dans l'éditeur Bubble : la carte Yatmo (iframe), les lieux proches et le texte de quartier, alimentés par une adresse ou des coordonnées (champ de base de données, saisie, résultat de recherche...). Pendant des plugins WordPress, Odoo, Drupal et du tutoriel Webflow.

Bubble n'a pas d'API ni de CLI pour les plugins : tout se saisit dans l'**éditeur de plugins** (bubble.io > My plugins > New plugin). Ce dossier contient exactement ce qu'il faut y coller. Compter 30 minutes.

## 1. Onglet General

| Champ | Valeur |
|---|---|
| Plugin name | `Yatmo Neighbourhood Map` |
| Description | `Real estate map, points of interest with travel times and an indexable neighbourhood text for property pages, from Yatmo. Three visual elements: Yatmo Map (interactive map with schools, shops, public transport, isochrones), Yatmo Places (nearest places by category with walking, cycling, driving or transit times) and Yatmo Text (a written description of the neighbourhood). Give them an address or coordinates from your database. 25 countries, 23 languages. Requires a Yatmo licence key: https://yatmo.com` |
| Categories | Visual elements, Data (things), Maps |
| Documentation link | `https://documentation.yatmo.com/plugins/bubble` |
| Icon | `Plugins/WordPress/yatmo-map/assets/icon-256x256.png` |
| License | MIT (texte libre) |

## 2. Onglet Shared (headers)

Dans **Shared headers** (chargés une fois par page), coller `shared-headers.html` :

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@yatmo/elements@1/dist/yatmo-elements.js"></script>
```

## 3. Onglet Elements

Créer trois éléments. Pour chacun : **Fields** (propriétés exposées dans l'éditeur Bubble, dans l'ordre), puis le code des fonctions `initialize` et `update` (dans l'éditeur de code de l'élément), et dans **Element settings** cocher *Can fit width* et *Can fit height* (Standard element, pas Responsive-only).

### 3.1 Yatmo Map (`yatmo_map`)

Fields :

| Name | Caption | Type | Default | Note |
|---|---|---|---|---|
| `license_key` | Yatmo frontend key | text | | obligatoire |
| `country` | Country | text | `BE` | code pays |
| `language` | Language | text | `EN` | |
| `address` | Address | text | | ou latitude + longitude |
| `latitude` | Latitude | number | | |
| `longitude` | Longitude | number | | |
| `mode` | Layout | dropdown (`overlay`, `overlay-scores`, `map-top`, `map`, `summary`, `summary-tabs`) | `overlay` | |
| `zoom` | Zoom | number | `15` | 7 à 20 |
| `map_style` | Map style | number | `1` | 1 à 7 |
| `accent_color` | Accent colour | color | `#428BFF` | |
| `marker` | Marker | dropdown (`pin`, `circle`) | `pin` | |
| `circle_radius` | Circle radius (m) | number | `300` | |
| `rounded` | Rounded corners (px) | number | `0` | |
| `isochrone` | Isochrones | dropdown (`off`, `left`, `right`) | `off` | |
| `route_from` | Routes | dropdown (`off`, `left`, `right`, `popup`) | `off` | |

Code : `elements/yatmo-map.js` (une fonction `initialize`, une fonction `update`).

### 3.2 Yatmo Places (`yatmo_places`)

Fields : `license_key`, `country`, `language`, `address`, `latitude`, `longitude` comme ci-dessus, puis

| Name | Caption | Type | Default |
|---|---|---|---|
| `categories` | Categories | text | `education,transport,shopping` |
| `travel_mode` | Travel time shown | dropdown (`walking`, `bicycling`, `driving`, `transit`) | `walking` |
| `limit` | Places per category | number | `1` |
| `heading` | Heading level | dropdown (`h2`, `h3`, `h4`) | `h3` |

Code : `elements/yatmo-places.js`.

### 3.3 Yatmo Text (`yatmo_text`)

Fields : `license_key`, `country`, `language`, `address`, `latitude`, `longitude`, puis

| Name | Caption | Type | Default |
|---|---|---|---|
| `paragraphs` | Paragraphs | text | (vide = tous) |
| `heading` | Heading level | dropdown (`h2`, `h3`, `h4`) | `h3` |
| `titles` | Headings name | dropdown (`street-city`, `city`, `generic`) | `street-city` |

Code : `elements/yatmo-text.js`.

Les trois éléments déclenchent un **event** `loaded` (à déclarer dans l'onglet Events de l'élément) et exposent l'**état** `address_found` (yes/no, onglet States), utile pour afficher un message quand l'adresse n'est pas trouvée.

## 4. Tester

Dans l'éditeur de plugins, **Test plugin** sur une app Bubble jetable : poser les trois éléments sur une page, lier `address` à un champ d'une chose « Property », mettre une clé frontend dont la liste de domaines contient `*.bubbleapps.io`. Vérifier : la carte charge, les lieux et le texte apparaissent, et un changement d'adresse (nouvelle chose affichée) régénère les trois.

## 5. Publier

Onglet **Settings** du plugin : *Publish* (gratuit, public). Bubble revoit la fiche (quelques jours). Puis ajouter le lien de la fiche dans la doc (`documentation.yatmo.com/plugins/bubble`, page à créer à partir de la page Webflow, mêmes options) et dans le README de l'organisation GitHub.

## 6. Pièges

- Les champs `number` arrivent `undefined` quand ils sont vides ; les dropdowns arrivent avec la valeur texte.
- `update` est appelé à chaque changement de propriété et au chargement : le code ne reconstruit l'élément que si les attributs changent (comparaison de la chaîne HTML).
- Les éléments Bubble sont dimensionnés par l'éditeur : la carte prend `height: 100%` de l'élément, c'est la hauteur de l'élément dans l'éditeur qui compte.
- Les web components sont chargés par le header partagé une seule fois ; `customElements.whenDefined('yatmo-map')` dans `initialize` évite de rendre avant le chargement du script.
